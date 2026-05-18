import { getAdminOrderById } from '../../../../lib/services/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from '../../layout.module.css'
import OrderActions from './OrderActions'

export const dynamic = 'force-dynamic'

function formatCurrency(cents) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
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

export default async function OrderDetail({ params }) {
  const { id } = params
  const order = await getAdminOrderById(id)
  
  if (!order) {
    notFound()
  }
  
  return (
    <>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>Order #{order.id.slice(0, 8)}</h1>
        <Link href="/admin/orders" className={`${styles.btn} ${styles.btnSecondary}`}>
          ← Back to Orders
        </Link>
      </div>
      
      {/* Status + Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className={styles.formCard}>
          <div className={styles.formCardTitle}>Order Status</div>
          <div style={{ marginBottom: '16px' }}>
            <span className={statusBadge(order.status)} style={{ fontSize: '0.72rem', padding: '5px 14px' }}>
              {order.status}
            </span>
          </div>
          <OrderActions orderId={order.id} currentStatus={order.status} trackingNumber={order.tracking_number} />
        </div>
        
        <div className={styles.formCard}>
          <div className={styles.formCardTitle}>Customer</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <span style={{ fontWeight: 600 }}>{order.customer_name || '—'}</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--cream-dark)' }}>{order.customer_email}</div>
            {order.shipping_address && (
              <div style={{ fontSize: '0.9rem', color: 'var(--ink)', marginTop: '8px', lineHeight: 1.6 }}>
                {order.shipping_name && <div>{order.shipping_name}</div>}
                <div>{order.shipping_address}</div>
                <div>{[order.shipping_city, order.shipping_country, order.shipping_postal_code].filter(Boolean).join(', ')}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Items */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Items</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.order_items || []).map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{item.product_name}</div>
                  {item.customization && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--cream-dark)', fontStyle: 'italic' }}>
                      Custom: {item.customization}
                    </div>
                  )}
                </td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.price_at_purchase)}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(item.price_at_purchase * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ textAlign: 'right', fontWeight: 600 }}>Subtotal</td>
              <td style={{ fontWeight: 600 }}>{formatCurrency(order.subtotal)}</td>
            </tr>
            {order.shipping > 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'right' }}>Shipping</td>
                <td>{formatCurrency(order.shipping)}</td>
              </tr>
            )}
            {order.tax > 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'right' }}>Tax</td>
                <td>{formatCurrency(order.tax)}</td>
              </tr>
            )}
            <tr>
              <td colSpan="3" style={{ textAlign: 'right', fontWeight: 600, fontSize: '1.1rem' }}>Total</td>
              <td style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--burgundy-deep)' }}>{formatCurrency(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Status History */}
      {order.order_status_history && order.order_status_history.length > 0 && (
        <div className={styles.formCard}>
          <div className={styles.formCardTitle}>Status History</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {order.order_status_history.map((entry) => (
              <div key={entry.id} style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                padding: '10px 0', borderBottom: '1px solid rgba(93,26,31,0.04)',
              }}>
                <span className={statusBadge(entry.status)}>{entry.status}</span>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--cream-dark)' }}>{formatDate(entry.created_at)}</div>
                  {entry.notes && <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>{entry.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Meta */}
      <div className={styles.formCard}>
        <div className={styles.formCardTitle}>Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
          <div><strong>Order ID:</strong> {order.id}</div>
          <div><strong>Created:</strong> {formatDate(order.created_at)}</div>
          {order.stripe_session_id && <div><strong>Stripe Session:</strong> {order.stripe_session_id.slice(0, 24)}...</div>}
          {order.stripe_payment_intent_id && <div><strong>Payment Intent:</strong> {order.stripe_payment_intent_id.slice(0, 24)}...</div>}
          {order.tracking_number && <div><strong>Tracking:</strong> {order.tracking_number}</div>}
          <div><strong>Currency:</strong> {(order.currency || 'usd').toUpperCase()}</div>
        </div>
      </div>
    </>
  )
}
