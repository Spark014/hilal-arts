import { createClient } from '../supabase-server'

export async function getCollections() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('is_active', true)
    .order('name')
  
  if (error) {
    console.error('Error fetching collections:', error)
    return []
  }
  
  return data || []
}

export async function getCollectionBySlug(slug) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) {
    console.error('Error fetching collection:', error)
    return null
  }
  
  return data
}
