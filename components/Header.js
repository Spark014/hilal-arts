'use client';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const { cartCount, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef(null);
  const accountRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Check auth state
    const checkAuth = async () => {
      try {
        const { createClient } = await import('../lib/supabase-client');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
      } catch (e) {
        console.error('Auth check failed:', e);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSignOut = async () => {
    try {
      const { createClient } = await import('../lib/supabase-client');
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setAccountOpen(false);
      window.location.href = '/';
    } catch (e) {
      console.error('Sign out failed:', e);
    }
  };

  return (
    <header className={`head ${scrolled ? 'head--scrolled' : ''}`} ref={headerRef}>
      <div className="head-inner">
        <nav className="head-nav-l">
          <Link href="/">Home</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/heritage">Our Atelier</Link>
          <Link href="/commissions">Commissions</Link>
        </nav>
        <Link href="/" className="logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', textDecoration: 'none' }}>
          <img className="logo-icon" src="/icon-transparent.png" alt="HILAL Icon" style={{ height: '36px', width: 'auto' }} />
          <div className="logo-text-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="logo-main" style={{ fontSize: '1.3rem', letterSpacing: '0.15em', lineHeight: 1 }}>HILAL</div>
            <div className="logo-sub" style={{ fontSize: '0.45rem', letterSpacing: '0.15em', opacity: 0.8, marginTop: '4px' }}>SACRED CALLIGRAPHY</div>
          </div>
        </Link>
        <div className="icon-grp head-nav-r">
          <button aria-label="Menu" className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div className="search-dropdown" ref={searchRef}>
            {searchOpen ? (
              <form action="/search" method="GET" className="search-form">
                <input
                  ref={searchInputRef}
                  name="q"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="search-input"
                />
                <button type="submit" className="search-submit" aria-label="Search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
                </button>
                <button type="button" className="search-close" onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </form>
            ) : (
              <button aria-label="Search" onClick={() => setSearchOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
                <span>Search</span>
              </button>
            )}
          </div>
          
          {/* Account dropdown */}
          <div className="account-dropdown" ref={accountRef}>
            <button 
              aria-label="Account" 
              onClick={() => setAccountOpen(!accountOpen)}
              className={user ? 'account-logged-in' : ''}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"/></svg>
              {user && <span className="account-indicator" />}
            </button>
            
            {accountOpen && (
              <div className="account-menu">
                {user ? (
                  <>
                    <div className="account-header">
                      <span className="account-name">{user.user_metadata?.full_name || user.email}</span>
                    </div>
                    <Link href="/account" onClick={() => setAccountOpen(false)}>My Account</Link>
                    <Link href="/account/orders" onClick={() => setAccountOpen(false)}>Order History</Link>
                    <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setAccountOpen(false)}>Sign In</Link>
                    <Link href="/auth/signup" onClick={() => setAccountOpen(false)}>Create Account</Link>
                  </>
                )}
              </div>
            )}
          </div>
          
          <button aria-label="Cart" onClick={toggleCart}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>Cart</span><span className="cart-num">{cartCount}</span>
          </button>
        </div>
      </div>
      
      <div className={`mobile-menu-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
        <Link href="/collections" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
        <Link href="/heritage" onClick={() => setMobileMenuOpen(false)}>Our Atelier</Link>
        <Link href="/commissions" onClick={() => setMobileMenuOpen(false)}>Commissions</Link>
        {user ? (
          <>
            <Link href="/account" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
            <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="mobile-sign-out">Sign Out</button>
          </>
        ) : (
          <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
        )}
      </div>
      
      <style jsx>{`
        .head {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: var(--cream-pale);
          box-shadow: 0 2px 20px rgba(0,0,0,0.05);
        }
        .mobile-menu-btn { display: none; }
        .mobile-menu-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--cream-pale);
          border-bottom: 2px solid var(--burgundy-deep);
          z-index: 100;
          padding: 0 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.4s ease, opacity 0.4s ease;
          opacity: 0;
        }
        .mobile-menu-dropdown.open {
          max-height: 400px;
          padding: 20px 40px;
          opacity: 1;
        }
        .mobile-menu-dropdown a, .mobile-sign-out {
          text-decoration: none;
          color: var(--burgundy-deep);
          font-family: var(--font-cinzel), serif;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: inherit;
        }
        
        /* Account dropdown */
        .account-dropdown {
          position: relative;
        }
        .account-logged-in {
          position: relative;
        }
        .account-indicator {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: var(--copper);
          border-radius: 50%;
          border: 2px solid var(--cream-pale);
        }
        .account-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border: 1px solid rgba(93,26,31,0.1);
          min-width: 180px;
          padding: 8px 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          z-index: 1001;
        }
        .account-header {
          padding: 8px 16px;
          border-bottom: 1px solid rgba(93,26,31,0.08);
          margin-bottom: 4px;
        }
        .account-name {
          font-family: var(--font-cormorant), serif;
          font-size: 0.9rem;
          color: var(--burgundy-deep);
          font-weight: 600;
        }
        .account-menu a, .sign-out-btn {
          display: block;
          padding: 8px 16px;
          font-family: var(--font-cormorant), serif;
          font-size: 0.95rem;
          color: var(--ink);
          text-decoration: none;
          transition: background 0.2s;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }
        .account-menu a:hover, .sign-out-btn:hover {
          background: var(--cream-light);
          color: var(--burgundy-deep);
        }
        .sign-out-btn {
          color: #dc2626;
        }

        /* Search dropdown */
        .search-dropdown {
          position: relative;
        }
        .search-form {
          display: flex;
          align-items: center;
          gap: 8px;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: var(--cream-pale);
          border: 1px solid rgba(93,26,31,0.2);
          padding: 4px;
          z-index: 1001;
          width: 280px;
        }
        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 8px 10px;
          font-family: var(--font-cormorant), serif;
          font-size: 0.95rem;
          color: var(--ink);
          outline: none;
        }
        .search-input::placeholder {
          color: var(--cream-dark);
        }
        .search-submit, .search-close {
          background: none;
          border: none;
          color: var(--burgundy);
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .search-submit:hover, .search-close:hover {
          color: var(--burgundy-deep);
        }
        
        @media (max-width: 1100px) {
          .mobile-menu-btn { display: block; }
          .search-form {
            width: 220px;
          }
        }
        @media (max-width: 640px) {
          .mobile-menu-dropdown.open { padding: 20px 20px; }
          .search-form {
            width: 200px;
          }
        }
      `}</style>
    </header>
  );
}
