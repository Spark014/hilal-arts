import { createClient } from '@supabase/supabase-js'

// Admin client uses service role key to bypass RLS
// ONLY use this in server actions / server components behind admin auth checks
let adminClient = null

export function getAdminClient() {
  if (adminClient) return adminClient
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Admin operations require the service role key.'
    )
  }
  
  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  
  return adminClient
}
