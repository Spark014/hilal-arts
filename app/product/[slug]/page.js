'use client';
import React from 'react';
import Link from 'next/link';
import { products } from '../../../lib/data';
import { useCart } from '../../../lib/CartContext';
import { notFound } from 'next/navigation';
import { useState } from 'react';

export default function ProductPage({ params }) {
  const { slug } = React.use(params);
  const product = products.find(p => p.slug === slug);
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [showCustom, setShowCustom] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    notFound();
  }

  const images = product.images || [product.image];

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const sizeLabel = product.canvasSize === 'large' ? 'Large Canvas (30–50″)' :
                    product.canvasSize === 'medium' ? 'Medium Canvas (10–30″)' :
                    'Small Canvas (under 10″)';

  /* Related products: same collection, exclude self, max 4 */
  const related = products
    .filter(p => p.collection === product.collection && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      {/* Breadcrumb */}
      <div className="pdp-breadcrumb">
        <Link href="/">Home</Link>
        <span className="bc-sep">›</span>
        <Link href="/collections">Collections</Link>
        <span className="bc-sep">›</span>
        <span className="bc-current">{product.name}</span>
      </div>

      {/* Main Content */}
      <div className="pdp-main">

        {/* ──── LEFT: Gallery ──── */}
        <div className="pdp-gallery">
          <div className="pdp-hero-img">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="pdp-hero-photo"
              key={activeImage}
            />
            {/* Collection badge */}
            <div className="pdp-badge">{product.collectionLabel}</div>
          </div>
          {images.length > 1 && (
            <div className="pdp-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`pdp-thumb ${activeImage === i ? 'active' : ''}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ──── RIGHT: Details ──── */}
        <div className="pdp-details">

          {/* Title block */}
          <div className="pdp-arabic">{product.arabicName}</div>
          <h1 className="pdp-title">{product.name}</h1>
          <div className="pdp-collection-link">
            <Link href={`/collections/${product.collection}`}>{product.collectionLabel}</Link>
          </div>

          {/* Price block */}
          <div className="pdp-price-block">
            <div className="pdp-price">${product.price}</div>
            <div className="pdp-price-note">
              {sizeLabel}
              {product.customizationFee > 0 && (
                <span> · +${product.customizationFee} for custom</span>
              )}
            </div>
          </div>

          {/* Spec grid */}
          <div className="pdp-specs">
            <div className="pdp-spec">
              <div className="pdp-spec-label">Script</div>
              <div className="pdp-spec-value">{product.script}</div>
            </div>
            <div className="pdp-spec">
              <div className="pdp-spec-label">Dimensions</div>
              <div className="pdp-spec-value">{product.dimensions}</div>
            </div>
            <div className="pdp-spec">
              <div className="pdp-spec-label">Calligrapher</div>
              <div className="pdp-spec-value">{product.calligrapher}</div>
            </div>
            <div className="pdp-spec">
              <div className="pdp-spec-label">Processing</div>
              <div className="pdp-spec-value">{product.processingTime}</div>
            </div>
          </div>

          {/* Description */}
          <p className="pdp-desc">{product.description}</p>

          {/* Features */}
          {product.features && (
            <ul className="pdp-features">
              {product.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}

          {/* Add to cart */}
          <div className="pdp-actions">
            <button className={`pdp-add-btn ${addedToCart ? 'added' : ''}`} onClick={handleAddToCart}>
              {addedToCart ? (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> Added</>
              ) : (
                <>Add to Cart · ${product.price}</>
              )}
            </button>
            <button className="pdp-wishlist-btn" aria-label="Add to wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>

          {/* Customization accordion */}
          <div className="pdp-custom-section">
            <button className="pdp-custom-toggle" onClick={() => setShowCustom(!showCustom)}>
              <div className="pdp-custom-toggle-left">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span>Customization Available</span>
              </div>
              <svg className={`pdp-chevron ${showCustom ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            {showCustom && product.customizations && (
              <div className="pdp-custom-body">
                <div className="pdp-custom-options">
                  {product.customizations.map((c, i) => (
                    <div key={i} className="pdp-custom-chip">{c}</div>
                  ))}
                </div>
                <div className="pdp-custom-info">
                  <p>Customization fee: <strong>+${product.customizationFee}</strong></p>
                  <p>Processing time: <strong>{product.processingTime}</strong></p>
                  <p className="pdp-custom-note">Every piece is handmade and may vary slightly, making each artwork unique.</p>
                </div>
                <Link href="/commissions" className="pdp-custom-cta">Request Custom Order →</Link>
              </div>
            )}
          </div>

          {/* Trust signals */}
          <div className="pdp-trust">
            <div className="pdp-trust-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div>
                <strong>Authenticity Guaranteed</strong>
                <span>Certificate of authenticity with every piece</span>
              </div>
            </div>
            <div className="pdp-trust-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div>
                <strong>Worldwide Shipping</strong>
                <span>Secure packaging &amp; insured delivery</span>
              </div>
            </div>
            <div className="pdp-trust-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
              <div>
                <strong>100% Handmade</strong>
                <span>No prints — every stroke by hand</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pdp-related">
          <div className="pdp-related-header">
            <div className="pdp-related-arabic">قطع مشابهة</div>
            <h2 className="pdp-related-title">You May Also Like</h2>
          </div>
          <div className="pdp-related-grid">
            {related.map(r => (
              <Link key={r.id} href={`/product/${r.slug}`} className="pdp-related-card">
                <div className="pdp-related-img">
                  <img src={r.image} alt={r.name} />
                </div>
                <div className="pdp-related-info">
                  <div className="pdp-related-rname">{r.name}</div>
                  <div className="pdp-related-rprice">${r.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style jsx>{`
        /* ── BREADCRUMB ── */
        .pdp-breadcrumb {
          max-width: 1400px; margin: 0 auto;
          padding: 20px 40px;
          display: flex; align-items: center; gap: 8px;
          font-size: 0.82rem;
          font-family: var(--font-cormorant), serif;
        }
        .pdp-breadcrumb a {
          color: var(--cream-dark); text-decoration: none;
          transition: color 0.2s;
        }
        .pdp-breadcrumb a:hover { color: var(--copper); }
        .bc-sep { color: var(--cream-dark); opacity: 0.5; }
        .bc-current { color: var(--burgundy-deep); font-weight: 600; }

        /* ── MAIN GRID ── */
        .pdp-main {
          max-width: 1400px; margin: 0 auto;
          padding: 0 40px 80px;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 70px;
          align-items: start;
        }

        /* ── GALLERY ── */
        .pdp-gallery { position: sticky; top: 120px; }
        .pdp-hero-img {
          position: relative; overflow: hidden;
          background: var(--cream);
          border: 1px solid rgba(184,146,75,0.25);
        }
        .pdp-hero-photo {
          width: 100%; height: auto; display: block;
          animation: fadeIn 0.35s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }
        .pdp-badge {
          position: absolute; top: 20px; left: 20px;
          background: var(--burgundy-deep);
          color: var(--gold-bright);
          font-family: var(--font-cinzel), serif;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 2px;
        }
        .pdp-thumbs {
          display: flex; gap: 10px; margin-top: 14px;
        }
        .pdp-thumb {
          width: 80px; height: 80px; padding: 0;
          border: 2px solid transparent;
          background: var(--cream);
          cursor: pointer; overflow: hidden;
          opacity: 0.55;
          transition: all 0.25s ease;
        }
        .pdp-thumb:hover { opacity: 0.85; }
        .pdp-thumb.active {
          border-color: var(--copper);
          opacity: 1;
        }
        .pdp-thumb img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }

        /* ── DETAILS ── */
        .pdp-details { padding-top: 8px; }
        .pdp-arabic {
          font-family: var(--font-amiri), serif;
          font-size: 2rem; color: var(--copper);
          direction: rtl; line-height: 1.1;
          margin-bottom: 6px;
        }
        .pdp-title {
          font-family: var(--font-cinzel), serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          color: var(--burgundy-deep);
          font-weight: 500; letter-spacing: 0.02em;
          line-height: 1.1; margin-bottom: 8px;
        }
        .pdp-collection-link {
          margin-bottom: 28px;
        }
        .pdp-collection-link a {
          font-family: var(--font-cormorant), serif;
          font-size: 0.95rem; font-style: italic;
          color: var(--olive); text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.2s;
        }
        .pdp-collection-link a:hover {
          color: var(--copper);
          border-bottom-color: var(--copper);
        }

        /* ── PRICE ── */
        .pdp-price-block {
          padding: 22px 0;
          border-top: 1px solid rgba(93,26,31,0.1);
          border-bottom: 1px solid rgba(93,26,31,0.1);
          margin-bottom: 28px;
        }
        .pdp-price {
          font-family: var(--font-cinzel), serif;
          font-size: 2rem; color: var(--burgundy-deep);
          font-weight: 600; letter-spacing: 0.04em;
        }
        .pdp-price-note {
          font-family: var(--font-cormorant), serif;
          font-size: 0.92rem; color: var(--cream-dark);
          margin-top: 4px; font-style: italic;
        }
        .pdp-price-note span { color: var(--olive); }

        /* ── SPECS ── */
        .pdp-specs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          margin-bottom: 28px;
          border: 1px solid rgba(93,26,31,0.1);
        }
        .pdp-spec {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(93,26,31,0.08);
        }
        .pdp-spec:nth-child(odd) { border-right: 1px solid rgba(93,26,31,0.08); }
        .pdp-spec:nth-last-child(-n+2) { border-bottom: none; }
        .pdp-spec-label {
          font-family: var(--font-cinzel), serif;
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--olive);
          margin-bottom: 4px;
        }
        .pdp-spec-value {
          font-family: var(--font-cormorant), serif;
          font-size: 1.1rem; color: var(--ink);
        }

        /* ── DESCRIPTION ── */
        .pdp-desc {
          font-size: 1.05rem; color: var(--ink);
          line-height: 1.85; margin-bottom: 20px;
        }

        /* ── FEATURES ── */
        .pdp-features {
          list-style: none; margin-bottom: 32px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .pdp-features li {
          font-family: var(--font-cormorant), serif;
          font-size: 1rem; color: var(--ink);
          padding-left: 22px; position: relative;
        }
        .pdp-features li::before {
          content: '◆';
          position: absolute; left: 0; top: 0;
          color: var(--gold-bright); font-size: 0.6rem;
          line-height: 1.6;
        }

        /* ── ACTIONS ── */
        .pdp-actions {
          display: flex; gap: 14px; margin-bottom: 28px;
        }
        .pdp-add-btn {
          flex: 1; padding: 16px 32px;
          background: var(--burgundy-deep);
          color: var(--cream-pale); border: none;
          font-family: var(--font-cinzel), serif;
          font-size: 0.78rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer; border-radius: 3px;
          transition: all 0.35s ease;
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
        }
        .pdp-add-btn:hover { background: var(--copper); }
        .pdp-add-btn.added {
          background: var(--olive);
          pointer-events: none;
        }
        .pdp-wishlist-btn {
          width: 54px; height: 54px;
          border: 1px solid rgba(93,26,31,0.2);
          background: transparent;
          color: var(--burgundy-deep);
          cursor: pointer; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s;
        }
        .pdp-wishlist-btn:hover {
          background: var(--cream);
          border-color: var(--copper);
          color: var(--copper);
        }

        /* ── CUSTOMIZATION ACCORDION ── */
        .pdp-custom-section {
          border: 1px solid rgba(93,26,31,0.12);
          margin-bottom: 28px;
          overflow: hidden;
        }
        .pdp-custom-toggle {
          width: 100%; padding: 18px 20px;
          background: var(--cream-light);
          border: none; cursor: pointer;
          display: flex; align-items: center;
          justify-content: space-between;
          font-family: var(--font-cinzel), serif;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--burgundy-deep);
          transition: background 0.2s;
        }
        .pdp-custom-toggle:hover { background: var(--cream); }
        .pdp-custom-toggle-left {
          display: flex; align-items: center; gap: 10px;
        }
        .pdp-chevron {
          transition: transform 0.3s ease;
        }
        .pdp-chevron.open { transform: rotate(180deg); }
        .pdp-custom-body {
          padding: 22px 20px;
          background: var(--cream-pale);
          animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pdp-custom-options {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin-bottom: 16px;
        }
        .pdp-custom-chip {
          padding: 6px 16px;
          background: rgba(93,26,31,0.08);
          border: 1px solid rgba(93,26,31,0.12);
          font-family: var(--font-cormorant), serif;
          font-size: 0.92rem; color: var(--burgundy-deep);
          border-radius: 20px;
        }
        .pdp-custom-info {
          margin-bottom: 16px;
        }
        .pdp-custom-info p {
          font-family: var(--font-cormorant), serif;
          font-size: 0.95rem; color: var(--ink);
          margin-bottom: 4px;
        }
        .pdp-custom-info strong { color: var(--burgundy-deep); }
        .pdp-custom-note {
          font-style: italic; color: var(--cream-dark) !important;
          margin-top: 8px !important;
          font-size: 0.88rem !important;
        }
        .pdp-custom-cta {
          display: inline-flex; align-items: center;
          font-family: var(--font-cinzel), serif;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--copper);
          text-decoration: none;
          border-bottom: 1px solid var(--copper);
          padding-bottom: 2px;
          transition: color 0.2s;
        }
        .pdp-custom-cta:hover { color: var(--burgundy-deep); border-color: var(--burgundy-deep); }

        /* ── TRUST SIGNALS ── */
        .pdp-trust {
          display: flex; flex-direction: column; gap: 0;
          border: 1px solid rgba(93,26,31,0.1);
        }
        .pdp-trust-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(93,26,31,0.06);
          color: var(--olive);
        }
        .pdp-trust-item:last-child { border-bottom: none; }
        .pdp-trust-item svg { flex-shrink: 0; margin-top: 2px; }
        .pdp-trust-item strong {
          display: block;
          font-family: var(--font-cinzel), serif;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--burgundy-deep);
          margin-bottom: 2px;
        }
        .pdp-trust-item span {
          font-family: var(--font-cormorant), serif;
          font-size: 0.9rem; color: var(--cream-dark);
        }

        /* ── RELATED PRODUCTS ── */
        .pdp-related {
          max-width: 1400px; margin: 0 auto;
          padding: 0 40px 100px;
        }
        .pdp-related-header {
          text-align: center; margin-bottom: 40px;
        }
        .pdp-related-arabic {
          font-family: var(--font-amiri), serif;
          font-size: 1.4rem; color: var(--copper);
          direction: rtl; margin-bottom: 6px;
        }
        .pdp-related-title {
          font-family: var(--font-cinzel), serif;
          font-size: 1.6rem; color: var(--burgundy-deep);
          font-weight: 500; letter-spacing: 0.1em;
        }
        .pdp-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 28px;
        }
        .pdp-related-card {
          text-decoration: none; color: inherit;
          transition: transform 0.3s ease;
        }
        .pdp-related-card:hover { transform: translateY(-4px); }
        .pdp-related-img {
          overflow: hidden; background: var(--cream);
          border: 1px solid rgba(184,146,75,0.15);
          margin-bottom: 14px;
        }
        .pdp-related-img img {
          width: 100%; height: auto; display: block;
          aspect-ratio: 1;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .pdp-related-card:hover .pdp-related-img img {
          transform: scale(1.04);
        }
        .pdp-related-rname {
          font-family: var(--font-cinzel), serif;
          font-size: 0.9rem; color: var(--burgundy-deep);
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .pdp-related-rprice {
          font-family: var(--font-cinzel), serif;
          font-size: 0.88rem; color: var(--gold-bright);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1000px) {
          .pdp-main {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 0 24px 60px;
          }
          .pdp-gallery { position: static; }
          .pdp-breadcrumb { padding: 16px 24px; }
          .pdp-related { padding: 0 24px 60px; }
        }
        @media (max-width: 640px) {
          .pdp-main { padding: 0 16px 50px; }
          .pdp-breadcrumb { padding: 14px 16px; font-size: 0.75rem; }
          .pdp-title { font-size: 1.6rem; }
          .pdp-arabic { font-size: 1.5rem; }
          .pdp-price { font-size: 1.6rem; }
          .pdp-specs { grid-template-columns: 1fr; }
          .pdp-spec { border-right: none !important; }
          .pdp-thumb { width: 64px; height: 64px; }
          .pdp-actions { flex-direction: column; }
          .pdp-wishlist-btn { width: 100%; height: 48px; }
          .pdp-related { padding: 0 16px 50px; }
          .pdp-related-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
      `}</style>
    </>
  );
}
