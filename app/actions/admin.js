'use server'

import { getAdminClient } from '../../lib/supabase-admin'
import { createClient } from '../../lib/supabase-server'
import { revalidatePath } from 'next/cache'

// ─── Auth Helper ─────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }
  
  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()
  
  if (!profile?.is_admin) {
    return { error: 'Not authorized — admin access required' }
  }
  
  return { user }
}

// ─── Product Actions ─────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function createProduct(formData) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  
  const supabase = getAdminClient()
  
  const name = formData.get('name')
  const slug = formData.get('slug') || slugify(name)
  
  const productData = {
    name,
    slug,
    arabic_name: formData.get('arabic_name') || null,
    collection_id: formData.get('collection_id') || null,
    script: formData.get('script') || null,
    dimensions: formData.get('dimensions') || null,
    canvas_size: formData.get('canvas_size') || 'medium',
    price: parseInt(formData.get('price')) || 0,
    customization_fee: parseInt(formData.get('customization_fee')) || 0,
    processing_time: formData.get('processing_time') || null,
    description: formData.get('description') || null,
    calligrapher: formData.get('calligrapher') || null,
    image_url: formData.get('image_url') || null,
    is_featured: formData.get('is_featured') === 'true',
    is_active: formData.get('is_active') !== 'false',
    stock_quantity: parseInt(formData.get('stock_quantity')) || 1,
  }
  
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single()
  
  if (error) {
    console.error('Create product error:', error)
    return { error: error.message }
  }
  
  // Handle features
  const featuresRaw = formData.get('features')
  if (featuresRaw) {
    const features = JSON.parse(featuresRaw)
    if (features.length > 0) {
      await supabase.from('product_features').insert(
        features.map((text, i) => ({ product_id: data.id, text, sort_order: i }))
      )
    }
  }
  
  // Handle customizations
  const customsRaw = formData.get('customizations')
  if (customsRaw) {
    const customizations = JSON.parse(customsRaw)
    if (customizations.length > 0) {
      await supabase.from('product_customizations').insert(
        customizations.map((label, i) => ({ product_id: data.id, label, sort_order: i }))
      )
    }
  }
  
  // Handle images
  const imagesRaw = formData.get('images')
  if (imagesRaw) {
    const images = JSON.parse(imagesRaw)
    if (images.length > 0) {
      await supabase.from('product_images').insert(
        images.map((url, i) => ({ product_id: data.id, url, sort_order: i }))
      )
    }
  }
  
  revalidatePath('/admin/products')
  revalidatePath('/collections')
  revalidatePath('/')
  
  return { success: true, product: data }
}

export async function updateProduct(id, formData) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  
  const supabase = getAdminClient()
  
  const productData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    arabic_name: formData.get('arabic_name') || null,
    collection_id: formData.get('collection_id') || null,
    script: formData.get('script') || null,
    dimensions: formData.get('dimensions') || null,
    canvas_size: formData.get('canvas_size') || 'medium',
    price: parseInt(formData.get('price')) || 0,
    customization_fee: parseInt(formData.get('customization_fee')) || 0,
    processing_time: formData.get('processing_time') || null,
    description: formData.get('description') || null,
    calligrapher: formData.get('calligrapher') || null,
    image_url: formData.get('image_url') || null,
    is_featured: formData.get('is_featured') === 'true',
    is_active: formData.get('is_active') !== 'false',
    stock_quantity: parseInt(formData.get('stock_quantity')) || 1,
    updated_at: new Date().toISOString(),
  }
  
  const { error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
  
  if (error) {
    console.error('Update product error:', error)
    return { error: error.message }
  }
  
  // Replace features
  const featuresRaw = formData.get('features')
  if (featuresRaw !== null) {
    await supabase.from('product_features').delete().eq('product_id', id)
    const features = JSON.parse(featuresRaw)
    if (features.length > 0) {
      await supabase.from('product_features').insert(
        features.map((text, i) => ({ product_id: id, text, sort_order: i }))
      )
    }
  }
  
  // Replace customizations
  const customsRaw = formData.get('customizations')
  if (customsRaw !== null) {
    await supabase.from('product_customizations').delete().eq('product_id', id)
    const customizations = JSON.parse(customsRaw)
    if (customizations.length > 0) {
      await supabase.from('product_customizations').insert(
        customizations.map((label, i) => ({ product_id: id, label, sort_order: i }))
      )
    }
  }
  
  // Replace images
  const imagesRaw = formData.get('images')
  if (imagesRaw !== null) {
    await supabase.from('product_images').delete().eq('product_id', id)
    const images = JSON.parse(imagesRaw)
    if (images.length > 0) {
      await supabase.from('product_images').insert(
        images.map((url, i) => ({ product_id: id, url, sort_order: i }))
      )
    }
  }
  
  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}/edit`)
  revalidatePath('/collections')
  revalidatePath('/')
  
  return { success: true }
}

export async function deleteProduct(id) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  
  const supabase = getAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  
  if (error) {
    console.error('Delete product error:', error)
    return { error: error.message }
  }
  
  revalidatePath('/admin/products')
  revalidatePath('/collections')
  revalidatePath('/')
  
  return { success: true }
}

export async function toggleProductField(id, field, value) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  
  if (!['is_active', 'is_featured'].includes(field)) {
    return { error: 'Invalid field' }
  }
  
  const supabase = getAdminClient()
  const { error } = await supabase
    .from('products')
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq('id', id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/products')
  revalidatePath('/collections')
  revalidatePath('/')
  
  return { success: true }
}

// ─── Collection Actions ──────────────────────────────────────

export async function createCollection(formData) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  
  const supabase = getAdminClient()
  
  const name = formData.get('name')
  const collectionData = {
    name,
    slug: formData.get('slug') || slugify(name),
    arabic_name: formData.get('arabic_name') || null,
    description: formData.get('description') || null,
    image: formData.get('image') || null,
    sort_order: parseInt(formData.get('sort_order')) || 0,
    is_active: formData.get('is_active') !== 'false',
  }
  
  const { data, error } = await supabase
    .from('collections')
    .insert(collectionData)
    .select()
    .single()
  
  if (error) {
    console.error('Create collection error:', error)
    return { error: error.message }
  }
  
  revalidatePath('/admin/collections')
  revalidatePath('/collections')
  revalidatePath('/')
  
  return { success: true, collection: data }
}

export async function updateCollection(id, formData) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  
  const supabase = getAdminClient()
  
  const collectionData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    arabic_name: formData.get('arabic_name') || null,
    description: formData.get('description') || null,
    image: formData.get('image') || null,
    sort_order: parseInt(formData.get('sort_order')) || 0,
    is_active: formData.get('is_active') !== 'false',
  }
  
  const { error } = await supabase
    .from('collections')
    .update(collectionData)
    .eq('id', id)
  
  if (error) {
    console.error('Update collection error:', error)
    return { error: error.message }
  }
  
  revalidatePath('/admin/collections')
  revalidatePath('/collections')
  revalidatePath('/')
  
  return { success: true }
}

export async function deleteCollection(id) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  
  const supabase = getAdminClient()
  const { error } = await supabase.from('collections').delete().eq('id', id)
  
  if (error) {
    console.error('Delete collection error:', error)
    return { error: error.message }
  }
  
  revalidatePath('/admin/collections')
  revalidatePath('/collections')
  revalidatePath('/')
  
  return { success: true }
}

// ─── Order Actions ───────────────────────────────────────────

export async function updateOrderStatus(orderId, status, notes) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  
  const supabase = getAdminClient()
  
  // Update order status
  const { error: orderError } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
  
  if (orderError) {
    console.error('Update order status error:', orderError)
    return { error: orderError.message }
  }
  
  // Add to status history
  await supabase.from('order_status_history').insert({
    order_id: orderId,
    status,
    notes: notes || null,
  })
  
  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
  
  return { success: true }
}

export async function updateOrderTracking(orderId, trackingNumber) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  
  const supabase = getAdminClient()
  const { error } = await supabase
    .from('orders')
    .update({ tracking_number: trackingNumber, updated_at: new Date().toISOString() })
    .eq('id', orderId)
  
  if (error) return { error: error.message }
  
  revalidatePath(`/admin/orders/${orderId}`)
  return { success: true }
}

// ─── Commission Actions ──────────────────────────────────────

export async function updateCommissionStatus(commissionId, status, adminNotes) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  
  const supabase = getAdminClient()
  
  const updateData = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (adminNotes !== undefined) {
    updateData.admin_notes = adminNotes
  }
  
  const { error } = await supabase
    .from('commissions')
    .update(updateData)
    .eq('id', commissionId)
  
  if (error) {
    console.error('Update commission status error:', error)
    return { error: error.message }
  }
  
  revalidatePath('/admin/commissions')
  return { success: true }
}
