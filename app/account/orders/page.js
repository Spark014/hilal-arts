import { createClient } from '../../../lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?returnUrl=/account/orders')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const statusColors = {
    pending: '#d97706',
    paid: '#059669',
    processing: '#2563eb',
    shipped: '#7c3aed',
    delivered: '#059669',
    cancelled: '#dc2626'
  }

  return (
    <div className={styles.ordersPage}>
      <div className={styles.ordersContainer}>
        <div className={styles.ordersArabic}>طلباتي</div>
        <h1 className={styles.ordersTitle}>Order History</h1>

        {!orders || orders.length === 0 ? (
          <div className={styles.ordersEmpty}>
            <p>You haven't placed any orders yet.</p>
            <Link href="/collections" className={styles.ordersCta}>Browse Collections</Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderNumber}>Order #{order.id.slice(0, 8)}</span>
                    <span className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <span 
                    className={styles.orderStatus}
                    style={{ background: statusColors[order.status] || '#6b7280' }}
                  >
                    {order.status}
                  </span>
                </div>
                
                <div className={styles.orderItems}>
                  {order.order_items?.map(item => (
                    <div key={item.id} className={styles.orderItem}>
                      <span className={styles.orderItemName}>{item.product_name}</span>
                      <span className={styles.orderItemQty}>×{item.quantity}</span>
                      <span className={styles.orderItemPrice}>${item.price_at_time}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <span className={styles.orderTotalLabel}>Total</span>
                  <span className={styles.orderTotal}>${order.total_amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}