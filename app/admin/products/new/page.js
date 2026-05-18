import { getAdminCollections } from '../../../../lib/services/admin'
import ProductForm from '../ProductForm'
import styles from '../../layout.module.css'

export const dynamic = 'force-dynamic'

export default async function NewProduct() {
  const collections = await getAdminCollections()
  
  return (
    <>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>New Product</h1>
      </div>
      <ProductForm collections={collections} />
    </>
  )
}
