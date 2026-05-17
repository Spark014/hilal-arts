import { createClient } from '../supabase-server'

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name')
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  
  return data || []
}

export async function getProductBySlug(slug) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      collection:collection_id(*),
      product_images(*),
      product_features(*),
      product_customizations(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) {
    console.error('Error fetching product:', error)
    return null
  }
  
  return data
}

export async function getFeaturedProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('name')
  
  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
  
  return data || []
}

export async function getProductsByCollection(collectionSlug) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      collection:collection_id(*)
    `)
    .eq('is_active', true)
    .eq('collection.slug', collectionSlug)
    .order('name')
  
  if (error) {
    console.error('Error fetching products by collection:', error)
    return []
  }
  
  return data || []
}
