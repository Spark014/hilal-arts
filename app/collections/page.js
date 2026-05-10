'use client';
import { products, collections } from '../../lib/data';
import ProductCard from '../../components/ProductCard';

export default function Collections() {
  return (
    <>
      <div className="collections-page">
        <div className="collections-header">
          <div className="collections-arabic">المجموعات</div>
          <h1 className="collections-title">All Collections</h1>
          <p className="collections-desc">
            Explore our complete gallery of hand-crafted Islamic calligraphy. Each piece is a unique original, gilded and finished in our atelier.
          </p>
        </div>
        
        <div className="collections-layout">
          {/* Filters Sidebar */}
          <aside className="collections-sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-heading">Browse</h3>
              <ul className="sidebar-list">
                <li><a href="#" className="sidebar-link active">All Pieces</a></li>
                {collections.map(c => (
                  <li key={c.id}><a href={`/collections/${c.id}`} className="sidebar-link">{c.name}</a></li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .collections-page {
          padding: 60px 40px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .collections-header {
          text-align: center;
          margin-bottom: 60px;
        }
        .collections-arabic {
          font-family: var(--font-amiri), serif;
          font-size: 2rem;
          color: var(--copper);
          margin-bottom: 10px;
        }
        .collections-title {
          font-family: var(--font-cinzel), serif;
          font-size: 3rem;
          color: var(--burgundy-deep);
          margin-bottom: 16px;
        }
        .collections-desc {
          font-family: var(--font-cormorant), serif;
          font-size: 1.1rem;
          color: var(--cream-dark);
          max-width: 600px;
          margin: 0 auto;
        }
        .collections-layout {
          display: grid;
          grid-template-columns: 1fr 3fr;
          gap: 60px;
        }
        .sidebar-heading {
          font-family: var(--font-cinzel), serif;
          font-size: 1rem;
          border-bottom: 1px solid rgba(93,26,31,0.15);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .sidebar-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sidebar-link {
          color: var(--ink);
          text-decoration: none;
          opacity: 0.8;
          transition: color 0.3s, opacity 0.3s;
        }
        .sidebar-link.active {
          color: var(--burgundy-deep);
          font-weight: 500;
          opacity: 1;
        }
        .sidebar-link:hover {
          color: var(--copper);
          opacity: 1;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 40px;
        }
        @media (max-width: 900px) {
          .collections-page { padding: 40px 20px; }
          .collections-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .collections-sidebar {
            order: 2;
          }
          .sidebar-list {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 8px;
          }
          .sidebar-link {
            padding: 6px 14px;
            border: 1px solid rgba(93,26,31,0.15);
            border-radius: 20px;
            font-size: 0.85rem;
          }
          .sidebar-link.active {
            background: var(--burgundy-deep);
            color: var(--cream-pale);
            border-color: var(--burgundy-deep);
          }
          .collections-title { font-size: 2rem; }
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
