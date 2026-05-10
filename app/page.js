import Link from 'next/link';
import './page.css';

export default function Home() {
  return (
    <>
      {/* HERO Split */}
      <section className="hero">
        <div className="hero-half hero-burgundy">
          <svg className="corner-orn corner-tl" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.9">
            <path d="M5 5 L40 5 M5 5 L5 40"/>
            <path d="M5 5 Q35 8 40 35 Q35 60 60 60 Q60 35 35 30"/>
            <path d="M15 15 Q40 18 50 40 M15 15 Q18 40 40 50"/>
            <circle cx="50" cy="50" r="8"/>
            <circle cx="50" cy="50" r="3" fill="currentColor"/>
            <circle cx="22" cy="22" r="1.5" fill="currentColor"/>
            <path d="M70 10 Q75 15 80 10 M10 70 Q15 75 10 80" strokeWidth="0.6"/>
            <circle cx="80" cy="14" r="1" fill="currentColor"/>
            <circle cx="14" cy="80" r="1" fill="currentColor"/>
          </svg>
          <svg className="corner-orn corner-bl" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.9">
            <path d="M5 5 L40 5 M5 5 L5 40"/>
            <path d="M5 5 Q35 8 40 35 Q35 60 60 60 Q60 35 35 30"/>
            <path d="M15 15 Q40 18 50 40 M15 15 Q18 40 40 50"/>
            <circle cx="50" cy="50" r="8"/>
            <circle cx="50" cy="50" r="3" fill="currentColor"/>
            <circle cx="22" cy="22" r="1.5" fill="currentColor"/>
          </svg>

          <div className="hero-eyebrow">EST. ATELIER · ٢٠٢٤</div>
          <div className="hero-arabic-big">فنّ الخطّ العربي</div>
          <h1 className="hero-title">Organic<br/>Calligraphy<em>The art of the written word, on canvas.</em></h1>
          <p className="hero-desc">Hand-composed by master calligraphers across Istanbul, Cairo, and Lahore — finished in our atelier with metallic leaf and archival care.</p>
          <Link href="/collections" className="hero-btn">Shop the Collection</Link>
        </div>

        <div className="hero-half hero-olive">
          <svg className="corner-orn corner-tr" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.9">
            <path d="M5 5 L40 5 M5 5 L5 40"/>
            <path d="M5 5 Q35 8 40 35 Q35 60 60 60 Q60 35 35 30"/>
            <path d="M15 15 Q40 18 50 40 M15 15 Q18 40 40 50"/>
            <circle cx="50" cy="50" r="8"/>
            <circle cx="50" cy="50" r="3" fill="currentColor"/>
            <circle cx="22" cy="22" r="1.5" fill="currentColor"/>
          </svg>
          <svg className="corner-orn corner-br" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.9">
            <path d="M5 5 L40 5 M5 5 L5 40"/>
            <path d="M5 5 Q35 8 40 35 Q35 60 60 60 Q60 35 35 30"/>
            <path d="M15 15 Q40 18 50 40 M15 15 Q18 40 40 50"/>
            <circle cx="50" cy="50" r="8"/>
            <circle cx="50" cy="50" r="3" fill="currentColor"/>
            <circle cx="22" cy="22" r="1.5" fill="currentColor"/>
          </svg>

          <div className="hero-eyebrow">EXCLUSIVE EDITIONS</div>
          <div className="hero-arabic-big">المجموعة الذهبيّة</div>
          <h1 className="hero-title">Master<br/>Compositions<em>Limited atelier pieces, gilded and signed.</em></h1>
          <p className="hero-desc">Each commissioned canvas bears the seal and signature of its calligrapher — a single, sovereign work, never repeated.</p>
          <Link href="/commissions" className="hero-btn">Commission a Piece</Link>
        </div>

        <svg className="hero-medallion" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" fill="#f7ecd5" stroke="#4a0d13" strokeWidth="2"/>
          <circle cx="40" cy="40" r="32" fill="none" stroke="#b8924b" strokeWidth="0.8"/>
          <path d="M52 40 A12 12 0 1 1 40 28 A9 9 0 1 0 52 40 Z" fill="#b85427"/>
          <circle cx="56" cy="32" r="2" fill="#b85427"/>
        </svg>

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
                <rect x="16" y="16" width="168" height="238" fill="none" stroke="#c9a96e" strokeWidth="0.4" opacity="0.6"/>
                {/* Mihrab arch */}
                <path d="M50 230 L50 120 Q50 55 100 55 Q150 55 150 120 L150 230" fill="none" stroke="#c9a96e" strokeWidth="1.2"/>
                <path d="M58 230 L58 125 Q58 68 100 68 Q142 68 142 125 L142 230" fill="none" stroke="#c9a96e" strokeWidth="0.6" opacity="0.6"/>
                {/* Crescent at top of arch */}
                <g transform="translate(100, 90)">
                  <path d="M8 0 A12 12 0 1 1 -2 -10 A9 9 0 1 0 8 0 Z" fill="#c9a96e"/>
                </g>
                {/* Arabesque curves */}
                <g stroke="#c9a96e" strokeWidth="0.8" fill="none" opacity="0.5">
                  <path d="M65 140 Q80 130 100 140 Q120 150 135 140"/>
                  <path d="M65 155 Q80 145 100 155 Q120 165 135 155"/>
                  <path d="M70 170 Q85 162 100 170 Q115 178 130 170"/>
                </g>
                {/* Bottom arabesque flourish */}
                <g stroke="#c9a96e" strokeWidth="1.4" fill="none" strokeLinecap="round">
                  <path d="M40 200 Q70 185 100 200 T160 200"/>
                  <path d="M50 218 Q80 208 100 218 T150 218" opacity="0.6"/>
                  <circle cx="40" cy="200" r="2" fill="#c9a96e"/>
                  <circle cx="160" cy="200" r="2" fill="#c9a96e"/>
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
                {/* Pointed Islamic arch (ogee) */}
                <path d="M45 265 L45 140 Q45 90 80 70 Q110 55 110 55 Q110 55 140 70 Q175 90 175 140 L175 265" fill="none" stroke="#c9a96e" strokeWidth="1.2"/>
                <path d="M55 265 L55 145 Q55 100 85 82 Q110 68 110 68 Q110 68 135 82 Q165 100 165 145 L165 265" fill="none" stroke="#c9a96e" strokeWidth="0.6" opacity="0.5"/>
                {/* Crescent and minaret finial */}
                <g transform="translate(110, 85)">
                  <path d="M7 0 A10 10 0 1 1 -1 -8 A7 7 0 1 0 7 0 Z" fill="#c9a96e"/>
                  <circle cx="12" cy="-6" r="1.5" fill="#c9a96e"/>
                </g>
                {/* Interlocking arabesque arches */}
                <g stroke="#c9a96e" strokeWidth="0.8" fill="none" opacity="0.5">
                  <path d="M70 160 Q90 145 110 160 Q130 175 150 160"/>
                  <path d="M70 178 Q90 163 110 178 Q130 193 150 178"/>
                  <path d="M75 195 Q92 183 110 195 Q128 207 145 195"/>
                </g>
                {/* Bottom arabesque */}
                <g stroke="#c9a96e" strokeWidth="1.5" fill="none" strokeLinecap="round">
                  <path d="M50 230 Q90 210 110 230 Q130 250 170 230"/>
                  <circle cx="50" cy="230" r="2" fill="#c9a96e"/>
                  <circle cx="170" cy="230" r="2" fill="#c9a96e"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* MOSAIC GRID */}
      <section className="mosaic" id="mosaic">
        <div className="mosaic-inner">

          <div className="tile tile-hero" style={{ backgroundImage: 'url(/product-ayatul-kursi-teal-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="tile-content" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.2) 75%, transparent)' }}>
              <div>
                <div className="tile-arabic" style={{ color: 'var(--gold-bright)' }}>آية الكرسي</div>
                <div className="tile-eyebrow" style={{ color: 'var(--gold-bright)' }}>SIGNATURE PIECE</div>
                <div className="tile-title-big">Ayat al-Kursi</div>
                <div className="tile-sub" style={{ color: 'var(--cream-dark)' }}>60 × 30″ · Thuluth Script · Hand-Gilded</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontFamily: 'var(--font-cinzel), serif', color: 'var(--gold-bright)', fontSize: '1.1rem', letterSpacing: '0.1em' }}>$350</span>
                <Link href="/product/ayat-al-kursi-teal" className="tile-btn">View Piece</Link>
              </div>
            </div>
          </div>

          <div className="tile tile-mid-1" style={{ backgroundImage: 'url(/product-bismillah-beige-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="tile-content" style={{ background: 'linear-gradient(135deg, rgba(74,13,19,0.82) 0%, rgba(74,13,19,0.55) 100%)', color: 'var(--cream-pale)' }}>
              <div>
                <div className="tile-arabic" style={{ color: 'var(--gold-bright)' }}>مجموعة العروس</div>
                <div className="tile-eyebrow" style={{ color: 'var(--gold-bright)' }}>NEW ARRIVALS</div>
                <div className="tile-title">Bridal & Gift<br/>Collections</div>
                <div className="tile-sub">Curated pieces for weddings, anniversaries, and the homes of those you love.</div>
              </div>
              <Link href="/collections/bridal-gift" className="tile-btn">Browse Gifts</Link>
            </div>
          </div>

          <div className="tile tile-mid-2" style={{ backgroundImage: 'url(/product-bismillah-beige-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="tile-content" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(to right, rgba(184,84,39,0.85) 0%, rgba(184,84,39,0.6) 100%)', color: 'var(--cream-pale)' }}>
              <div>
                <div className="tile-arabic" style={{ color: 'var(--cream-pale)' }}>بسم الله</div>
                <div className="tile-title" style={{ fontSize: '1.15rem' }}>Bismillah Series</div>
                <div className="tile-sub" style={{ marginBottom: 0 }}>From $220</div>
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
                  <li>Asmaul Husna Collection <span className="price">$400</span></li>
                  <li>Ayatul Kursi Collection <span className="price">$350</span></li>
                  <li>Ya Hayyu Ya Qayyum <span className="price">$250</span></li>
                  <li>Bismillah Series <span className="price">$220</span></li>
                  <li>Mini Canvas Sets <span className="price">from $15</span></li>
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

          <div className="tile tile-row2-c tile-image" style={{ backgroundImage: 'url(/product-99-names-green-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
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

          <svg className="heritage-mandala" viewBox="0 0 300 300" fill="none" stroke="currentColor" strokeWidth="0.8">
            <circle cx="150" cy="150" r="140" strokeWidth="1.2"/>
            <circle cx="150" cy="150" r="134" strokeWidth="0.4" opacity="0.6"/>
            <circle cx="150" cy="150" r="128" strokeWidth="1"/>
            <g transform="translate(150 150)">
              <defs>
                <g id="star-12">
                  <path d="M 0 -128 L 15 -90 L 0 -75 L -15 -90 Z" fill="currentColor"/>
                  <path d="M 0 -75 Q 15 -55 0 -35 Q -15 -55 0 -75 Z" strokeWidth="1.2"/>
                  <circle cx="0" cy="-55" r="2" fill="currentColor"/>
                  <circle cx="0" cy="-90" r="4" fill="#f7ecd5" stroke="currentColor"/>
                </g>
                <g id="star-12-alt">
                  <path d="M 0 -128 Q 15 -105 0 -85 Q -15 -105 0 -128 Z" strokeWidth="0.8"/>
                </g>
              </defs>
              
              <use href="#star-12" transform="rotate(0)"/>
              <use href="#star-12" transform="rotate(30)"/>
              <use href="#star-12" transform="rotate(60)"/>
              <use href="#star-12" transform="rotate(90)"/>
              <use href="#star-12" transform="rotate(120)"/>
              <use href="#star-12" transform="rotate(150)"/>
              <use href="#star-12" transform="rotate(180)"/>
              <use href="#star-12" transform="rotate(210)"/>
              <use href="#star-12" transform="rotate(240)"/>
              <use href="#star-12" transform="rotate(270)"/>
              <use href="#star-12" transform="rotate(300)"/>
              <use href="#star-12" transform="rotate(330)"/>
              
              <use href="#star-12-alt" transform="rotate(15)"/>
              <use href="#star-12-alt" transform="rotate(45)"/>
              <use href="#star-12-alt" transform="rotate(75)"/>
              <use href="#star-12-alt" transform="rotate(105)"/>
              <use href="#star-12-alt" transform="rotate(135)"/>
              <use href="#star-12-alt" transform="rotate(165)"/>
              <use href="#star-12-alt" transform="rotate(195)"/>
              <use href="#star-12-alt" transform="rotate(225)"/>
              <use href="#star-12-alt" transform="rotate(255)"/>
              <use href="#star-12-alt" transform="rotate(285)"/>
              <use href="#star-12-alt" transform="rotate(315)"/>
              <use href="#star-12-alt" transform="rotate(345)"/>

              {/* 12-point inner star interlacing */}
              <path d="M 0 -40 L 10 -22 L 35 -20 L 20 -4 L 35 20 L 10 22 L 0 40 L -10 22 L -35 20 L -20 -4 L -35 -20 L -10 -22 Z" strokeWidth="1.2" opacity="0.6"/>
              <circle cx="0" cy="0" r="22" fill="currentColor"/>
              <path d="M 0 -14 L 4 -4 L 14 0 L 4 4 L 0 14 L -4 4 L -14 0 L -4 -4 Z" fill="#f7ecd5"/>
            </g>
          </svg>

          <div className="heritage-text">
            <div className="heritage-arabic">فنّ التراث</div>
            <div className="heritage-eyebrow">— A Living Tradition —</div>
            <h2 className="heritage-title">Heritage Art<em>passed from hand to canvas</em></h2>
            <p className="heritage-body">For over a thousand years, Islamic calligraphy has stood as the highest of the visual arts — not merely writing, but worship made visible. At HILAL, we partner with master calligraphers across Istanbul, Cairo, and Lahore to bring these living traditions onto canvases worthy of your walls. Every piece begins with paper and reed pen — and is finished by hand, in our atelier.</p>
            <Link href="/heritage" className="heritage-btn">Read Our Story</Link>
          </div>

          <svg className="heritage-mandala" viewBox="0 0 300 300" fill="none" stroke="currentColor" strokeWidth="0.8">
            <circle cx="150" cy="150" r="140" strokeWidth="1"/>
            <circle cx="150" cy="150" r="132" strokeWidth="0.4" opacity="0.6"/>
            <circle cx="150" cy="150" r="126" strokeWidth="1"/>
            
            <g transform="translate(150 150)">
              <defs>
                <g id="geom-8-edge">
                  <path d="M 0 -126 L 16 -100 L 0 -85 L -16 -100 Z" fill="currentColor"/>
                  <path d="M 0 -85 L 8 -72 L -8 -72 Z" strokeWidth="1"/>
                  <line x1="0" y1="-105" x2="0" y2="-126" stroke="#f7ecd5" strokeWidth="1"/>
                </g>
                <g id="geom-8-edge-alt">
                  <path d="M 0 -126 L 10 -105 L 0 -85 L -10 -105 Z" strokeWidth="1.2"/>
                  <circle cx="0" cy="-105" r="3" fill="currentColor"/>
                </g>
              </defs>
              <use href="#geom-8-edge" transform="rotate(0)"/>
              <use href="#geom-8-edge" transform="rotate(45)"/>
              <use href="#geom-8-edge" transform="rotate(90)"/>
              <use href="#geom-8-edge" transform="rotate(135)"/>
              <use href="#geom-8-edge" transform="rotate(180)"/>
              <use href="#geom-8-edge" transform="rotate(225)"/>
              <use href="#geom-8-edge" transform="rotate(270)"/>
              <use href="#geom-8-edge" transform="rotate(315)"/>
              
              <use href="#geom-8-edge-alt" transform="rotate(22.5)"/>
              <use href="#geom-8-edge-alt" transform="rotate(67.5)"/>
              <use href="#geom-8-edge-alt" transform="rotate(112.5)"/>
              <use href="#geom-8-edge-alt" transform="rotate(157.5)"/>
              <use href="#geom-8-edge-alt" transform="rotate(202.5)"/>
              <use href="#geom-8-edge-alt" transform="rotate(247.5)"/>
              <use href="#geom-8-edge-alt" transform="rotate(292.5)"/>
              <use href="#geom-8-edge-alt" transform="rotate(337.5)"/>

              <g strokeWidth="1.2">
                <path d="M 0 -72 L 25 -25 L 72 0 L 25 25 L 0 72 L -25 25 L -72 0 L -25 -25 Z" fill="rgba(201,169,110,0.05)" strokeWidth="0.8"/>
                <rect x="-42" y="-42" width="84" height="84" transform="rotate(0)"/>
                <rect x="-42" y="-42" width="84" height="84" transform="rotate(45)"/>
              </g>

              <circle cx="0" cy="0" r="28" fill="none" strokeWidth="1.5"/>
              <path d="M 0 -22 L 6 -6 L 22 0 L 6 6 L 0 22 L -6 6 L -22 0 L -6 -6 Z" fill="currentColor"/>
              <circle cx="0" cy="0" r="4" fill="#f7ecd5" stroke="none"/>
            </g>
          </svg>
        </div>
      </section>
    </>
  );
}
