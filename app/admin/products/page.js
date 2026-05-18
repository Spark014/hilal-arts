import { getAdminProducts } from '../../../lib/services/admin'
import Link from 'next/link'
import styles from '../layout.module.css'
import ProductsTable from './ProductsTable'

export const dynamic = 'force-dynamic'

export default async function AdminProducts() {
  const products = await getAdminProducts()
  
  return (
    <>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>Products</h1>
        <Link href="/admin/products/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          + New Product
        </Link>
      </div>
      
      <div className={styles.tableWrap}>
        {products.length > 0 ? (
          <ProductsTable products={products} />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>No products yet</div>
            <div className={styles.emptyText}>Add your first calligraphy piece to the store.</div>
            <Link href="/admin/products/new" className={`${styles.btn} ${styles.btnPrimary}`}>
              + Create Product
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
