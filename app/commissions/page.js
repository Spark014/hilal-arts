'use client';
import { useState } from 'react';

export default function Commissions() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div style={{ padding: '80px 40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ fontFamily: 'var(--font-amiri), serif', fontSize: '2rem', color: 'var(--copper)', marginBottom: '10px' }}>طلب خاص</div>
        <h1 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '3rem', color: 'var(--burgundy-deep)', marginBottom: '16px' }}>Bespoke Commissions</h1>
        <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', color: 'var(--ink)', maxWidth: '600px', margin: '0 auto' }}>
          Work directly with our master calligraphers to create a piece tailored to your spiritual journey and home.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '1.5rem', color: 'var(--gold-bright)', marginBottom: '24px' }}>The Process</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-cinzel), serif', color: 'var(--copper)', fontSize: '0.8rem', letterSpacing: '0.2em', marginBottom: '8px' }}>STEP 01 — CONSULTATION</div>
              <h3 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.4rem', marginBottom: '8px' }}>Vision & Text</h3>
              <p style={{ color: 'var(--cream-dark)', fontSize: '0.95rem' }}>We discuss your desired verse, script preference, and the dimensions suited for your space.</p>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-cinzel), serif', color: 'var(--copper)', fontSize: '0.8rem', letterSpacing: '0.2em', marginBottom: '8px' }}>STEP 02 — DESIGN</div>
              <h3 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.4rem', marginBottom: '8px' }}>Calligraphy Drafts</h3>
              <p style={{ color: 'var(--cream-dark)', fontSize: '0.95rem' }}>Our masters create initial sketches on paper. You review the flow and composition before final work begins.</p>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-cinzel), serif', color: 'var(--copper)', fontSize: '0.8rem', letterSpacing: '0.2em', marginBottom: '8px' }}>STEP 03 — CREATION</div>
              <h3 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.4rem', marginBottom: '8px' }}>Canvas & Gilding</h3>
              <p style={{ color: 'var(--cream-dark)', fontSize: '0.95rem' }}>The script is transferred to canvas, hand-painted, and finished with 24k gold or silver leaf in our atelier.</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--cream)', padding: '40px', border: '1px solid var(--gold-pale)' }}>
          <h2 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '1.5rem', color: 'var(--burgundy-deep)', marginBottom: '24px' }}>Inquire</h2>
          
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontFamily: 'var(--font-amiri), serif', fontSize: '2rem', color: 'var(--copper)', marginBottom: '16px' }}>شكراً لك</div>
              <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', color: 'var(--ink)' }}>Your inquiry has been received. Our atelier will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>NAME</label>
                <input required type="text" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>EMAIL</label>
                <input required type="email" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>DESIRED VERSE / TEXT</label>
                <input type="text" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>MESSAGE</label>
                <textarea required rows="4" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }}></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                style={{
                  marginTop: '10px',
                  padding: '14px',
                  backgroundColor: 'var(--burgundy-deep)',
                  color: 'var(--cream-pale)',
                  border: 'none',
                  fontFamily: 'var(--font-cinzel), serif',
                  fontSize: '0.8rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: status === 'submitting' ? 'wait' : 'pointer',
                  opacity: status === 'submitting' ? 0.7 : 1,
                  transition: 'background 0.3s'
                }}
              >
                {status === 'submitting' ? 'Sending...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
