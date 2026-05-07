'use client';
import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link href={`/product/${product.slug}`} className="product-card-img">
        {/* Using a static placeholder image for now, will replace later */}
        <div style={{
          width: '100%',
          aspectRatio: '1',
          backgroundColor: 'var(--cream)',
          backgroundImage: `url(${product.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.4s ease',
          border: '1px solid rgba(93,26,31,0.1)'
        }} className="img-inner"></div>
        <div className="product-card-overlay">
          <span>View Piece</span>
        </div>
      </Link>
      
      <div className="product-card-info" style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-amiri), serif', direction: 'rtl', fontSize: '1.2rem', color: 'var(--copper)' }}>{product.arabicName}</div>
            <h3 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '1.1rem', fontWeight: 500 }}>{product.name}</h3>
          </div>
          <div style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '1rem', color: 'var(--gold-bright)' }}>
            ${product.price}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', color: 'var(--cream-dark)' }}>
          {product.dimensions} · {product.script} Script
        </div>
      </div>
      
      <style jsx>{`
        .product-card {
          display: flex;
          flex-direction: column;
        }
        .product-card-img {
          position: relative;
          display: block;
          overflow: hidden;
        }
        .product-card-img:hover .img-inner {
          transform: scale(1.05);
        }
        .product-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(74, 13, 19, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .product-card-img:hover .product-card-overlay {
          opacity: 1;
        }
        .product-card-overlay span {
          background: var(--cream-pale);
          color: var(--burgundy-deep);
          padding: 10px 24px;
          font-family: var(--font-cinzel), serif;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
