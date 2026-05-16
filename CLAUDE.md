# HILAL Arts — Project Context

## What This Is

HILAL Arts is a luxury Islamic calligraphy e-commerce boutique. The site sells hand-finished canvas pieces by master calligraphers from Istanbul, Cairo, and Lahore. Products range from $15 mini canvas sets to $400 large Asmaul Husna pieces, with bespoke commissions available.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 — App Router (not Pages Router) |
| UI | React 19.2.4 / React DOM 19.2.4 |
| Language | JavaScript (no TypeScript) |
| Styling | Custom CSS — global CSS variables + `style jsx` (styled-jsx) inline |
| Fonts | Cormorant Garamond, Cinzel, Amiri (Arabic), Reem Kufi (Arabic) via `next/font/google` |
| State | React Context API (`lib/CartContext.js`) + `localStorage` persistence |
| Data | Static product catalog in `lib/data.js` — no database or backend |
| Payments | Not yet integrated — checkout button is UI-only |
| Tests | None |
| Linting | None configured |

## Directory Structure

```
app/
  layout.js              Root layout — CartProvider, fonts, grain overlay, Header, CartDrawer, Footer
  page.js                Homepage: split hero, mosaic product grid, heritage section
  page.css               Homepage styles
  globals.css            Global CSS variables (design tokens) + shared component styles
  collections/
    page.js              All products grid + sidebar collection filter
    [slug]/page.js       Products filtered by collection slug
  product/
    [slug]/page.js       Product detail: gallery, add-to-cart, related products
  commissions/page.js    Bespoke commission inquiry form (simulated submit, no real API)
  heritage/page.js       About/heritage story page

components/
  Header.js              Sticky nav, mobile hamburger, cart count badge, scroll shrink
  Footer.js              4-column footer with links and social icons
  CartDrawer.js          Slide-out overlay cart with qty controls
  ProductCard.js         Image card with hover overlay + product info

lib/
  CartContext.js         Cart state: add/remove/updateQty/clear, persisted to localStorage
  data.js                Static product catalog (13 products) and 4 collections

public/                  Product images, logos, brand assets (PNG/JPG, SVG, PSD)
```

## Data Model

### Product (`lib/data.js`)
```js
{
  id, slug, name, arabicName,
  collection,         // matches collections[].id
  collectionLabel,
  script,             // e.g. 'Thuluth', 'Diwani', 'Nastaliq', 'Naskh', 'Jali Thuluth'
  dimensions,         // e.g. '60 × 30″'
  canvasSize,         // 'large' | 'medium' | 'small'
  price,              // USD number
  customizationFee,
  processingTime,
  description,
  calligrapher,       // e.g. 'Master Hasan, Istanbul'
  image,              // path under /public
  images,             // array of paths
  features,           // string[]
  customizations,     // string[]
}
```

### Collection IDs
`'quranic-verses'` | `'99-names'` | `'bridal-gift'` | `'limited-editions'`

### Pricing tiers
- Large (30–50″): $200–$400
- Medium (10–30″): $30–$100
- Small (<10″): $5–$20
- Asmaul Husna: avg $400 (+$100 custom)
- Ayatul Kursi: avg $350 (+$50 custom)

## Design System

CSS custom properties defined in `app/globals.css`:

| Token | Value |
|---|---|
| `--burgundy-deep` | `#4a0d13` |
| `--olive` | `#3d4a26` |
| `--cream-pale` | `#f7ecd5` (page background) |
| `--copper` | `#b85427` |
| `--gold-bright` | `#c9a96e` |
| `--ink` | `#2a1810` |

Font variables: `--font-cormorant` (body), `--font-cinzel` (headings/labels/nav), `--font-amiri` (Arabic text, RTL), `--font-reem` (Arabic alternative).

Decorative elements: SVG grain texture overlay (`.grain`), filigree band at top, arabesque SVG ornaments inline in JSX.

## Known Incomplete Features

- **Checkout**: CartDrawer has a "Checkout" button with no payment processing wired up
- **Commission form**: Uses `setTimeout` to simulate submission — no real API endpoint
- **Search**: Header Search button exists but has no functionality
- **Account**: Header Account button exists but has no functionality
- **Collection slug page** (`/collections/[slug]`): Route exists but needs review for filtering logic

## Build & Run

```bash
npm run dev      # development server on localhost:3000
npm run build    # production build
npm run start    # serve production build
```

No environment variables required for current functionality.

## Conventions

- Most pages and components use `'use client'` — the app is largely client-rendered
- Inline `style jsx` is used for component-scoped styles (alongside module CSS and global CSS)
- Arabic text always uses `font-family: var(--font-amiri)` and `direction: rtl`
- Product slugs match product IDs (e.g. `ayat-al-kursi-teal`)
- Images live in `/public` and are referenced as absolute paths from root (e.g. `/product-ayatul-kursi-teal-1.jpg`)

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
