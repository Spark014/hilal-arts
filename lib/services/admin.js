import { getAdminClient } from '../supabase-admin'

// ─── Dashboard Stats ────────────────────────────────────────

export async function getDashboardStats() {
  const supabase = getAdminClient()
  
  const [
    { count: productCount },
    { count: orderCount },
    { count: commissionCount },
    { data: recentOrders },
    { data: recentCommissions },
    { data: paidOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('commissions').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(10),
    supabase.from('commissions').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('total').eq('status', 'paid'),
  ])
  
  const totalRevenue = (paidOrders || []).reduce((sum, o) => sum + (o.total || 0), 0)
  
  return {
    productCount: productCount || 0,
    orderCount: orderCount || 0,
    commissionCount: commissionCount || 0,
    totalRevenue,
    recentOrders: recentOrders || [],
    recentCommissions: recentCommissions || [],
  }
}

// ─── Products ────────────────────────────────────────────────

export async function getAdminProducts() {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, collection:collection_id(id, name, slug)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Admin: Error fetching products:', error)
    return []
  }
  return data || []
}

export async function getAdminProductById(id) {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      collection:collection_id(*),
      product_images(*),
      product_features(*),
      product_customizations(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Admin: Error fetching product:', error)
    return null
  }
  return data
}

// ─── Collections ─────────────────────────────────────────────

export async function getAdminCollections() {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('Admin: Error fetching collections:', error)
    return []
  }
  return data || []
}

export async function getAdminCollectionById(id) {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Admin: Error fetching collection:', error)
    return null
  }
  return data
}

// ─── Orders ──────────────────────────────────────────────────

export async function getAdminOrders(statusFilter) {
  const supabase = getAdminClient()
  let query = supabase
    .from('orders')
    .select('*, order_items(*, product:product_id(name, slug))')
    .order('created_at', { ascending: false })
  
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }
  
  const { data, error } = await query
  if (error) {
    console.error('Admin: Error fetching orders:', error)
    return []
  }
  return data || []
}

export async function getAdminOrderById(id) {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*, product:product_id(name, slug, image_url)),
      order_status_history(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Admin: Error fetching order:', error)
    return null
  }
  
  // Sort status history by date
  if (data?.order_status_history) {
    data.order_status_history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
  
  return data
}

// ─── Commissions ─────────────────────────────────────────────

export async function getAdminCommissions(statusFilter) {
  const supabase = getAdminClient()
  let query = supabase
    .from('commissions')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }
  
  const { data, error } = await query
  if (error) {
    console.error('Admin: Error fetching commissions:', error)
    return []
  }
  return data || []
}

export async function getAdminCommissionById(id) {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('commissions')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Admin: Error fetching commission:', error)
    return null
  }
  return data
}
