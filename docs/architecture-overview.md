# HILAL Arts — System Architecture

## Overview

A boutique Islamic calligraphy e-commerce platform. Next.js 16 frontend + Supabase backend + Stripe payments.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16.2.6 (App Router), React 19.2.4, JavaScript |
| Styling | Custom CSS (CSS variables + styled-jsx inline) |
| Backend-as-a-Service | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| Payments | Stripe (Checkout + Webhooks) |
| Hosting | Vercel (frontend), Supabase (backend) |
| Images | Supabase Storage (product images, calligrapher portfolios) |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel Edge                          │
│                    (Next.js 16 App Router)                   │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │  API Routes │  │   Server Actions    │  │
│  │  (App Dir)  │  │  (App Dir)  │  │   (Server-side)     │  │
│  │             │  │             │  │                     │  │
│  │ /           │  │ /api/stripe │  │ createOrder()       │  │
│  │ /collections│  │ /api/webhook│  │ addToCart()         │  │
│  │ /product/*  │  │             │  │ updateInventory()   │  │
│  │ /commissions│  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│   Supabase   │ │  Stripe  │ │   Supabase   │
│  PostgreSQL  │ │  (Payments)│ │   Storage    │
│              │ │            │ │   (Images)   │
│  products    │ │  Checkout  │ │              │
│  collections │ │  Sessions  │ │  product/    │
│  orders      │ │  Webhooks  │ │  calligraphy/│
│  order_items │ │            │ │  commissions/│
│  users       │ │            │ │              │
│  carts       │ │            │ │              │
│  commissions │ │            │ │              │
└──────────────┘ └──────────┘ └──────────────┘
```

---

## Frontend Structure (Next.js App Router)

```
app/
  layout.js              # Root layout — fonts, CartProvider, Header, Footer
  page.js                # Homepage — hero, mosaic grid, heritage
  globals.css            # Design tokens + shared styles
  page.css               # Homepage-specific styles
  
  collections/
    page.js              # All products grid + sidebar filters
    [slug]/page.js       # Products filtered by collection slug
    
  product/
    [slug]/page.js       # Product detail page (PDP)
    
  commissions/
    page.js              # Bespoke commission inquiry form
    
  heritage/
    page.js              # About / atelier story page
    
  api/                   # API routes (if needed beyond server actions)
    stripe/
      checkout/route.js  # Create Stripe checkout session
    webhook/
      stripe/route.js  # Handle Stripe webhook events

components/
  Header.js              # Sticky nav, mobile hamburger, cart count
  Footer.js              # 4-column footer
  CartDrawer.js          # Slide-out cart overlay
  ProductCard.js         # Image card with hover overlay

lib/
  data.js                # ⚠️ TO BE DEPRECATED — migrate to Supabase
  CartContext.js         # React Context + localStorage (migrate to server)
  supabase-client.js     # Supabase client initialization
  stripe-client.js       # Stripe publishable key client
```

---

## Backend Structure (Supabase)

### Database (PostgreSQL)

See `data-model.md` for full schema.

Key tables:
- `products` — catalog (replaces `lib/data.js`)
- `collections` — product categories
- `users` — managed by Supabase Auth (extended with `profiles` table)
- `carts` / `cart_items` — server-side cart (replaces localStorage)
- `orders` / `order_items` — purchase records
- `commissions` — bespoke inquiry submissions

### Auth (Supabase Auth)

- Email/password registration + login
- OAuth: Google, Apple (optional)
- Magic links (passwordless)
- Row-Level Security policies restrict data access per user

### Storage (Supabase Storage)

Buckets:
- `product-images` — product photos (public read, admin write)
- `calligraphy-details` — high-res detail shots (public read)
- `commission-references` — images uploaded by commission clients (private)

### Edge Functions (Supabase)

- `stripe-checkout` — create Stripe checkout session
- `stripe-webhook` — handle payment confirmation, create order
- `commission-notification` — email admin on new commission inquiry
- `order-confirmation` — email customer on successful order (future)

---

## Data Flow

### Product Browsing (Read-Heavy)

```
User → Next.js page → Supabase Client (RLS, public read) → PostgreSQL
                    ↓
              Static generation (ISR) where possible
```

Products and collections are largely static. Use Next.js `revalidate` (ISR) to cache product pages and rebuild when products change.

### Cart (Per-User, Read/Write)

**Anonymous users:**
```
User → localStorage cart (temp) → on login/signup → migrate to server cart
```

**Authenticated users:**
```
User → Next.js Server Action → Supabase (carts + cart_items, RLS) → PostgreSQL
```

Cart data is small and personal. Server Actions handle add/remove/update with RLS ensuring users only touch their own rows.

### Checkout (Critical Path)

```
1. User clicks "Checkout" in CartDrawer
2. Next.js Server Action: validate cart, calculate totals, check inventory
3. Server Action calls Supabase Edge Function: create Stripe checkout session
4. Edge Function: creates Stripe session with line items + metadata
5. Redirect user to Stripe Checkout page
6. User completes payment on Stripe
7. Stripe webhook → Supabase Edge Function → create order + order_items + decrement inventory
8. Edge Function: clear cart, send confirmation (future)
9. Redirect user to /order/success page
```

### Commission Inquiry (Write-Only)

```
User fills form → Next.js Server Action → Supabase (commissions table, public insert)
                                                    ↓
                                           Edge Function: email admin
```

No auth required to submit a commission inquiry.

---

## Security Model

### Row-Level Security (RLS) Policies

| Table | Policy | Effect |
|---|---|---|
| `products` | `SELECT` = true | Public read |
| `collections` | `SELECT` = true | Public read |
| `carts` | `SELECT/INSERT/UPDATE/DELETE` = `auth.uid() = user_id` | Users only see own carts |
| `cart_items` | same as carts | Users only see own cart items |
| `orders` | `SELECT` = `auth.uid() = user_id` | Users only see own orders |
| `order_items` | `SELECT` = `auth.uid() = user_id` (via orders join) | Same |
| `commissions` | `INSERT` = true (no auth) | Anyone can submit |
| `commissions` | `SELECT` = `auth.uid() = user_id OR is_admin()` | Users see own, admins see all |
| `profiles` | `SELECT` = true (limited fields), `UPDATE` = own | Public name, private details |

### Stripe Security

- **Webhook signature verification** — all Stripe webhooks verified with endpoint secret
- **Idempotency** — Stripe checkout sessions include `client_reference_id` (cart/order ID) to prevent duplicate orders
- **Price validation** — server-side calculation of cart total; never trust client-side prices
- **Inventory check** — verify stock before creating checkout session

---

## Performance Strategy

1. **ISR for product pages** — `revalidate: 3600` (1 hour) on product detail pages. Rebuild when product updated via webhook.
2. **Image optimization** — Next.js `<Image>` with Supabase Storage CDN URLs
3. **Cart SSR** — If user is authenticated, fetch cart server-side in layout; merge with localStorage on client
4. **Edge caching** — Vercel Edge Network caches static assets, ISR pages
5. **Database indexing** — indexes on `products.collection`, `orders.user_id`, `cart_items.cart_id`

---

## Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=https://hilalarts.vercel.app
```

---

## Deployment

| Service | Platform | Trigger |
|---|---|---|
| Frontend | Vercel | Git push to main branch |
| Database | Supabase | Managed |
| Edge Functions | Supabase | CLI deploy |
| Storage | Supabase | Managed |
| Payments | Stripe | Managed |
