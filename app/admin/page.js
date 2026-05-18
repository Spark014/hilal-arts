import { getDashboardStats } from '../../lib/services/admin'
import Link from 'next/link'
import styles from './layout.module.css'

export const dynamic = 'force-dynamic'

function formatCurrency(cents) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function statusBadge(status) {
  const map = {
    pending: styles.badgeYellow,
    paid: styles.badgeGreen,
    processing: styles.badgeBlue,
    shipped: styles.badgePurple,
    delivered: styles.badgeGreen,
    cancelled: styles.badgeRed,
    refunded: styles.badgeRed,
    new: styles.badgeYellow,
    contacted: styles.badgeBlue,
    quoted: styles.badgePurple,
    accepted: styles.badgeGreen,
    in_progress: styles.badgeBlue,
    completed: styles.badgeGreen,
  }
  return `${styles.badge} ${map[status] || styles.badgeGray}`
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  
  return (
    <>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>Dashboard</h1>
      </div>
      
      {/* Stats */}
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Revenue</div>
          <div className={styles.statValue}>{formatCurrency(stats.totalRevenue)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Orders</div>
          <div className={styles.statValue}>{stats.orderCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Products</div>
          <div className={styles.statValue}>{stats.productCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Commissions</div>
          <div className={styles.statValue}>{stats.commissionCount}</div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Recent Orders</span>
          <Link href="/admin/orders" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}>
            View All
          </Link>
        </div>
        {stats.recentOrders.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/admin/orders/${order.id}`} style={{ color: 'var(--burgundy-deep)', textDecoration: 'none', fontWeight: 600 }}>
                      #{order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td>{order.customer_name || order.customer_email}</td>
                  <td><span className={statusBadge(order.status)}>{order.status}</span></td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(order.total)}</td>
                  <td>{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>No orders yet</div>
            <div className={styles.emptyText}>Orders will appear here once customers start purchasing.</div>
          </div>
        )}
      </div>
      
      {/* Recent Commissions */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Recent Commissions</span>
          <Link href="/admin/commissions" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}>
            View All
          </Link>
        </div>
        {stats.recentCommissions.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Verse</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentCommissions.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.email}</td>
                  <td><span className={statusBadge(c.status)}>{c.status}</span></td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.desired_verse || '—'}
                  </td>
                  <td>{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>No commissions yet</div>
            <div className={styles.emptyText}>Commission inquiries will appear here.</div>
          </div>
        )}
      </div>
    </>
  )
}
