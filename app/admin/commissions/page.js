import { getAdminCommissions } from '../../../lib/services/admin'
import Link from 'next/link'
import styles from '../layout.module.css'
import CommissionsTable from './CommissionsTable'

export const dynamic = 'force-dynamic'

const statuses = ['all', 'new', 'contacted', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled']

export default async function AdminCommissions({ searchParams }) {
  const statusFilter = searchParams?.status || 'all'
  const commissions = await getAdminCommissions(statusFilter)
  
  return (
    <>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>Commissions</h1>
      </div>
      
      {/* Status filter */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap',
      }}>
        {statuses.map(s => (
          <Link
            key={s}
            href={`/admin/commissions${s === 'all' ? '' : `?status=${s}`}`}
            className={`${styles.btn} ${s === statusFilter ? styles.btnPrimary : styles.btnSecondary} ${styles.btnSmall}`}
            style={{ textTransform: 'capitalize' }}
          >
            {s.replace('_', ' ')}
          </Link>
        ))}
      </div>
      
      <div className={styles.tableWrap}>
        {commissions.length > 0 ? (
          <CommissionsTable commissions={commissions} />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>No commissions found</div>
            <div className={styles.emptyText}>
              {statusFilter !== 'all' ? `No ${statusFilter.replace('_', ' ')} commissions.` : 'Commission inquiries will appear here.'}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
