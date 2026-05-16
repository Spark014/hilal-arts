# HILAL Arts — Implementation Roadmap

## Phase 0: Foundation (Week 1)

### 0.1 Supabase Project Setup
- [ ] Create Supabase project (free tier)
- [ ] Configure auth providers (email/password, Google OAuth optional)
- [ ] Set up Storage buckets: `product-images`, `commission-references`
- [ ] Configure RLS policies on all tables
- [ ] Add environment variables to Vercel + local `.env.local`

### 0.2 Database Schema
- [ ] Run migration SQL (from `data-model.md`)
- [ ] Create helper functions (`is_admin`, `get_or_create_cart`)
- [ ] Create auth trigger for auto profile creation
- [ ] Seed collections + products from current `lib/data.js`
- [ ] Seed product images, features, customizations

### 0.3 Stripe Setup
- [ ] Create Stripe account
- [ ] Configure webhook endpoint in Dashboard
- [ ] Copy test keys to environment variables
- [ ] Test webhook locally with Stripe CLI

### 0.4 Project Structure
- [ ] Create `lib/supabase-client.js` (client-side)
- [ ] Create `lib/supabase-server.js` (server-side / Server Actions)
- [ ] Create `lib/stripe-client.js`
- [ ] Create `lib/stripe-server.js`

---

## Phase 1: Product Catalog Migration (Week 1–2)

### 1.1 Backend
- [ ] Seed all 13 products into Supabase
- [ ] Write `scripts/seed-database.js` for reproducible seeding
- [ ] Verify RLS policies allow public read on products/collections

### 1.2 Frontend — Collections Page
- [ ] Replace `lib/data.js` imports with Supabase fetch
- [ ] `/collections` — fetch from `products` + `collections` tables
- [ ] `/collections/[slug]` — filter by collection_id
- [ ] Add loading states / skeleton UI
- [ ] Add ISR: `revalidate: 3600` on collection pages

### 1.3 Frontend — Product Detail Page
- [ ] `/product/[slug]` — fetch product + images + features + customizations
- [ ] Migrate gallery to use `product_images` table
- [ ] Add ISR: `revalidate: 3600`

### 1.4 Deprecation
- [ ] Keep `lib/data.js` as backup seed reference (commented out or renamed)
- [ ] Remove all active imports of `lib/data.js` from pages

---

## Phase 2: Cart System (Week 2)

### 2.1 Server-Side Cart (Authenticated)
- [ ] Create `app/actions/cart.js` Server Actions
  - `addToCart(productId, quantity, customization)`
  - `removeFromCart(cartItemId)`
  - `updateQuantity(cartItemId, quantity)`
  - `getCart()`
  - `clearCart()`
- [ ] Cart uses `carts` + `cart_items` tables with RLS

### 2.2 Client-Side Cart (Anonymous)
- [ ] Keep `localStorage` cart for anonymous users
- [ ] On login: migrate localStorage cart to server cart
- [ ] On logout: clear localStorage, server cart remains for next login

### 2.3 CartDrawer Integration
- [ ] Update `CartDrawer.js` to use new cart system
- [ ] Fetch cart server-side in `layout.js` if user authenticated
- [ ] Merge server cart with localStorage on client mount
- [ ] Real-time updates (optional): subscribe to cart_items changes

### 2.4 Cart Persistence
- [ ] Cart survives page refresh for authenticated users
- [ ] Cart survives login/logout cycle (anonymous → authenticated migration)

---

## Phase 3: Stripe Checkout (Week 2–3)

### 3.1 Checkout Flow
- [ ] Create `app/actions/checkout.js` Server Action
  - Validate cart contents (check stock)
  - Calculate totals
  - Create `orders` record (status: `pending`)
  - Call Supabase Edge Function to create Stripe session
- [ ] Create Supabase Edge Function: `stripe-checkout`
  - Create Stripe Checkout session with dynamic line items
  - Include shipping address collection
  - Set metadata: order_id, user_id
  - Return session URL
- [ ] Update CartDrawer "Checkout" button to trigger checkout action

### 3.2 Webhook Handler
- [ ] Create `app/api/webhook/stripe/route.js` (or Edge Function)
  - Verify Stripe signature
  - Handle `checkout.session.completed`
    - Update order status to `paid`
    - Create `order_items` records
    - Clear user cart
    - Add `order_status_history` entry
  - Handle `checkout.session.async_payment_failed`
    - Update order status to `cancelled`
    - Restore inventory
  - Handle `checkout.session.expired`
    - Update order status to `cancelled`
    - Restore inventory
  - Return 200 OK to Stripe

### 3.3 Order Confirmation
- [ ] Create `/order/success?session_id=xxx` page
  - Retrieve session from Stripe (verify)
  - Fetch order from Supabase
  - Display order details, shipping info
  - Show thank you message with Arabic
- [ ] Create `/order/cancel` page
  - Friendly message: "Your payment was cancelled. Your cart is saved."
  - Link back to cart

### 3.4 Inventory Management
- [ ] `stock_quantity` on products
- [ ] Check stock before checkout
- [ ] Decrement stock on successful payment (webhook)
- [ ] Restore stock on cancellation / expiry
- [ ] Handle out-of-stock: disable "Add to Cart", show "Sold Out" badge

---

## Phase 4: User Accounts (Week 3)

### 4.1 Authentication
- [ ] Create `/auth/login` page
  - Email/password form
  - Link to sign-up
- [ ] Create `/auth/signup` page
  - Email, password, name
  - Auto-create profile via trigger
- [ ] Create `/auth/forgot-password` page
  - Magic link / password reset
- [ ] Update `Header.js`
  - Show "Account" dropdown when logged in
  - Show "Login / Register" when logged out
  - Replace decorative Account button with real auth

### 4.2 Profile
- [ ] Create `/account` page
  - Edit profile (name, phone, address)
  - View order history
- [ ] Create `/account/orders` page
  - List past orders with status
  - Click to view order details

### 4.3 Auth Guards
- [ ] Middleware: redirect unauthenticated users from `/account/*` to `/auth/login`
- [ ] Return URL: after login, redirect back to intended page

---

## Phase 5: Commissions (Week 3–4)

### 5.1 Backend
- [ ] Commissions table already exists in schema
- [ ] Create Supabase Edge Function: `commission-notification`
  - Send email to admin on new commission inquiry
  - (Use a transactional email service: Resend, SendGrid, or Supabase built-in)

### 5.2 Frontend
- [ ] Update `/commissions` form
  - Add file upload for reference images → Supabase Storage
  - Add fields: budget_range, script_preference, color_preference
  - Save to `commissions` table on submit (no auth required)
  - Show success confirmation (replace fake setTimeout)

### 5.3 Admin (Future / Optional)
- [ ] Simple admin dashboard at `/admin/commissions`
  - Table of commission inquiries
  - Status management (new → contacted → quoted → etc.)
  - Protected by `is_admin` RLS policy

---

## Phase 6: Polish & Launch (Week 4)

### 6.1 Search
- [ ] Implement product search
  - Search by name, arabic_name, script, calligrapher
  - Use Supabase full-text search or simple ILIKE
  - Update Header search button to real functionality

### 6.2 SEO
- [ ] Add metadata to all pages (title, description, Open Graph)
- [ ] Product pages: structured data (JSON-LD for Product)
- [ ] Generate sitemap.xml
- [ ] Add robots.txt

### 6.3 Performance
- [ ] Image optimization: Next.js `<Image>` with Supabase Storage CDN
- [ ] ISR on product/collection pages
- [ ] Lazy load below-fold images
- [ ] Preconnect to Supabase + Stripe domains

### 6.4 Testing
- [ ] Test complete purchase flow (Stripe test mode)
- [ ] Test cart persistence (anonymous → login → checkout)
- [ ] Test webhook handling (Stripe CLI)
- [ ] Test mobile responsive (already mostly done, verify)
- [ ] Test commission form submission

### 6.5 Monitoring
- [ ] Add Stripe payment analytics
- [ ] Add Vercel Analytics (free)
- [ ] Set up Stripe webhook logs monitoring

### 6.6 Documentation
- [ ] Update `README.md` with new setup instructions
- [ ] Document environment variables
- [ ] Document admin commands (seed, migrate)

---

## Post-Launch (Future)

| Feature | Priority | Notes |
|---|---|---|
| Email confirmations | High | Order confirmation, shipping notification |
| Admin dashboard | High | Manage products, orders, commissions |
| Inventory management | Medium | Low stock alerts, auto-hide sold out |
| Product reviews | Low | Social proof for boutique feel |
| Wishlist | Low | Save favorites |
| Analytics dashboard | Low | Sales reports, popular products |
| Multi-currency | Low | AED, GBP for international customers |
| Commission deposit payments | Medium | Stripe Invoices for bespoke quotes |

---

## File Checklist

### New Files
- [ ] `lib/supabase-client.js`
- [ ] `lib/supabase-server.js`
- [ ] `lib/stripe-client.js`
- [ ] `lib/stripe-server.js`
- [ ] `app/actions/cart.js`
- [ ] `app/actions/checkout.js`
- [ ] `app/api/stripe/checkout/route.js`
- [ ] `app/api/webhook/stripe/route.js`
- [ ] `app/auth/login/page.js`
- [ ] `app/auth/signup/page.js`
- [ ] `app/auth/forgot-password/page.js`
- [ ] `app/account/page.js`
- [ ] `app/account/orders/page.js`
- [ ] `app/order/success/page.js`
- [ ] `app/order/cancel/page.js`
- [ ] `app/admin/commissions/page.js` (future)
- [ ] `scripts/seed-database.js`
- [ ] `middleware.js`
- [ ] `app/sitemap.js`
- [ ] `app/robots.js`

### Modified Files
- [ ] `lib/data.js` → deprecate or rename to seed reference
- [ ] `lib/CartContext.js` → integrate with server cart
- [ ] `components/Header.js` → add real auth UI
- [ ] `components/CartDrawer.js` → wire to new cart system
- [ ] `app/layout.js` → add auth provider, fetch server cart
- [ ] `app/collections/page.js` → fetch from Supabase
- [ ] `app/collections/[slug]/page.js` → fetch from Supabase
- [ ] `app/product/[slug]/page.js` → fetch from Supabase
- [ ] `app/commissions/page.js` → real form submission

---

## Estimated Timeline

| Phase | Duration | Cumulative |
|---|---|---|
| Foundation (Supabase + Stripe setup) | 2–3 days | Days 1–3 |
| Product Catalog Migration | 2–3 days | Days 4–6 |
| Cart System | 2–3 days | Days 7–9 |
| Stripe Checkout | 3–4 days | Days 10–13 |
| User Accounts | 2–3 days | Days 14–16 |
| Commissions | 1–2 days | Days 17–18 |
| Polish & Launch | 2–3 days | Days 19–21 |

**Total: ~3 weeks** for a solid MVP with real payments, user accounts, and database-backed catalog.

With two agents (Kimi + Claude) working in parallel, we can compress this:
- **Kimi**: Implement catalog migration, cart system, checkout wiring, auth pages
- **Claude**: Review architecture, security audit, Stripe integration patterns, edge case handling
- **Me (OpenClaw)**: Coordinate, merge, test, deploy
