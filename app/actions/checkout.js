'use server'

import { createClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe-server'

/**
 * Checkout Server Action
 * 
 * SECURITY: Never trust client-side prices. Always re-fetch from database.
 * All prices, stock checks, and totals are calculated server-side.
 * 
 * TODO: Add SELECT FOR UPDATE stock locking to prevent race conditions
 * on limited-stock items (stock_quantity > 0). For made-to-order items
 * (stock_quantity = -1), race conditions are not a concern.
 */

export async function createCheckoutSession() {
  const supabase = await createClient()

  // ── 1. Authenticate user ──────────────────────────────────────
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Please sign in to checkout')
  }

  // ── 2. Fetch cart with product details ─────────────────────────
  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (cartError || !cart) {
    throw new Error('Your cart is empty')
  }

  const { data: cartItems, error: itemsError } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      customization,
      product:product_id (
        id,
        name,
        arabic_name,
        price,
        stock_quantity,
        image,
        dimensions,
        description
      )
    `)
    .eq('cart_id', cart.id)

  if (itemsError || !cartItems || cartItems.length === 0) {
    throw new Error('Your cart is empty')
  }

  // ── 3. Validate stock and re-fetch prices (NEVER trust client) ─
  const lineItems = []
  let subtotal = 0

  for (const item of cartItems) {
    const product = item.product
    if (!product) {
      throw new Error('A product in your cart is no longer available')
    }

    // Check stock — made-to-order items use stock_quantity = -1
    if (product.stock_quantity !== -1 && product.stock_quantity < item.quantity) {
      throw new Error(`"${product.name}" is no longer in stock. Only ${product.stock_quantity} available.`)
    }

    // Use database price, never client-side price
    const itemTotal = product.price * item.quantity
    subtotal += itemTotal

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          description: `${product.dimensions}${item.customization ? ' — Custom: ' + item.customization : ''}`,
          images: product.image ? [`${process.env.NEXT_PUBLIC_APP_URL}${product.image}`] : [],
        },
        unit_amount: product.price,
      },
      quantity: item.quantity,
    })
  }

  // ── 4. Create pending order ───────────────────────────────────
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'pending',
      subtotal,
      shipping: 0,        // Free shipping
      tax: 0,             // Tax handled by Stripe Tax if enabled
      total: subtotal,
      customer_email: user.email,
      customer_name: user.user_metadata?.full_name || '',
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error('Order creation failed:', orderError)
    throw new Error('Failed to create order. Please try again.')
  }

  // ── 5. Create Stripe checkout session ──────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    success_url: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/cart`,
    customer_email: user.email,
    metadata: {
      order_id: order.id,
      user_id: user.id,
    },
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'AU', 'FR', 'DE', 'AE', 'SA'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'usd' },
          display_name: 'Complimentary White-Glove Delivery',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 14 },
          },
        },
      },
    ],
    // automatic_tax: { enabled: true }, // Enable after registering for Stripe Tax
  })

  // ── 6. Link order to Stripe session ──────────────────────────
  const { error: updateError } = await supabase
    .from('orders')
    .update({ stripe_session_id: session.id })
    .eq('id', order.id)

  if (updateError) {
    console.error('Failed to link order to Stripe session:', updateError)
    // Non-fatal — webhook can still match via metadata
  }

  // Return Stripe checkout URL
  return { url: session.url }
}
