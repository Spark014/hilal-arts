'use client';
import { products } from '../../../lib/data';
import { useCart } from '../../../lib/CartContext';
import { use } from 'react';
import { notFound } from 'next/navigation';

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const product = products.find(p => p.slug === slug);
  const { addToCart } = useCart();

  if (!product) {
    notFound();
  }

  return (
    <div style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'center' }}>
      <div style={{ width: '100%', aspectRatio: '1', backgroundColor: 'var(--cream)', border: '1px solid var(--gold)', position: 'relative', overflow: 'hidden' }}>
         <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${product.image})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}></div>
      </div>
      
      <div>
        <div style={{ fontFamily: 'var(--font-amiri), serif', fontSize: '2.4rem', color: 'var(--copper)', marginBottom: '8px', direction: 'rtl' }}>{product.arabicName}</div>
        <h1 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '3.5rem', color: 'var(--burgundy-deep)', lineHeight: 1.1, marginBottom: '24px' }}>{product.name}</h1>
        
        <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid rgba(93,26,31,0.15)', paddingBottom: '24px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.2em', color: 'var(--olive)', marginBottom: '4px' }}>SCRIPT</div>
            <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem' }}>{product.script}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.2em', color: 'var(--olive)', marginBottom: '4px' }}>DIMENSIONS</div>
            <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem' }}>{product.dimensions}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.2em', color: 'var(--olive)', marginBottom: '4px' }}>CALLIGRAPHER</div>
            <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem' }}>{product.calligrapher}</div>
          </div>
        </div>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--ink)', lineHeight: 1.8, marginBottom: '40px' }}>{product.description}</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '1.8rem', color: 'var(--gold-bright)' }}>${product.price}</div>
          <button 
            onClick={() => addToCart(product)}
            style={{
              padding: '16px 40px',
              backgroundColor: 'var(--burgundy-deep)',
              color: 'var(--cream-pale)',
              border: 'none',
              fontFamily: 'var(--font-cinzel), serif',
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '30px',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--copper)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--burgundy-deep)'}
          >
            Add to Cart
          </button>
        </div>
        
        <div style={{ marginTop: '40px', fontSize: '0.9rem', color: 'var(--cream-dark)', display: 'flex', gap: '20px' }}>
          <span>✓ Hand-finished</span>
          <span>✓ Certificate of Authenticity</span>
          <span>✓ Secure Shipping</span>
        </div>
      </div>
    </div>
  );
}
