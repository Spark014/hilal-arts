import { getProductsByCollection } from '../../../lib/services/products'
import { getCollections } from '../../../lib/services/collections'
import { getCollectionBySlug } from '../../../lib/services/collections'
import ProductCard from '../../../components/ProductCard'
import { notFound } from 'next/navigation'
import styles from './page.module.css'

export const revalidate = 3600

export default async function SingleCollection({ params }) {
  const { slug } = params
  
  const [collection, collections, collectionProducts] = await Promise.all([
    getCollectionBySlug(slug),
    getCollections(),
    getProductsByCollection(slug)
  ])

  if (!collection) {
    notFound()
  }

  return (
    <div className={styles.collectionDetailPage}>
      <div className={styles.collectionHeader}>
        <div className={styles.collectionArabic}>{collection.arabic_name || collection.arabic}</div>
        <h1 className={styles.collectionTitle}>{collection.name}</h1>
      </div>

      <div className={styles.collectionLayout}>
        {/* Filters Sidebar */}
        <aside className={styles.sidebar}>
          <div>
            <h3 className={styles.sidebarHeading}>Browse</h3>
            <ul className={styles.sidebarList}>
              <li><a href="/collections" className={styles.sidebarLink}>All Pieces</a></li>
              {collections.map(c => (
                <li key={c.id}>
                  <a
                    href={`/collections/${c.slug}`}
                    className={`${styles.sidebarLink} ${c.slug === slug ? styles.sidebarLinkActive : ''}`}
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div>
          {collectionProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {collectionProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No pieces available in this collection at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
