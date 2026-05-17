import { createClient } from '../../lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?returnUrl=/account')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className={styles.accountPage}>
      <div className={styles.accountContainer}>
        <div className={styles.accountArabic}>حسابي</div>
        <h1 className={styles.accountTitle}>My Account</h1>

        <div className={styles.accountGrid}>
          <div className={styles.accountCard}>
            <h2 className={styles.accountCardTitle}>Profile</h2>
            <div className={styles.accountField}>
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className={styles.accountField}>
              <label>Name</label>
              <p>{profile?.full_name || 'Not set'}</p>
            </div>
            <div className={styles.accountField}>
              <label>Phone</label>
              <p>{profile?.phone || 'Not set'}</p>
            </div>
          </div>

          <div className={styles.accountCard}>
            <h2 className={styles.accountCardTitle}>Quick Links</h2>
            <div className={styles.accountLinks}>
              <Link href="/account/orders">Order History →</Link>
              <Link href="/collections">Browse Collections →</Link>
              <Link href="/commissions">Request Commission →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}