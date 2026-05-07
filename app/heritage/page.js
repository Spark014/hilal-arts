import Link from 'next/link';

export default function Heritage() {
  return (
    <div style={{ padding: '80px 40px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-amiri), serif', fontSize: '2rem', color: 'var(--copper)', marginBottom: '10px' }}>تراثنا</div>
      <h1 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '3rem', color: 'var(--burgundy-deep)', marginBottom: '40px' }}>Our Heritage</h1>
      
      <div style={{ marginBottom: '60px' }}>
        <img src="/logo-full-cream-centered.png" alt="Hilal Arts Crest" style={{ width: '200px', margin: '0 auto 40px' }} />
      </div>

      <div style={{ display: 'grid', gap: '40px', textAlign: 'left', borderTop: '1px solid var(--gold)', paddingTop: '60px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '1.8rem', color: 'var(--burgundy-deep)', marginBottom: '16px' }}>The Living Tradition</h2>
          <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', color: 'var(--ink)', lineHeight: 1.8 }}>
            For over a thousand years, Islamic calligraphy has stood as the highest of the visual arts — not merely writing, but worship made visible. At HILAL, we partner with master calligraphers across Istanbul, Cairo, and Lahore to bring these living traditions onto canvases worthy of your walls. Every piece begins with paper and reed pen — and is finished by hand, in our atelier.
          </p>
        </div>

        <div>
          <h2 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '1.8rem', color: 'var(--burgundy-deep)', marginBottom: '16px' }}>Museum-Grade Materials</h2>
          <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', color: 'var(--ink)', lineHeight: 1.8 }}>
            We believe sacred art demands the finest materials. We use heavyweight archival cotton canvas, acid-free grounds, and UV-resistant pigments. Our signature pieces are hand-gilded in our studio using 24k gold, white gold, and copper leaf, applied using traditional mordant techniques that ensure the metal catches the light beautifully and lasts for generations.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '80px', padding: '60px 40px', background: 'var(--burgundy-deep)', color: 'var(--cream-pale)' }}>
        <h2 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '2rem', marginBottom: '20px' }}>Commission a Legacy</h2>
        <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
          Have a specific verse or family name in mind? Our masters are available for bespoke commissions.
        </p>
        <Link href="/commissions" style={{
          display: 'inline-block',
          padding: '14px 36px',
          border: '1px solid var(--gold-bright)',
          color: 'var(--gold-bright)',
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: '0.8rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          borderRadius: '30px',
        }}>
          Inquire Now
        </Link>
      </div>
    </div>
  );
}
