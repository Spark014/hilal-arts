'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

/**
 * Cart Server Actions
 * Used by authenticated users. Anonymous users use localStorage cart (CartContext).
 * On login: localStorage cart migrates to server cart.
 */

// ── Get or create cart ──────────────────────────────────────────
export async function getCart() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (cartError && cartError.code !== 'PGRST116') {
    console.error('getCart error:', cartError)
    return null
  }

  if (!cart) {
    const { data: newCart, error: createError } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select('id')
      .single()

    if (createError) {
      console.error('createCart error:', createError)
      return null
    }

    return { id: newCart.id, items: [] }
  }

  const { data: items, error: itemsError } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      customization,
      product:product_id (
        id,
        slug,
        name,
        arabic_name,
        price,
        image,
        collection_label,
        dimensions
      )
    `)
    .eq('cart_id', cart.id)
    .order('added_at', { ascending: false })

  if (itemsError) {
    console.error('getCartItems error:', itemsError)
    return { id: cart.id, items: [] }
  }

  return { id: cart.id, items: items || [] }
}

// ── Add item to cart ────────────────────────────────────────────
export async function addToCart(productId, quantity = 1, customization = '') {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  // Get or create cart
  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!cart) {
    const { data: newCart } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select('id')
      .single()
    cart = newCart
  }

  // Check if item already in cart
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    // Update quantity
    const { error } = await supabase
      .from('cart_items')
      .update({
        quantity: existing.quantity + quantity,
        customization: customization || existing.customization,
      })
      .eq('id', existing.id)

    if (error) throw error
  } else {
    // Insert new item
    const { error } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        product_id: productId,
        quantity,
        customization,
      })

    if (error) throw error
  }

  revalidatePath('/')
  return { success: true }
}

// ── Remove item from cart ───────────────────────────────────────
export async function removeFromCart(cartItemId) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)

  if (error) throw error

  revalidatePath('/')
  return { success: true }
}

// ── Update item quantity ──────────────────────────────────────
export async function updateQuantity(cartItemId, quantity) {
  if (quantity < 1) {
    return removeFromCart(cartItemId)
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)

  if (error) throw error

  revalidatePath('/')
  return { success: true }
}

// ── Clear cart ──────────────────────────────────────────────────
export async function clearCart() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (cart) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)

    if (error) throw error
  }

  revalidatePath('/')
  return { success: true }
}

// ── Get cart item count ─────────────────────────────────────────
export async function getCartCount() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!cart) return 0

  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('cart_id', cart.id)

  if (error || !data) return 0

  return data.reduce((sum, item) => sum + item.quantity, 0)
}

// ── Migrate localStorage cart to server ─────────────────────────
export async function migrateLocalCart(localItems) {
  if (!Array.isArray(localItems) || localItems.length === 0) {
    return { success: true, migrated: 0 }
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  let migrated = 0

  for (const item of localItems) {
    try {
      await addToCart(item.id, item.quantity, item.customization || '')
      migrated++
    } catch (err) {
      console.warn('Failed to migrate item:', item.id, err.message)
    }
  }

  return { success: true, migrated }
}
