import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <div>
          <div className="foot-brand-arabic">هلال</div>
          <div className="foot-brand">HILAL</div>
          <div className="foot-tag">— Sacred Calligraphy on Canvas —</div>
          <p className="foot-desc">A modern atelier honoring a thousand-year tradition. Hand-finished canvases, master calligraphers, museum-grade materials. Shipped worldwide with white-glove care.</p>
        </div>
        <div>
          <div className="foot-h">Shop</div>
          <ul className="foot-list">
            <li><Link href="/collections">All Collections</Link></li>
            <li><Link href="/collections">Quranic Verses</Link></li>
            <li><Link href="/collections">99 Names</Link></li>
            <li><Link href="/collections">Sacred Geometry</Link></li>
            <li><Link href="/commissions">Custom Commissions</Link></li>
          </ul>
        </div>
        <div>
          <div className="foot-h">Atelier</div>
          <ul className="foot-list">
            <li><Link href="/heritage">Our Calligraphers</Link></li>
            <li><Link href="/heritage">Materials & Process</Link></li>
            <li><Link href="/heritage">Sustainability</Link></li>
            <li><Link href="/heritage">Press</Link></li>
            <li><Link href="/heritage">Journal</Link></li>
          </ul>
        </div>
        <div>
          <div className="foot-h">Care</div>
          <ul className="foot-list">
            <li><Link href="/">Shipping & Delivery</Link></li>
            <li><Link href="/">Returns</Link></li>
            <li><Link href="/">Canvas Care</Link></li>
            <li><Link href="/">FAQ</Link></li>
            <li><Link href="/">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <div>© 2026 HILAL Arts <span style={{ margin: '0 10px', color: 'var(--copper-bright)' }}>◆</span> All canvases handcrafted with intention</div>
        <div className="foot-socials">
          <a href="#" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg></a>
          <a href="#" aria-label="Pinterest"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M11 8 L11 18 M9 14 Q12 12 14 11"/></svg></a>
          <a href="#" aria-label="YouTube"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="3"/><path d="M10 9 L15 12 L10 15 Z" fill="currentColor"/></svg></a>
        </div>
      </div>
    </footer>
  );
}
