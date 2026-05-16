import { createClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe-server'
import { headers } from 'next/headers'

/**
 * Stripe Webhook Handler
 * 
 * SECURITY:
 * - Signature verification prevents spoofed webhooks
 * - Atomic UPDATE (status='pending') → idempotent — safe for Stripe retries
 * - No stock decrement here — that happens at checkout creation time
 * - Cart clearing happens after successful payment confirmation
 * 
 * TODO:
 * - Add structured logging (JSON to stdout for Vercel log drains)
 * - Add order confirmation email trigger
 * - Handle charge.dispute.created for chargebacks
 */

export async function POST(request) {
  const payload = await request.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return new Response('Missing signature', { status: 400 })
  }

  // ── 1. Verify webhook signature ────────────────────────────────
  let event
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // ── 2. Log structured event ────────────────────────────────────
  console.log(JSON.stringify({
    event: 'stripe_webhook_received',
    type: event.type,
    id: event.id,
    timestamp: new Date().toISOString(),
  }))

  // ── 3. Handle events ─────────────────────────────────────────
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutCompleted(event.data.object)
        break
      }
      case 'checkout.session.async_payment_failed': {
        await handlePaymentFailed(event.data.object)
        break
      }
      case 'checkout.session.expired': {
        await handleSessionExpired(event.data.object)
        break
      }
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error(JSON.stringify({
      event: 'stripe_webhook_handler_error',
      type: event.type,
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    }))
    // Return 500 so Stripe retries
    return new Response(`Handler error: ${err.message}`, { status: 500 })
  }

  // Return 200 to acknowledge receipt
  return new Response('OK', { status: 200 })
}

async function handleCheckoutCompleted(session) {
  const supabase = await createClient()

  // ── Atomic idempotency: only process if still pending ──────────
  // This single UPDATE is atomic — concurrent webhooks race, one wins
  const { data: order, error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      stripe_payment_intent_id: session.payment_intent,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_session_id', session.id)
    .eq('status', 'pending')   // ← atomic guard
    .select('id, user_id')
    .single()

  if (updateError) {
    // Could be PGRST116 (no matching row) — already processed or order not found
    console.warn('Order update skipped:', updateError.message)
    return
  }

  if (!order) {
    console.warn(`Order already processed or not found for session ${session.id}`)
    return
  }

  console.log(JSON.stringify({
    event: 'order_paid',
    order_id: order.id,
    session_id: session.id,
    timestamp: new Date().toISOString(),
  }))

  // ── Fetch line items from Stripe ─────────────────────────────
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

  // ── Create order_items ───────────────────────────────────────
  const orderItems = lineItems.data.map((item) => ({
    order_id: order.id,
    product_name: item.description || item.price?.product?.name || 'Unknown',
    quantity: item.quantity,
    price_at_purchase: item.amount_total,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Failed to create order items:', itemsError)
    // Non-fatal — order is already marked paid, items can be reconciled manually
  }

  // ── Add status history entry ─────────────────────────────────
  await supabase
    .from('order_status_history')
    .insert({
      order_id: order.id,
      status: 'paid',
      notes: 'Payment confirmed via Stripe webhook',
    })

  // ── Clear user's cart ────────────────────────────────────────
  if (order.user_id) {
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', order.user_id)
      .single()

    if (cart) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)
    }
  }

  // ── TODO: Send order confirmation email ─────────────────────
  // await sendOrderConfirmationEmail(order.id)
}

async function handlePaymentFailed(session) {
  const supabase = await createClient()

  // Mark order as cancelled
  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('stripe_session_id', session.id)

  if (error) {
    console.error('Failed to mark order cancelled:', error)
  }

  // TODO: Restore inventory for limited-stock items
  // (stock was reserved at checkout creation, not decremented yet)
}

async function handleSessionExpired(session) {
  const supabase = await createClient()

  // Mark pending order as cancelled
  const { data: order } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('stripe_session_id', session.id)
    .eq('status', 'pending')
    .select('id')
    .single()

  if (order) {
    console.log(JSON.stringify({
      event: 'order_expired',
      order_id: order.id,
      session_id: session.id,
      timestamp: new Date().toISOString(),
    }))
  }

  // TODO: Restore inventory for limited-stock items
}
