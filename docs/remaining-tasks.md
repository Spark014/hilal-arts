# HILAL Arts — Remaining Tasks Checklist

## Status: Foundation Complete ✅ | Data Layer Ready | Frontend Still Static

**What works today:** Homepage, collections, product pages, cart drawer (localStorage), commissions form (fake submission), heritage page, error/404 pages.
**Database:** Supabase project created, schema migrated (tables + RLS + functions). **Seed not yet run.**
**Stripe:** Code written but disabled. Will activate in Phase 4.

---

## Phase 1: Seed Database (You — 15 minutes)

### 1.1 Run Seed Script
```bash
cd ~/Development/HilalArts/hilal-arts
node scripts/seed-database.js
```

**Prerequisites:**
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` env vars must be set
- Or prepend: `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-database.js`

### 1.2 Verify in Supabase Dashboard
- Open Supabase → Table Editor
- Confirm `collections` has 4 rows (Quranic Verses, 99 Names, Bridal & Gift, Limited Editions)
- Confirm `products` has 13 rows
- Confirm `product_images`, `product_features`, `product_customizations` have related rows
- Run a test query: `SELECT * FROM products JOIN collections ON products.collection_id = collections.id`

### 1.3 Verify RLS Policies Work
```sql
-- Should return all 13 active products (public read policy)
SELECT count(*) FROM products;

-- Should return 4 collections (public read policy)
SELECT count(*) FROM collections;

-- Should fail (no auth)
SELECT * FROM carts;
SELECT * FROM orders;
```

---

## Phase 2: Migrate Frontend to Supabase (AI / Pair Programming)

### 2.1 Collections Page (`app/collections/page.js`)
**Current:** Imports static `lib/data.js`
**Target:** Fetch from Supabase `products` + `collections` tables

```javascript
// Replace:
import { products, collections } from '@/lib/data';

// With:
import { createClient } from '@/lib/supabase-server';
const supabase = await createClient();
const { data: products } = await supabase.from('products').select('*').eq('is_active', true);
const { data: collections } = await supabase.from('collections').select('*').eq('is_active', true);
```

**Notes:**
- Keep `lib/data.js` as fallback/seed reference. Don't delete.
- Add `revalidate: 3600` (ISR) so product pages cache for 1 hour
- If data fetch fails, gracefully fall back to `lib/data.js`

### 2.2 Collection Filter Page (`app/collections/[slug]/page.js`)
**Current:** Static filtering from `lib/data.js`
**Target:** Fetch from Supabase with `collection_id` join

### 2.3 Product Detail Page (`app/product/[slug]/page.js`)
**Current:** Static product lookup from `lib/data.js`
**Target:** Fetch from Supabase with related images, features, customizations

```sql
-- Query to fetch a product with all relations
SELECT 
  p.*,
  c.name as collection_name,
  c.slug as collection_slug,
  pi.url as image_url,
  pf.text as feature_text,
  pc.label as customization_label
FROM products p
LEFT JOIN collections c ON p.collection_id = c.id
LEFT JOIN product_images pi ON pi.product_id = p.id
LEFT JOIN product_features pf ON pf.product_id = p.id
LEFT JOIN product_customizations pc ON pc.product_id = p.id
WHERE p.slug = 'ayat-al-kursi-teal';
```

**Notes:**
- Use Supabase `select('*, product_images(*), product_features(*), product_customizations(*)')` syntax
- Sort related tables by `sort_order` for consistent display
- Generate params from `generateStaticParams()` using Supabase product slugs (for ISR)

### 2.4 Homepage (`app/page.js`)
**Current:** Static `lib/data.js` for featured products + collections
**Target:** Fetch featured products from Supabase (`is_featured = true`)

### 2.5 Delete or Deprecate `lib/data.js`
Once all pages are confirmed pulling from Supabase:
- Rename `lib/data.js` → `lib/data.js.bak` or move to `scripts/seed-data.js`
- Remove all imports from `lib/data.js` from pages
- Keep as emergency fallback if Supabase is unreachable

---

## Phase 3: Server-Side Cart (AI / Pair Programming)

### 3.1 Auth Pages (Required Before Server Cart Works)
**New files needed:**
- `app/auth/login/page.js` — Email/password login
- `app/auth/signup/page.js` — Email/password registration
- `app/auth/forgot-password/page.js` — Password reset / magic link

**Implementation:**
- Use Supabase Auth `signInWithPassword`, `signUp`, `resetPasswordForEmail`
- Style to match site (burgundy/gold, Cormorant Garamond + Cinzel)
- Include "Return to [page]" link using `returnUrl` query param
- Auto-create profile via database trigger (already in migration)

### 3.2 Update `Header.js`
**Current:** Decorative Account button, no auth state
**Target:** 
- Show "Account" dropdown when logged in (link to `/account`)
- Show "Login / Register" when logged out
- Show user's name from `profiles` table

### 3.3 Update `CartDrawer.js`
**Current:** Pure localStorage cart
**Target:** Hybrid approach

```
Anonymous user:
  → localStorage cart (works as-is)
  
Logged-in user:
  → Server cart (Supabase `carts` + `cart_items` tables)
  → On login: migrate localStorage cart → server cart
  → On logout: keep server cart for next login
  → Real-time: optional Supabase subscription to cart_items changes
```

**Implementation notes:**
- Keep `CartContext.js` for anonymous users
- Add server action calls (`addToCart`, `removeFromCart`, etc.) when user is authenticated
- Merge localStorage + server cart on login
- Cart badge count: read from server if authenticated, localStorage if anonymous

### 3.4 Account Page (`app/account/page.js`)
**New file:** Show user's profile, allow editing name/phone/address

### 3.5 Order History (`app/account/orders/page.js`)
**New file:** List past orders with status badges (pending, paid, processing, shipped)
- Fetch from `orders` + `order_items` tables (RLS ensures only own orders)

---

## Phase 4: Commissions (Real Submission)

### 4.1 Update Commissions Form (`app/commissions/page.js`)
**Current:** Fake `setTimeout` success message
**Target:** Real Supabase insert via `app/actions/commission.js`

```javascript
// In the form's handleSubmit:
const formData = new FormData();
formData.append('name', name);
formData.append('email', email);
// ... etc

const result = await submitCommission(formData);
if (result.success) {
  showRealSuccessMessage();
} else {
  showError(result.error);
}
```

**Also add:**
- File upload field for reference images → Supabase Storage `commission-references` bucket
- Validation feedback (red borders on invalid fields)
- Success state shows a real confirmation with reference number (commission ID)

### 4.2 Admin Notification (Future)
**Edge Function:** `commission-notification`
- Send email to admin when new commission submitted
- Use Resend, SendGrid, or Supabase built-in email

---

## Phase 5: Search & Discovery

### 5.1 Header Search
**Current:** Decorative Search button
**Target:** Real product search

**Options:**
- **Simple:** Supabase `ilike` on `name`, `arabic_name`, `script`, `calligrapher`
- **Better:** Supabase full-text search using PostgreSQL `tsvector` (needs migration)
- **Best:** Add `searchable_text` column with combined name + description + script + calligrapher, index it

**UI:** Expandable search bar in header, results dropdown, enter key → search results page

### 5.2 Product Filtering (Collections Page)
Add sidebar filters:
- Price range slider
- Script type (Thuluth, Diwani, Nastaliq, etc.)
- Canvas size (Small, Medium, Large)
- Collection (already have this)

---

## Phase 6: Admin Dashboard (Future / Optional for MVP)

### 6.1 Commission Management (`/admin/commissions`)
- Table of all commissions (admin bypasses RLS)
- Status management: New → Contacted → Quoted → Accepted → In Progress → Completed
- View reference images
- Add admin notes

### 6.2 Order Management (`/admin/orders`)
- All orders with filters by status
- Update order status (triggers `order_status_history` entry)
- Add tracking number
- View customer details

### 6.3 Product Management (`/admin/products`)
- Edit product details, pricing, stock
- Upload/reorder images
- Toggle `is_active`, `is_featured`

**Access control:** `is_admin` flag in `profiles` table. Middleware checks role.

---

## Phase 7: Stripe Integration (Activate When Ready)

### 7.1 Environment Setup
```bash
# Add to .env.local:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 7.2 Stripe Dashboard Setup
- Create Stripe account
- Switch to Test Mode
- Configure webhook endpoint: `https://your-domain.com/api/webhook/stripe`
- Get webhook signing secret
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook/stripe`

### 7.3 Checkout Flow (Already Built — Just Enable)
Files already exist:
- `app/actions/checkout.js` — Creates Stripe checkout session
- `app/api/webhook/stripe/route.js` — Handles payment confirmation
- `app/api/order-status/route.js` — Polling for order status
- `app/order/success/page.js` — Thank you page with polling

**To activate:**
1. Uncomment Stripe env var validation in `lib/env.js`
2. Wire CartDrawer "Checkout" button to call `createCheckoutSession()`
3. Test with Stripe test card: `4242 4242 4242 4242`

### 7.4 Post-Purchase Features
- Order confirmation email to customer
- Order notification email to admin
- Shipping tracking integration (Shippo, EasyPost, or manual)

---

## Phase 8: Polish & Launch

### 8.1 SEO
- Meta titles/descriptions on all pages
- Open Graph tags (for social sharing)
- JSON-LD structured data on product pages
- `sitemap.js` (dynamic, from Supabase products)
- `robots.txt`

### 8.2 Performance
- Next.js `<Image>` with proper sizing on all product images
- Preconnect to Supabase domain
- Lazy load below-fold content
- ISR on product/collection pages (already noted above)

### 8.3 Analytics
- Vercel Analytics (free, one-line install)
- Optional: Google Analytics 4 (privacy-friendly setup)

### 8.4 Legal Pages
- `/privacy` — GDPR/privacy policy
- `/terms` — Terms of service
- `/shipping` — Shipping & delivery info
- `/faq` — Frequently asked questions

---

## Quick Reference: Already Done ✅

| Item | File | Status |
|---|---|---|
| Supabase schema | `supabase/migrations/001_initial_schema.sql` | ✅ Done |
| Browser client | `lib/supabase-client.js` | ✅ Done |
| Server client | `lib/supabase-server.js` | ✅ Done |
| Cart actions | `app/actions/cart.js` | ✅ Done |
| Checkout action | `app/actions/checkout.js` | ✅ Done |
| Commission action | `app/actions/commission.js` | ✅ Done |
| Stripe webhook | `app/api/webhook/stripe/route.js` | ✅ Done |
| Order status API | `app/api/order-status/route.js` | ✅ Done |
| Order success page | `app/order/success/page.js` | ✅ Done |
| Error boundary | `app/error.js` | ✅ Done |
| 404 page | `app/not-found.js` | ✅ Done |
| Middleware | `middleware.js` | ✅ Done |
| Security headers | `next.config.mjs` | ✅ Done |
| Env validation | `lib/env.js` | ✅ Done |
| Seed script | `scripts/seed-database.js` | ✅ Done |
| Architecture docs | `docs/*.md` (6 files) | ✅ Done |
| Tests (written) | `__tests__/*.test.js` | ✅ Done (jest pending) |

---

## Decision Points for You

1. **Auth providers:** Email/password only, or also Google OAuth?
2. **Search:** Simple `ilike` for MVP, or full-text search?
3. **Admin dashboard:** Build now or post-launch?
4. **Product images:** Keep in `/public` (simple) or move to Supabase Storage (flexible)?
5. **Shipping:** Free worldwide (current promise) or charge for international?
6. **Currency:** USD only, or multi-currency (AED, GBP for Middle East/UK customers)?
