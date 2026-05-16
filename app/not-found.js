'use client';

export default function NotFound() {
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
          غير موجود
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: '1.8rem',
          color: 'var(--burgundy-deep, #5D1A1F)',
          marginBottom: '16px'
        }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: 0.8 }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: 'var(--burgundy-deep, #5D1A1F)',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            transition: 'background 0.3s'
          }}
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
