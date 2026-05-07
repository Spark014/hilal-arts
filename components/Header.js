'use client';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import { useState } from 'react';

export default function Header() {
  const { cartCount, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="head">
      <div className="head-inner">
        <nav className="head-nav-l">
          <Link href="/collections">Collections</Link>
          <Link href="/collections">Canvas Sizes</Link>
          <Link href="/heritage">Our Atelier</Link>
          <Link href="/commissions">Commissions</Link>
        </nav>
        <Link href="/" className="logo">
          <div className="logo-arabic">هلال</div>
          <div className="logo-main">HILAL</div>
          <div className="logo-sub">— Sacred Calligraphy —</div>
        </Link>
        <div className="icon-grp head-nav-r">
          <button aria-label="Menu" className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <button aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
            <span>Search</span>
          </button>
          <button aria-label="Account">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"/></svg>
          </button>
          <button aria-label="Cart" onClick={toggleCart}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>Cart</span><span className="cart-num">{cartCount}</span>
          </button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--cream-pale)', borderBottom: '2px solid var(--burgundy-deep)', zIndex: 100, padding: '20px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link href="/collections" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--burgundy-deep)', fontFamily: 'var(--font-cinzel), serif', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Collections</Link>
          <Link href="/heritage" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--burgundy-deep)', fontFamily: 'var(--font-cinzel), serif', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Our Atelier</Link>
          <Link href="/commissions" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--burgundy-deep)', fontFamily: 'var(--font-cinzel), serif', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Commissions</Link>
        </div>
      )}
      
      <style jsx>{`
        .mobile-menu-btn { display: none; }
        @media (max-width: 1100px) {
          .mobile-menu-btn { display: block; }
        }
      `}</style>
    </header>
  );
}
