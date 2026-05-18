'use client';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const imageUrl = product.image_url || product.image || '/placeholder.jpg';
  const arabicName = product.arabic_name || product.arabicName || '';
  const dimensions = product.dimensions || '';
  const script = product.script || '';

  return (
    <div className="product-card">
      <Link href={`/product/${product.slug}`} className="product-card-img">
        <div
          className="img-inner"
          style={{
            width: '100%',
            aspectRatio: '1',
            backgroundColor: 'var(--cream)',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.4s ease',
            border: '1px solid rgba(93,26,31,0.1)'
          }}
        ></div>
        <div className="product-card-overlay">
          <span>View Piece</span>
        </div>
      </Link>
      
      <div className="product-card-info">
        <div className="product-card-top">
          <div className="product-card-names">
            {arabicName && (
              <div className="product-card-arabic">{arabicName}</div>
            )}
            <h3 className="product-card-name">{product.name}</h3>
          </div>
          <div className="product-card-price">
            ${product.price}
          </div>
        </div>
        {(dimensions || script) && (
          <div className="product-card-meta">
            {dimensions}{dimensions && script ? ' · ' : ''}{script && `${script} Script`}
          </div>
        )}
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
          cursor: pointer;
          border-radius: 2px;
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
          transition: opacity 0.3s ease;
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
        .product-card-info {
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .product-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .product-card-arabic {
          font-family: var(--font-amiri), serif;
          direction: rtl;
          font-size: 1.2rem;
          color: var(--copper);
        }
        .product-card-name {
          font-family: var(--font-cinzel), serif;
          font-size: 1.1rem;
          font-weight: 500;
        }
        .product-card-price {
          font-family: var(--font-cinzel), serif;
          font-size: 1rem;
          color: var(--gold-bright);
        }
        .product-card-meta {
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          color: var(--cream-dark);
        }
      `}</style>
    </div>
  );
}
