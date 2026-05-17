import { getProducts } from '../../lib/services/products'
import { getCollections } from '../../lib/services/collections'
import ProductCard from '../../components/ProductCard'
import styles from './page.module.css'

export const revalidate = 3600

export default async function Collections() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections()
  ])

  return (
    <>
      <div className={styles.collectionsPage}>
        <div className={styles.collectionsHeader}>
          <div className={styles.collectionsArabic}>المجموعات</div>
          <h1 className={styles.collectionsTitle}>All Collections</h1>
          <p className={styles.collectionsDesc}>
            Explore our complete gallery of hand-crafted Islamic calligraphy. Each piece is a unique original, gilded and finished in our atelier.
          </p>
        </div>
        
        <div className={styles.collectionsLayout}>
          {/* Filters Sidebar */}
          <aside className={styles.collectionsSidebar}>
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarHeading}>Browse</h3>
              <ul className={styles.sidebarList}>
                <li><a href="#" className={`${styles.sidebarLink} ${styles.sidebarLinkActive}`}>All Pieces</a></li>
                {collections.map(c => (
                  <li key={c.id}><a href={`/collections/${c.slug}`} className={styles.sidebarLink}>{c.name}</a></li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className={styles.productGrid}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
