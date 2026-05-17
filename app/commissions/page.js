'use client';
import { useState } from 'react';
import { submitCommission } from '@/app/actions/commission';

export default function Commissions() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrors({});

    const formData = new FormData(e.target);
    const res = await submitCommission(formData);

    if (res.error) {
      setStatus('error');
      setErrors({ general: res.error });
    } else {
      setStatus('success');
      setResult(res);
    }
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
              <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', color: 'var(--ink)' }}>
                Your inquiry has been received. Our atelier will contact you shortly.
              </p>
              {result?.id && (
                <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '0.95rem', color: 'var(--cream-dark)', marginTop: '12px' }}>
                  Reference: <strong>#{result.id.slice(0, 8)}</strong>
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {errors.general && (
                <div style={{ padding: '12px', background: 'rgba(93,26,31,0.08)', border: '1px solid rgba(93,26,31,0.3)', color: 'var(--burgundy-deep)', fontSize: '0.9rem' }}>
                  {errors.general}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>NAME</label>
                <input name="name" required type="text" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: errors.name ? '1px solid var(--burgundy-deep)' : '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>EMAIL</label>
                <input name="email" required type="email" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: errors.email ? '1px solid var(--burgundy-deep)' : '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>PHONE (OPTIONAL)</label>
                <input name="phone" type="tel" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>DESIRED VERSE / TEXT</label>
                <input name="desiredVerse" type="text" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>DIMENSIONS (OPTIONAL)</label>
                <input name="dimensions" type="text" placeholder="e.g. 60 x 30 inches" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>BUDGET RANGE (OPTIONAL)</label>
                <select name="budgetRange" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }}>
                  <option value="">Select a range</option>
                  <option value="under-500">Under $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value="5000+">$5,000+</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>SCRIPT PREFERENCE (OPTIONAL)</label>
                <select name="scriptPreference" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }}>
                  <option value="">Select a script</option>
                  <option value="Thuluth">Thuluth</option>
                  <option value="Diwani">Diwani</option>
                  <option value="Naskh">Naskh</option>
                  <option value="Nastaliq">Nastaliq</option>
                  <option value="Jali Thuluth">Jali Thuluth</option>
                  <option value="Ottoman Tezhip">Ottoman Tezhip</option>
                  <option value="No preference">No preference</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>COLOR PREFERENCE (OPTIONAL)</label>
                <input name="colorPreference" type="text" placeholder="e.g. Teal, Burgundy, Gold" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-cinzel), serif', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>MESSAGE</label>
                <textarea name="message" required rows="4" style={{ width: '100%', padding: '12px', background: 'var(--cream-pale)', border: '1px solid rgba(93,26,31,0.2)', fontFamily: 'var(--font-cormorant), serif', fontSize: '1rem' }}></textarea>
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
