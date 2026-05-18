import { getAdminProductById, getAdminCollections } from '../../../../../lib/services/admin'
import ProductForm from '../../ProductForm'
import { notFound } from 'next/navigation'
import styles from '../../../layout.module.css'

export const dynamic = 'force-dynamic'

export default async function EditProduct({ params }) {
  const { id } = params
  
  const [product, collections] = await Promise.all([
    getAdminProductById(id),
    getAdminCollections(),
  ])
  
  if (!product) {
    notFound()
  }
  
  return (
    <>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>Edit: {product.name}</h1>
      </div>
      <ProductForm product={product} collections={collections} />
    </>
  )
}
