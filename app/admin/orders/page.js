import { getAdminOrders } from '../../../lib/services/admin'
import Link from 'next/link'
import styles from '../layout.module.css'

export const dynamic = 'force-dynamic'

function formatCurrency(cents) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
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
  }
  return `${styles.badge} ${map[status] || styles.badgeGray}`
}

const statuses = ['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

export default async function AdminOrders({ searchParams }) {
  const statusFilter = searchParams?.status || 'all'
  const orders = await getAdminOrders(statusFilter)
  
  return (
    <>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>Orders</h1>
      </div>
      
      {/* Status filter tabs */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap',
      }}>
        {statuses.map(s => (
          <Link
            key={s}
            href={`/admin/orders${s === 'all' ? '' : `?status=${s}`}`}
            className={`${styles.btn} ${s === statusFilter ? styles.btnPrimary : styles.btnSecondary} ${styles.btnSmall}`}
            style={{ textTransform: 'capitalize' }}
          >
            {s}
          </Link>
        ))}
      </div>
      
      <div className={styles.tableWrap}>
        {orders.length > 0 ? (
          <>
            <div className={styles.tableHeader}>
              <span className={styles.tableTitle}>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link href={`/admin/orders/${order.id}`} style={{ color: 'var(--burgundy-deep)', textDecoration: 'none', fontWeight: 600 }}>
                        #{order.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customer_name || '—'}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--cream-dark)' }}>{order.customer_email}</div>
                    </td>
                    <td>{order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''}</td>
                    <td><span className={statusBadge(order.status)}>{order.status}</span></td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(order.total)}</td>
                    <td style={{ fontSize: '0.85rem' }}>{formatDate(order.created_at)}</td>
                    <td>
                      <Link href={`/admin/orders/${order.id}`} className={styles.btnIcon} title="View details">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>No orders found</div>
            <div className={styles.emptyText}>
              {statusFilter !== 'all' ? `No ${statusFilter} orders.` : 'Orders will appear here once customers start purchasing.'}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
