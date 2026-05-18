import { getAdminCollections } from '../../../lib/services/admin'
import Link from 'next/link'
import styles from '../layout.module.css'
import CollectionsTable from './CollectionsTable'

export const dynamic = 'force-dynamic'

export default async function AdminCollections() {
  const collections = await getAdminCollections()
  
  return (
    <>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>Collections</h1>
        <Link href="/admin/collections/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          + New Collection
        </Link>
      </div>
      
      <div className={styles.tableWrap}>
        {collections.length > 0 ? (
          <CollectionsTable collections={collections} />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>No collections yet</div>
            <div className={styles.emptyText}>Create your first collection to organize your calligraphy pieces.</div>
            <Link href="/admin/collections/new" className={`${styles.btn} ${styles.btnPrimary}`}>
              + Create Collection
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
