import Link from 'next/link';
import './page.css';

export default function Home() {
  return (
    <>
      {/* HERO UNIFIED */}
      <section className="hero">
        <div className="hero-frame">
          <div className="hf-corner hf-tl"></div>
          <div className="hf-corner hf-tr"></div>
          <div className="hf-corner hf-bl"></div>
          <div className="hf-corner hf-br"></div>
          
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-eyebrow" style={{ color: 'var(--cream-pale)', opacity: 0.8 }}>EST. ATELIER · ٢٠٢٤</div>
              <h1 className="hero-title">Organic<br/>Calligraphy</h1>
              <Link href="/collections" className="hero-btn">Browse Collection</Link>
            </div>
            
            <div className="hero-center">
              <div className="hero-canvas-stack">
                <div className="hero-canvas hero-canvas-1">
                  <svg viewBox="0 0 200 270" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="hc1bg" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#5d1a1f"/>
                        <stop offset="1" stopColor="#4a0d13"/>
                      </linearGradient>
                    </defs>
                    <rect width="200" height="270" fill="url(#hc1bg)"/>
                    <rect x="10" y="10" width="180" height="250" fill="none" stroke="#c9a96e" strokeWidth="1"/>
                    <g transform="translate(100, 110)">
                      <circle r="38" fill="none" stroke="#c9a96e" strokeWidth="1"/>
                      <circle r="10" fill="#b85427"/>
                    </g>
                  </svg>
                </div>
                <div className="hero-canvas hero-canvas-2">
                  <svg viewBox="0 0 220 295" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="hc2bg" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#3d4a26"/>
                        <stop offset="1" stopColor="#2d3919"/>
                      </linearGradient>
                    </defs>
                    <rect width="220" height="295" fill="url(#hc2bg)"/>
                    <rect x="12" y="12" width="196" height="271" fill="none" stroke="#c9a96e" strokeWidth="1"/>
                    <g transform="translate(110, 150)">
                      <circle r="40" fill="none" stroke="#c9a96e" strokeWidth="1"/>
                      <circle r="8" fill="#b85427"/>
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            <div className="hero-right">
              <h1 className="hero-title" style={{ textAlign: 'right' }}>Bridal<br/>Collections.</h1>
              <Link href="/collections/bridal-gift" className="hero-btn">Discover Gifts</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOSAIC GRID */}
      <section className="mosaic" id="mosaic">
        <div className="mosaic-inner">

          <div className="tile tile-hero">
            <div className="tile-svg-bg">
              <svg viewBox="0 0 600 540" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="th-bg" cx="0.5" cy="0.5" r="0.7">
                    <stop offset="0" stopColor="#7a3530" stopOpacity="0.4"/>
                    <stop offset="1" stopColor="#4a0d13" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <rect width="600" height="540" fill="url(#th-bg)"/>
                <rect x="60" y="60" width="480" height="420" fill="none" stroke="#c9a96e" strokeWidth="1.5"/>
                <rect x="72" y="72" width="456" height="396" fill="none" stroke="#c9a96e" strokeWidth="0.5" opacity="0.6"/>
                <g transform="translate(300, 270)">
                  <g fill="none" stroke="#c9a96e" strokeWidth="1.5">
                    <path d="M0 -150 L40 -40 L150 0 L40 40 L0 150 L-40 40 L-150 0 L-40 -40 Z"/>
                    <path d="M-106 -106 L0 -40 L106 -106 L40 0 L106 106 L0 40 L-106 106 L-40 0 Z"/>
                    <circle r="100"/>
                    <circle r="80"/>
                    <circle r="60"/>
                    <circle r="40"/>
                  </g>
                  <circle r="22" fill="#b85427" opacity="0.85"/>
                  <circle r="10" fill="#c9a96e"/>
                </g>
                <g stroke="#c9a96e" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.85">
                  <path d="M150 430 Q220 410 280 430 Q340 450 400 430 Q440 415 450 430"/>
                  <path d="M170 450 Q230 438 280 450 Q330 462 390 450" opacity="0.5"/>
                  <circle cx="150" cy="430" r="3" fill="#c9a96e"/>
                  <circle cx="450" cy="430" r="3" fill="#c9a96e"/>
                  <circle cx="300" cy="425" r="2" fill="#c9a96e"/>
                </g>
                <g fill="#c9a96e" opacity="0.7">
                  <circle cx="300" cy="100" r="3"/>
                  <circle cx="280" cy="115" r="1.5"/>
                  <circle cx="320" cy="115" r="1.5"/>
                </g>
              </svg>
            </div>
            <div className="tile-content">
              <div>
                <div className="tile-arabic" style={{ color: 'var(--gold-bright)' }}>آية الكرسي</div>
                <div className="tile-eyebrow" style={{ color: 'var(--gold-bright)' }}>SIGNATURE PIECE</div>
                <div className="tile-title-big">Ayat al-Kursi</div>
                <div className="tile-sub" style={{ color: 'var(--cream-dark)' }}>60 × 48″ · Diwani Script · Hand-Gilded</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontFamily: 'var(--font-cinzel), serif', color: 'var(--gold-bright)', fontSize: '1.1rem', letterSpacing: '0.1em' }}>$1,890</span>
                <Link href="/product/ayat-al-kursi" className="tile-btn">View Piece</Link>
              </div>
            </div>
          </div>

          <div className="tile tile-mid-1 tile-burgundy">
            <div className="tile-orn-bg"></div>
            <div className="tile-content">
              <div>
                <div className="tile-arabic" style={{ color: 'var(--gold-bright)' }}>مجموعة العروس</div>
                <div className="tile-eyebrow" style={{ color: 'var(--gold-bright)' }}>NEW ARRIVALS</div>
                <div className="tile-title">Bridal & Gift<br/>Collections</div>
                <div className="tile-sub">Curated pieces for weddings, anniversaries, and the homes of those you love.</div>
              </div>
              <Link href="/collections/bridal-gift" className="tile-btn">Browse Gifts</Link>
            </div>
          </div>

          <div className="tile tile-mid-2 tile-copper">
            <div className="tile-content" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="tile-arabic">بسم الله</div>
                <div className="tile-title" style={{ fontSize: '1.15rem' }}>Bismillah Series</div>
                <div className="tile-sub" style={{ marginBottom: 0 }}>From $890</div>
              </div>
              <Link href="/collections/quranic-verses" className="tile-btn">Shop →</Link>
            </div>
          </div>

          <div className="tile tile-info tile-cream">
            <div className="tile-content">
              <div>
                <div className="tile-arabic" style={{ color: 'var(--copper)' }}>الأكثر مبيعاً</div>
                <div className="tile-eyebrow" style={{ color: 'var(--olive)' }}>MOST WANTED</div>
                <div className="tile-title-big">Atelier<br/>Selections</div>
                <ul className="tile-info-list">
                  <li>Ayat al-Kursi <span className="price">$1,890</span></li>
                  <li>99 Names of Allah <span className="price">$1,580</span></li>
                  <li>Surah Al-Fatiha <span className="price">$1,240</span></li>
                  <li>Al-Ikhlas <span className="price">$980</span></li>
                  <li>Bismillah <span className="price">$890</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="tile tile-row2-a tile-cream-light">
            <div className="tile-content">
              <div>
                <div className="tile-arabic" style={{ color: 'var(--copper)' }}>قطع فريدة</div>
                <div className="tile-title" style={{ fontSize: '1.2rem', color: 'var(--burgundy-deep)' }}>Limited<br/>Editions</div>
              </div>
              <Link href="/collections/limited-editions" className="tile-btn">Discover</Link>
            </div>
          </div>

          <div className="tile tile-row2-b tile-burgundy-deep">
            <div className="tile-svg-bg">
              <svg viewBox="0 0 360 360" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(180, 180)">
                  <g fill="none" stroke="#c9a96e" strokeWidth="0.8" opacity="0.6">
                    <path d="M0 -120 L34 -34 L120 0 L34 34 L0 120 L-34 34 L-120 0 L-34 -34 Z"/>
                    <circle r="80"/>
                    <circle r="55"/>
                  </g>
                </g>
              </svg>
            </div>
            <div className="tile-content">
              <div>
                <div className="tile-arabic" style={{ color: 'var(--gold-bright)' }}>الهندسة المقدّسة</div>
                <div className="tile-eyebrow" style={{ color: 'var(--gold-bright)' }}>GEOMETRY</div>
                <div className="tile-title">Sacred<br/>Geometry</div>
              </div>
              <Link href="/collections/sacred-geometry" className="tile-btn">36 Pieces</Link>
            </div>
          </div>

          <div className="tile tile-row2-c tile-image">
            <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="img-c" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#6b2e2a"/>
                  <stop offset="1" stopColor="#4a0d13"/>
                </linearGradient>
              </defs>
              <rect width="360" height="240" fill="url(#img-c)"/>
              <rect x="80" y="40" width="200" height="160" fill="#3d4a26" stroke="#c9a96e" strokeWidth="1.5"/>
              <rect x="88" y="48" width="184" height="144" fill="none" stroke="#c9a96e" strokeWidth="0.5" opacity="0.6"/>
              <g transform="translate(180, 120)">
                <g fill="none" stroke="#c9a96e" strokeWidth="0.8">
                  <path d="M0 -45 L13 -13 L45 0 L13 13 L0 45 L-13 13 L-45 0 L-13 -13 Z"/>
                  <circle r="30"/>
                </g>
                <circle r="6" fill="#b85427"/>
              </g>
              <line x1="0" y1="220" x2="360" y2="220" stroke="#c9a96e" strokeWidth="0.5" opacity="0.3"/>
            </svg>
            <div className="tile-image-overlay">
              <div className="o-title">In Your Space</div>
              <div className="o-sub">See pieces hung in real homes</div>
            </div>
          </div>

          <div className="tile tile-row2-d tile-olive">
            <div className="tile-svg-bg">
              <svg viewBox="0 0 240 360" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(120, 180)" fill="none" stroke="#c9a96e" strokeWidth="0.6" opacity="0.5">
                  <circle r="100"/>
                  <circle r="75"/>
                  <circle r="50"/>
                  <path d="M0 -100 L0 100 M-100 0 L100 0"/>
                  <path d="M-71 -71 L71 71 M71 -71 L-71 71"/>
                </g>
              </svg>
            </div>
            <div className="tile-content">
              <div>
                <div className="tile-arabic" style={{ color: 'var(--gold-bright)' }}>الأسماء الحسنى</div>
                <div className="tile-title" style={{ fontSize: '1.15rem' }}>99 Names</div>
              </div>
              <Link href="/collections/99-names" className="tile-btn">Explore</Link>
            </div>
          </div>

          <div className="tile tile-row2-e tile-burgundy">
            <div className="tile-svg-bg" style={{ opacity: 0.4 }}>
              <svg viewBox="0 0 240 360" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#c9a96e" strokeWidth="0.5" fill="none" opacity="0.6">
                  <path d="M120 60 L140 110 L195 110 L150 145 L170 200 L120 165 L70 200 L90 145 L45 110 L100 110 Z"/>
                  <circle cx="120" cy="135" r="20"/>
                </g>
              </svg>
            </div>
            <div className="tile-content">
              <div>
                <div className="tile-arabic" style={{ color: 'var(--gold-bright)' }}>طلب خاص</div>
                <div className="tile-eyebrow" style={{ color: 'var(--gold-bright)' }}>BESPOKE</div>
                <div className="tile-title" style={{ fontSize: '1.1rem' }}>Custom<br/>Commissions</div>
              </div>
              <Link href="/commissions" className="tile-btn">Inquire</Link>
            </div>
          </div>

        </div>
      </section>

      {/* HERITAGE */}
      <section className="heritage" id="heritage">
        <div className="heritage-inner">

          <svg className="heritage-mandala" viewBox="0 0 300 300" fill="none" stroke="currentColor" strokeWidth="0.7">
            <circle cx="150" cy="150" r="140"/>
            <circle cx="150" cy="150" r="130" strokeWidth="0.4" opacity="0.6"/>
            <circle cx="150" cy="150" r="115"/>
            <g transform="translate(150 150)">
              <g id="petal-l">
                <path d="M0 -125 Q-8 -110 0 -100 Q8 -110 0 -125 Z"/>
              </g>
              <use href="#petal-l" transform="rotate(15)"/>
              <use href="#petal-l" transform="rotate(30)"/>
              <use href="#petal-l" transform="rotate(45)"/>
              <use href="#petal-l" transform="rotate(60)"/>
              <use href="#petal-l" transform="rotate(75)"/>
              <use href="#petal-l" transform="rotate(90)"/>
              <use href="#petal-l" transform="rotate(105)"/>
              <use href="#petal-l" transform="rotate(120)"/>
              <use href="#petal-l" transform="rotate(135)"/>
              <use href="#petal-l" transform="rotate(150)"/>
              <use href="#petal-l" transform="rotate(165)"/>
              <use href="#petal-l" transform="rotate(180)"/>
              <use href="#petal-l" transform="rotate(195)"/>
              <use href="#petal-l" transform="rotate(210)"/>
              <use href="#petal-l" transform="rotate(225)"/>
              <use href="#petal-l" transform="rotate(240)"/>
              <use href="#petal-l" transform="rotate(255)"/>
              <use href="#petal-l" transform="rotate(270)"/>
              <use href="#petal-l" transform="rotate(285)"/>
              <use href="#petal-l" transform="rotate(300)"/>
              <use href="#petal-l" transform="rotate(315)"/>
              <use href="#petal-l" transform="rotate(330)"/>
              <use href="#petal-l" transform="rotate(345)"/>
            </g>
            <circle cx="150" cy="150" r="90"/>
            <circle cx="150" cy="150" r="78" strokeWidth="0.4" opacity="0.5"/>
            <g transform="translate(150 150)" strokeWidth="1">
              <path d="M0 -75 L21 -21 L75 0 L21 21 L0 75 L-21 21 L-75 0 L-21 -21 Z"/>
              <path d="M-53 -53 L0 -21 L53 -53 L21 0 L53 53 L0 21 L-53 53 L-21 0 Z"/>
            </g>
            <circle cx="150" cy="150" r="42"/>
            <g transform="translate(150 150)">
              <g id="petal-l-inner">
                <path d="M0 -38 Q-6 -28 0 -22 Q6 -28 0 -38 Z" fill="currentColor" opacity="0.8"/>
              </g>
              <use href="#petal-l-inner" transform="rotate(45)"/>
              <use href="#petal-l-inner" transform="rotate(90)"/>
              <use href="#petal-l-inner" transform="rotate(135)"/>
              <use href="#petal-l-inner" transform="rotate(180)"/>
              <use href="#petal-l-inner" transform="rotate(225)"/>
              <use href="#petal-l-inner" transform="rotate(270)"/>
              <use href="#petal-l-inner" transform="rotate(315)"/>
            </g>
            <circle cx="150" cy="150" r="14" fill="currentColor" opacity="0.9"/>
            <circle cx="150" cy="150" r="6" fill="#f7ecd5" stroke="none"/>
            <circle cx="150" cy="150" r="2" fill="currentColor" stroke="none"/>
            <g fill="currentColor">
              <circle cx="150" cy="48" r="2"/>
              <circle cx="150" cy="252" r="2"/>
              <circle cx="48" cy="150" r="2"/>
              <circle cx="252" cy="150" r="2"/>
            </g>
          </svg>

          <div className="heritage-text">
            <div className="heritage-arabic">فنّ التراث</div>
            <div className="heritage-eyebrow">— A Living Tradition —</div>
            <h2 className="heritage-title">Heritage Art<em>passed from hand to canvas</em></h2>
            <p className="heritage-body">For over a thousand years, Islamic calligraphy has stood as the highest of the visual arts — not merely writing, but worship made visible. At HILAL, we partner with master calligraphers across Istanbul, Cairo, and Lahore to bring these living traditions onto canvases worthy of your walls. Every piece begins with paper and reed pen — and is finished by hand, in our atelier.</p>
            <Link href="/heritage" className="heritage-btn">Read Our Story</Link>
          </div>

          <svg className="heritage-mandala" viewBox="0 0 300 300" fill="none" stroke="currentColor" strokeWidth="0.7">
            <circle cx="150" cy="150" r="140"/>
            <circle cx="150" cy="150" r="130" strokeWidth="0.4" opacity="0.6"/>
            <circle cx="150" cy="150" r="115"/>
            <g transform="translate(150 150)">
              <g id="petal-r">
                <path d="M0 -125 Q-10 -108 -3 -98 Q0 -100 3 -98 Q10 -108 0 -125 Z"/>
              </g>
              <use href="#petal-r" transform="rotate(20)"/>
              <use href="#petal-r" transform="rotate(40)"/>
              <use href="#petal-r" transform="rotate(60)"/>
              <use href="#petal-r" transform="rotate(80)"/>
              <use href="#petal-r" transform="rotate(100)"/>
              <use href="#petal-r" transform="rotate(120)"/>
              <use href="#petal-r" transform="rotate(140)"/>
              <use href="#petal-r" transform="rotate(160)"/>
              <use href="#petal-r" transform="rotate(180)"/>
              <use href="#petal-r" transform="rotate(200)"/>
              <use href="#petal-r" transform="rotate(220)"/>
              <use href="#petal-r" transform="rotate(240)"/>
              <use href="#petal-r" transform="rotate(260)"/>
              <use href="#petal-r" transform="rotate(280)"/>
              <use href="#petal-r" transform="rotate(300)"/>
              <use href="#petal-r" transform="rotate(320)"/>
              <use href="#petal-r" transform="rotate(340)"/>
            </g>
            <circle cx="150" cy="150" r="90"/>
            <circle cx="150" cy="150" r="78" strokeWidth="0.4" opacity="0.5"/>
            <g transform="translate(150 150)" strokeWidth="1">
              <path d="M0 -75 L19 -33 L65 -38 L34 0 L65 38 L19 33 L0 75 L-19 33 L-65 38 L-34 0 L-65 -38 L-19 -33 Z"/>
            </g>
            <circle cx="150" cy="150" r="48"/>
            <circle cx="150" cy="150" r="36" strokeWidth="1.2"/>
            <g transform="translate(150 150)">
              <path d="M14 0 A18 18 0 1 1 -2 -16 A14 14 0 1 0 14 0 Z" fill="currentColor"/>
              <circle cx="20" cy="-12" r="2.5" fill="currentColor"/>
            </g>
            <g fill="currentColor">
              <circle cx="150" cy="48" r="2"/>
              <circle cx="150" cy="252" r="2"/>
              <circle cx="48" cy="150" r="2"/>
              <circle cx="252" cy="150" r="2"/>
            </g>
          </svg>
        </div>
      </section>
    </>
  );
}
