import { createClient } from '../../lib/supabase-server'
import { getAdminClient } from '../../lib/supabase-admin'
import AdminShell from './AdminShell'

export const metadata = {
  title: 'Admin — HILAL Arts',
  robots: 'noindex, nofollow',
}

export default async function AdminLayout({ children }) {
  // Check auth + admin status server-side
  let isAdmin = false
  let userName = ''
  
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const admin = getAdminClient()
      const { data: profile } = await admin
        .from('profiles')
        .select('is_admin, full_name')
        .eq('user_id', user.id)
        .single()
      
      isAdmin = profile?.is_admin === true
      userName = profile?.full_name || user.email || ''
    }
  } catch (e) {
    console.error('Admin layout auth check failed:', e)
  }
  
  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '16px',
        padding: '40px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: '1.6rem',
          color: 'var(--burgundy-deep)',
        }}>Access Denied</h1>
        <p style={{
          fontFamily: 'var(--font-cormorant), serif',
          color: 'var(--cream-dark)',
          maxWidth: '400px',
        }}>
          You need admin privileges to access this area. Please sign in with an admin account.
        </p>
        <a href="/auth/login?returnUrl=/admin" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 24px',
          background: 'var(--burgundy-deep)',
          color: 'var(--cream-pale)',
          textDecoration: 'none',
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: '0.72rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          borderRadius: '4px',
        }}>Sign In</a>
      </div>
    )
  }
  
  return <AdminShell userName={userName}>{children}</AdminShell>
}
