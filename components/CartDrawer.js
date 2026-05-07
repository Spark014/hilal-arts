'use client';
import { useCart } from '../lib/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, cartTotal, isCartOpen, toggleCart } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(42, 24, 16, 0.4)', zIndex: 1000 }}
        onClick={toggleCart}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', maxWidth: '100%',
        backgroundColor: 'var(--cream-pale)', zIndex: 1001, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(93,26,31,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '1.2rem', color: 'var(--burgundy-deep)' }}>Your Cart</h2>
          <button onClick={toggleCart} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--burgundy-deep)' }}>×</button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '20px' }}>Your cart is empty.</p>
              <button onClick={toggleCart} style={{
                padding: '10px 24px', border: '1px solid var(--burgundy-deep)', background: 'transparent',
                color: 'var(--burgundy-deep)', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem',
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '20px'
              }}>Continue Shopping</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--cream)', backgroundImage: `url(${item.image})`, backgroundSize: 'contain', border: '1px solid var(--gold)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream-dark)', fontSize: '0.8rem' }}>Remove</button>
                    </div>
                    <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '8px' }}>{item.dimensions}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--cream-dark)', padding: '2px 8px', borderRadius: '15px' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>-</button>
                        <span style={{ fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                      </div>
                      <div style={{ fontFamily: 'var(--font-cinzel), serif', color: 'var(--gold-bright)' }}>${item.price * item.quantity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid rgba(93,26,31,0.15)', background: 'var(--cream-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontFamily: 'var(--font-cinzel), serif', fontSize: '1.2rem', color: 'var(--burgundy-deep)' }}>
              <span>Subtotal</span>
              <span>${cartTotal}</span>
            </div>
            <button style={{
              width: '100%', padding: '16px', background: 'var(--burgundy-deep)', color: 'var(--cream-pale)',
              border: 'none', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.9rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', cursor: 'pointer', borderRadius: '30px'
            }}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
