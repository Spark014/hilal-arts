import { products, collections } from '../../../lib/data';
import ProductCard from '../../../components/ProductCard';
import { notFound } from 'next/navigation';

export default function SingleCollection({ params }) {
  const { slug } = params;
  const collection = collections.find(c => c.id === slug);

  if (!collection) {
    notFound();
  }

  const collectionProducts = products.filter(p => p.collection === slug);

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ fontFamily: 'var(--font-amiri), serif', fontSize: '2rem', color: 'var(--copper)', marginBottom: '10px' }}>{collection.arabic}</div>
        <h1 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '3rem', color: 'var(--burgundy-deep)', marginBottom: '16px' }}>{collection.name}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '60px' }}>
        {/* Filters Sidebar */}
        <aside>
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '1rem', borderBottom: '1px solid rgba(93,26,31,0.15)', paddingBottom: '12px', marginBottom: '16px' }}>Browse</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="/collections" style={{ color: 'var(--ink)', textDecoration: 'none', opacity: 0.8 }}>All Pieces</a></li>
              {collections.map(c => (
                <li key={c.id}>
                  <a href={`/collections/${c.id}`} style={{
                    color: c.id === slug ? 'var(--burgundy-deep)' : 'var(--ink)',
                    textDecoration: 'none',
                    fontWeight: c.id === slug ? 600 : 400,
                    opacity: c.id === slug ? 1 : 0.8
                  }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
              {collectionProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', background: 'var(--cream-light)', border: '1px solid rgba(93,26,31,0.1)' }}>
              <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', color: 'var(--ink)' }}>No pieces available in this collection at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
