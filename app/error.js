'use client';

import { useEffect } from 'react';

export default function RootErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log to monitoring service in production
    console.error('Root error:', error);
  }, [error]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--cream-pale, #F8F5F1)',
      fontFamily: 'var(--font-cormorant), serif',
      color: 'var(--ink, #1A1A1A)'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px', padding: '40px' }}>
        <div style={{ 
          fontFamily: 'var(--font-amiri), serif', 
          fontSize: '3rem', 
          color: 'var(--copper, #C17A48)',
          marginBottom: '20px'
        }}>
          عذراً
        </div>
        <h1 style={{ 
          fontFamily: 'var(--font-cinzel), serif', 
          fontSize: '1.8rem', 
          color: 'var(--burgundy-deep, #5D1A1F)',
          marginBottom: '16px'
        }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: 0.8 }}>
          We apologize for the inconvenience. Our team has been notified.
        </p>
        <button 
          onClick={reset}
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--burgundy-deep, #5D1A1F)',
            color: '#fff',
            border: 'none',
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
