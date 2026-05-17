import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export const metadata = {
  title: 'Search — HILAL Arts',
  description: 'Search our collection of sacred calligraphy on canvas.',
};

export default async function SearchPage({ searchParams }) {
  const query = searchParams?.q || '';
  const supabase = await createClient();

  let products = [];
  let error = null;

  if (query.trim()) {
    const { data, error: searchError } = await supabase
      .from('products')
      .select('*, collections(name, slug)')
      .or(`name.ilike.%${query}%,arabic_name.ilike.%${query}%,script.ilike.%${query}%,calligrapher.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .order('name');

    if (searchError) {
      error = searchError.message;
    } else {
      products = data || [];
    }
  }

  return (
    <div style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ fontFamily: 'var(--font-amiri), serif', fontSize: '2rem', color: 'var(--copper)', marginBottom: '10px' }}>بحث</div>
        <h1 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '3rem', color: 'var(--burgundy-deep)', marginBottom: '16px' }}>Search</h1>
      </div>

      {/* Search form */}
      <form action="/search" method="GET" style={{ maxWidth: '600px', margin: '0 auto 60px', display: 'flex', gap: '0' }}>
        <input
          name="q"
          type="text"
          defaultValue={query}
          placeholder="Search by name, script, calligrapher..."
          style={{
            flex: 1,
            padding: '14px 20px',
            background: 'var(--cream-pale)',
            border: '1px solid rgba(93,26,31,0.2)',
            borderRight: 'none',
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: '1.1rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '14px 28px',
            backgroundColor: 'var(--burgundy-deep)',
            color: 'var(--cream-pale)',
            border: 'none',
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {/* Results */}
      {query.trim() && (
        <>
          {error ? (
            <p style={{ textAlign: 'center', color: 'var(--burgundy-deep)', fontFamily: 'var(--font-cormorant), serif' }}>
              Something went wrong. Please try again.
            </p>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', color: 'var(--ink)' }}>
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p style={{ fontFamily: 'var(--font-cormorant), serif', color: 'var(--cream-dark)', marginTop: '8px' }}>
                Try searching by product name, Arabic name, script style, or calligrapher.
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontFamily: 'var(--font-cormorant), serif', color: 'var(--cream-dark)', marginBottom: '24px' }}>
                {products.length} result{products.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{
                      background: 'var(--cream)',
                      border: '1px solid var(--gold-pale)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <div style={{
                        aspectRatio: '4/5',
                        background: 'var(--cream-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-amiri), serif',
                        fontSize: '1.5rem',
                        color: 'var(--gold-bright)',
                      }}>
                        {product.arabic_name || product.name}
                      </div>
                      <div style={{ padding: '20px' }}>
                        <div style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--copper)', textTransform: 'uppercase', marginBottom: '8px' }}>
                          {product.collections?.name || product.collection_label}
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', color: 'var(--burgundy-deep)', marginBottom: '8px' }}>
                          {product.name}
                        </h3>
                        <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '0.9rem', color: 'var(--cream-dark)', marginBottom: '12px', lineHeight: 1.5 }}>
                          {product.script} · {product.dimensions}
                        </p>
                        <div style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '0.85rem', color: 'var(--burgundy-deep)' }}>
                          ${(product.price / 100).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
