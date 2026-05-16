# HILAL Arts — Architecture & Security Review

**Reviewer:** Claude Sonnet 4.6  
**Date:** 2026-05-16  
**Scope:** docs/architecture-overview.md, docs/data-model.md, docs/stripe-integration.md, docs/implementation-roadmap.md, lib/data.js, lib/CartContext.js

---

## Executive Summary

The planned architecture is sound at a high level: Next.js App Router + Supabase + Stripe Checkout is the right stack for a boutique e-commerce site. The documentation is thoughtful. However, there are **critical security vulnerabilities** in the RLS policies, **race conditions** in the Stripe checkout flow that will cause real-money bugs in production, and **large swaths of required production infrastructure** (error handling, rate limiting, logging) that are not mentioned anywhere. This document enumerates every issue found, rated by severity, with specific file and line references.

---

## 1. Security Vulnerabilities

### 1.1 `SECURITY DEFINER` Functions Without `search_path` (CRITICAL)

**Files:** `docs/data-model.md` lines 234–241, 499–522

Both `handle_new_user()` and `is_admin()` are defined with `SECURITY DEFINER` but without `SET search_path = public, pg_temp`. This is a well-documented PostgreSQL privilege escalation vector. A database user with CREATE SCHEMA privilege can create a schema named (e.g.) `pg_catalog` and put a shadow function there that the SECURITY DEFINER function will resolve first.

**Fix:**

```sql
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = user_uuid AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
```

Apply the same `SET search_path` to `handle_new_user()` and `get_or_create_cart()`.

---

### 1.2 `get_or_create_cart` Has No Caller Ownership Check (CRITICAL)

**File:** `docs/data-model.md` lines 509–522

`get_or_create_cart(user_uuid UUID)` is `SECURITY DEFINER` and accepts any UUID. Any authenticated user can call `SELECT get_or_create_cart('<victim_uuid>')` and it will create or return the victim's cart ID, which can then be used to read the victim's cart contents (since the cart RLS policy checks `auth.uid() = user_id` — but cart_items RLS checks `EXISTS (SELECT 1 FROM carts WHERE id = cart_items.cart_id AND carts.user_id = auth.uid())`).

Actually the RLS on cart_items checks the calling user's uid — so a second user can't *read* the items. But they can *create* a cart for any user, which is needless exposure.

**Fix:** Add a caller check inside the function:

```sql
IF user_uuid != auth.uid() THEN
  RAISE EXCEPTION 'Access denied';
END IF;
```

---

### 1.3 Privilege Escalation via `profiles.is_admin` UPDATE (CRITICAL)

**File:** `docs/data-model.md` lines 220–246

No RLS `UPDATE` policy is defined for `profiles`. The architecture overview states `"UPDATE" = own` in a table (line 200), but no SQL for this policy exists anywhere in the docs. Without an explicit UPDATE policy, Supabase's RLS behavior on UPDATE is to deny by default — **but only if RLS is enabled on the table**. The data model does not include `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY`.

If RLS is not enabled on `profiles`, every authenticated user can `UPDATE profiles SET is_admin = true WHERE user_id = auth.uid()` and self-promote to admin. Even if RLS is enabled with no UPDATE policy, this needs to be explicit and auditable.

**Fix:** Add these two statements:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can update own profile (non-admin fields)"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND is_admin = (SELECT is_admin FROM profiles WHERE user_id = auth.uid()));
```

The `WITH CHECK` ensures `is_admin` cannot be changed to `true` via a user UPDATE.

---

### 1.4 Commission SELECT Policy Is an Information Disclosure Bug (HIGH)

**File:** `docs/data-model.md` lines 479–490

```sql
CREATE POLICY "Submitters can view own commissions by email"
  ON commissions FOR SELECT
  USING (
    auth.uid() = user_id OR
    email = auth.email()
  );
```

`auth.email()` returns the email of the currently authenticated Supabase user. Any attacker who knows a victim's email address can:

1. Register a Supabase account using that email.
2. Query the `commissions` table.
3. Read the victim's commission history including their phone number, budget, desired verses, and personal messages.

This is a PII leak.

**Fix:** Remove the `email = auth.email()` branch. If unauthenticated commission tracking is needed, use a token-in-email approach (UUID claim in a signed email link), not email address matching.

```sql
CREATE POLICY "Submitters can view own commissions"
  ON commissions FOR SELECT
  USING (auth.uid() = user_id);
```

---

### 1.5 Commission INSERT Has No Spam or Injection Defense (HIGH)

**File:** `docs/data-model.md` lines 473–477

```sql
CREATE POLICY "Anyone can submit commissions"
  ON commissions FOR INSERT WITH CHECK (true);
```

This policy combined with no field length constraints means:

- A bot can insert millions of rows, exhausting Supabase's free-tier row limits.
- The `message`, `desired_verse`, and other TEXT fields have no `CHECK` constraints for length, so a single request could insert megabytes of data.
- The `reference_images TEXT[]` column accepts any URL strings — if the backend ever fetches these URLs (for previews, email attachments, etc.), this becomes an SSRF vector.

**Fix:**

```sql
-- Add length constraints
ALTER TABLE commissions
  ADD CONSTRAINT commissions_name_length CHECK (char_length(name) <= 200),
  ADD CONSTRAINT commissions_email_format CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  ADD CONSTRAINT commissions_message_length CHECK (char_length(message) <= 5000);
```

Additionally, rate-limiting at the API layer is required (see Section 4.3).

---

### 1.6 `CartContext.js` Deserializes localStorage Without Schema Validation (HIGH)

**File:** `lib/CartContext.js` lines 19–25

```javascript
const savedCart = localStorage.getItem('hilal-cart');
if (savedCart) {
  try {
    setItems(JSON.parse(savedCart));
  } catch (e) {
    console.error('Failed to parse cart data');
  }
}
```

`JSON.parse` succeeds for any valid JSON. A browser extension, XSS on a third-party domain with lax CORS, or a malicious script could write to `localStorage['hilal-cart']` with forged data including an arbitrary `price` field. When this cart is sent to the checkout Server Action, if the server does not re-fetch prices from the database, a user could pay $0.01 for a $400 piece.

The architecture doc claims server-side price validation (line 208), but no validation code exists yet. This is the highest-impact missing piece before taking live payments.

**Fix — two required changes:**

1. Validate the deserialized structure against a known schema before calling `setItems`:

```javascript
const isValidCartItem = (item) =>
  typeof item.id === 'string' &&
  typeof item.quantity === 'number' &&
  item.quantity > 0 &&
  Number.isInteger(item.quantity);

const parsed = JSON.parse(savedCart);
if (Array.isArray(parsed) && parsed.every(isValidCartItem)) {
  setItems(parsed);
}
```

2. In the checkout Server Action (`app/actions/checkout.js` — not yet created), re-fetch prices from the database before passing to Stripe:

```javascript
// NEVER use item.price from the cart — always fetch from DB
const dbProducts = await supabase
  .from('products')
  .select('id, price, stock_quantity')
  .in('id', cartItems.map(i => i.id));
```

---

### 1.7 `order_items` and `order_status_history` Have No RLS Policies (MEDIUM)

**File:** `docs/data-model.md` — absent

The `orders` table has a SELECT policy. The `order_items` table references `orders` but no RLS policy is defined for it. Likewise `order_status_history` has no policy. If RLS is enabled on these tables with no policy, all access is denied (breaking the order detail page). If RLS is not enabled, all rows are readable by any authenticated user.

**Fix:**

```sql
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order history"
  ON order_status_history FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid()
  ));
```

---

### 1.8 `profiles` Table Is Public-Readable — Including `is_admin` Flag (MEDIUM)

**File:** `docs/architecture-overview.md` line 200

> `profiles`: `SELECT` = true (limited fields)

There is no SQL for a column-level SELECT policy anywhere in the docs. PostgreSQL RLS operates at the row level, not column level. A policy `FOR SELECT USING (true)` exposes every column including `is_admin`, `phone`, `address`, and `city` to any anonymous visitor who queries the table.

**Fix:** Either restrict the SELECT policy to authenticated users and own rows, or use a database view that exposes only `user_id` and `full_name`:

```sql
CREATE POLICY "Profiles are viewable by owner"
  ON profiles FOR SELECT USING (auth.uid() = user_id);

-- Or expose a public-safe view
CREATE VIEW public_profiles AS
  SELECT user_id, full_name FROM profiles;
```

---

### 1.9 No Security Headers Configured (MEDIUM)

**File:** `docs/architecture-overview.md`, `docs/implementation-roadmap.md` — absent

No `next.config.js` security headers are mentioned: no `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, or `Referrer-Policy`. Without CSP, any XSS in a third-party script (e.g., Stripe.js if misconfigured) can read localStorage and steal the cart.

**Fix:** Add to `next.config.js`:

```javascript
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' https://js.stripe.com",
      "frame-src https://js.stripe.com",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com",
      "img-src 'self' data: https://*.supabase.co",
    ].join('; ')
  },
];
```

---

## 2. Performance Issues and Missing Indexes

### 2.1 Missing Composite Index for Order History (HIGH)

**File:** `docs/data-model.md` line 334

The schema defines:

```sql
CREATE INDEX idx_orders_user ON orders(user_id);
```

Order history pages fetch orders for a user sorted by date descending. As order volume grows, PostgreSQL will use this index for the `user_id` filter but then perform an expensive in-memory sort on `created_at`. Add a composite index:

```sql
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);
```

---

### 2.2 `product_images` Index Doesn't Cover Sort (MEDIUM)

**File:** `docs/data-model.md` line 172

```sql
CREATE INDEX idx_product_images_product ON product_images(product_id);
```

Images are fetched ordered by `sort_order`. The single-column index on `product_id` requires a secondary sort step. Use a covering composite index:

```sql
CREATE INDEX idx_product_images_product_sort ON product_images(product_id, sort_order);
```

Same issue applies to `product_features` and `product_customizations`.

---

### 2.3 Missing Index for Commission Admin Queries (MEDIUM)

**File:** `docs/data-model.md` line 425

The schema indexes `commissions.status` and `commissions.email` but not `commissions.user_id`. The admin dashboard will fetch commissions ordered by `created_at DESC` — there's no index supporting that sort. Add:

```sql
CREATE INDEX idx_commissions_user ON commissions(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_commissions_created ON commissions(created_at DESC);
```

---

### 2.4 `order_status_history` Sort Not Indexed (MEDIUM)

**File:** `docs/data-model.md` line 374

```sql
CREATE INDEX idx_status_history_order ON order_status_history(order_id);
```

History is always displayed in chronological order. Without `(order_id, created_at)`, each history fetch requires an unindexed sort.

```sql
CREATE INDEX idx_status_history_order_date ON order_status_history(order_id, created_at);
```

---

### 2.5 No Full-Text Search Index Despite Planned Search Feature (MEDIUM)

**File:** `docs/implementation-roadmap.md` lines 196–199

Phase 6.1 plans full-text search on `name`, `arabic_name`, `script`, `calligrapher`. `ILIKE '%query%'` without a GIN index forces a full table scan on every keystroke. Define a `tsvector` generated column and index now:

```sql
ALTER TABLE products ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(calligrapher, '') || ' ' || coalesce(script, ''))
  ) STORED;

CREATE INDEX idx_products_search ON products USING GIN(search_vector);
```

Arabic text (`arabic_name`) needs a separate `simple` dictionary config since no Arabic stemmer is standard in Postgres.

---

### 2.6 Denormalized `collection_label` Will Silently Drift (LOW)

**File:** `docs/data-model.md` line 152

> `collection_label TEXT -- Denormalized for quick display`

If the collections table is updated (e.g., "Bridal & Gift" → "Gifts & Occasions"), all 13+ products retain stale labels. There's no trigger or application code to sync this. Given the small product count, the join cost is negligible. Remove the denormalized column and join instead, or add a trigger:

```sql
CREATE OR REPLACE FUNCTION sync_collection_label()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET collection_label = NEW.name
  WHERE collection_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_collection_updated
  AFTER UPDATE OF name ON collections
  FOR EACH ROW EXECUTE FUNCTION sync_collection_label();
```

---

### 2.7 No Canvas Size or Price Range Index (LOW)

The planned filtering UI (collections sidebar) will filter by `canvas_size` and potentially price range. No index exists for either. For 13 products this doesn't matter, but it should be added before migrating to a live DB with product count growth:

```sql
CREATE INDEX idx_products_canvas_size ON products(canvas_size) WHERE is_active = true;
CREATE INDEX idx_products_price ON products(price) WHERE is_active = true;
```

---

## 3. Stripe Integration Edge Cases

### 3.1 Race Condition: Concurrent Checkout Clicks (CRITICAL)

**File:** `docs/stripe-integration.md` lines 22–32, `docs/architecture-overview.md` lines 163–174

The checkout flow is:

1. Validate cart + check stock
2. Create `orders` record with status `pending`
3. Create Stripe session

Between steps 1 and 2, there is no lock on the stock. Two simultaneous checkout calls from the same or different users (both targeting a `stock_quantity = 1` item) will both pass the stock check, both create orders, and both get valid Stripe sessions. You'll collect payment twice for one piece.

**Fix:** Use PostgreSQL `SELECT ... FOR UPDATE SKIP LOCKED` during stock check:

```sql
-- In the checkout server action (app/actions/checkout.js)
BEGIN;
SELECT id, stock_quantity FROM products
  WHERE id = $1 AND is_active = true
  FOR UPDATE;

-- If stock_quantity < quantity_needed, ROLLBACK and return error

UPDATE products SET stock_quantity = stock_quantity - $quantity
  WHERE id = $1 AND stock_quantity >= $quantity;

-- If 0 rows affected, ROLLBACK
COMMIT;
```

---

### 3.2 Webhook Idempotency Check Is Not Atomic (CRITICAL)

**File:** `docs/stripe-integration.md` lines 174–182

The plan says:

> In the webhook handler, check if order already has `status = 'paid'` before processing. If yes, return 200 immediately.

This is a read-then-write pattern. Two concurrent webhook deliveries (Stripe retries within milliseconds if it doesn't receive 200) can both read `status = 'pending'` and both proceed to mark the order paid, decrement stock twice, and clear the cart twice.

**Fix:** Use a single atomic UPDATE:

```sql
-- In the webhook handler
UPDATE orders
  SET status = 'paid', updated_at = now()
  WHERE stripe_session_id = $1 AND status = 'pending'
  RETURNING id;
```

If this returns 0 rows, the webhook was already processed — return 200 immediately without further work.

---

### 3.3 Order Success Page Has a Timing Window (HIGH)

**File:** `docs/stripe-integration.md` lines 250–274

The success page (`/order/success?session_id=cs_xxx`) fetches the order from Supabase using `stripe_session_id`. But:

1. User is redirected to success URL immediately after Stripe payment.
2. Stripe sends the `checkout.session.completed` webhook asynchronously — it may arrive seconds later.
3. The success page renders before the webhook has updated the order to `paid` or created `order_items`.

The code in the doc calls `.single()` on the order query, which will throw if no row is found. The page will crash with an unhandled error.

**Fix:** Two strategies:

- **Polling:** Show a loading state on the success page and poll `/api/order-status?session_id=xxx` every 2 seconds until order is `paid` (timeout after 30s with a friendly message).
- **Pre-create order:** Create the `orders` record with `pending` status in the Server Action (before Stripe redirect), link it to the session via metadata. The success page can show the pending order immediately, and the webhook updates it to `paid`.

The roadmap's current flow (order creation in webhook) means the success page has no order to display.

---

### 3.4 `customer_email NOT NULL` Violated on Pre-Webhook Order Creation (HIGH)

**File:** `docs/data-model.md` line 323

```sql
customer_email TEXT NOT NULL,
```

The checkout server action creates the `orders` record before redirecting to Stripe (to get an `order_id` for session metadata). At that point, for anonymous users, the customer email is unknown — Stripe Checkout collects it. This will cause a PostgreSQL NOT NULL violation.

**Fix:** Make `customer_email` nullable, or use a placeholder and update it from webhook data:

```sql
ALTER TABLE orders ALTER COLUMN customer_email DROP NOT NULL;
```

Or require user login before checkout (which the roadmap implies but doesn't enforce).

---

### 3.5 Inventory Never Restored on Session Expiry (HIGH)

**File:** `docs/stripe-integration.md` lines 155–157, `docs/implementation-roadmap.md` lines 110–116

The flow decrements stock at checkout creation. If the session expires (30 minutes of no payment), the `checkout.session.expired` webhook should restore stock. However:

1. Stripe webhook delivery is not guaranteed. If the webhook fails repeatedly, the inventory stays decremented permanently.
2. There's no mentioned dead-letter queue or manual reconciliation job.
3. The `-1` sentinel for unlimited stock works correctly, but stock_quantity > 0 pieces can become permanently "sold" due to webhook failure.

**Fix:**

- Add a `reserved_until` timestamp to `cart_items` or a separate `inventory_reservations` table.
- Run a periodic job (Supabase cron or Vercel cron) to release reservations older than 35 minutes where no paid order exists.

---

### 3.6 `checkout.session.async_payment_failed` Is Not Fired for Card Declines (MEDIUM)

**File:** `docs/stripe-integration.md` lines 152–158

> `checkout.session.async_payment_failed` — Payment failed (e.g., bank transfer)

This event only fires for async payment methods (SEPA, ACH, BECS). For standard card payment failures, the user simply stays on the Stripe Checkout page and retries — the session does not fail, it just never completes. Your webhook handler does not need to handle card declines; you need to handle `checkout.session.expired` instead for abandoned sessions.

Additionally, `payment_intent.payment_failed` should be handled if you later support delayed capture.

---

### 3.7 `session_id` Query Parameter Is Unvalidated on Success Page (MEDIUM)

**File:** `docs/stripe-integration.md` lines 253–261

```javascript
const { session_id } = searchParams;
const session = await stripe.checkout.sessions.retrieve(session_id);
```

There's no format validation on `session_id`. A user can supply any string (e.g., `../../../../etc/passwd`). Stripe's API will reject it, but the error handling is undefined. A Stripe session ID always starts with `cs_test_` or `cs_live_` — validate before calling Stripe:

```javascript
if (!session_id?.match(/^cs_(test|live)_[a-zA-Z0-9]+$/)) {
  redirect('/');
}
```

---

### 3.8 No `charge.dispute.created` Handler (LOW)

**File:** `docs/stripe-integration.md` lines 152–158

The webhook event table omits chargebacks. When a customer disputes a charge, Stripe fires `charge.dispute.created`. Without a handler, you won't be notified in your system — only in the Stripe Dashboard. At minimum, this should send an admin notification email.

---

## 4. Missing Infrastructure

### 4.1 No Error Boundaries or Error Pages (HIGH)

**File:** `docs/architecture-overview.md`, `docs/implementation-roadmap.md` — absent

Next.js App Router requires `error.js` files at each route level for graceful error handling. None are mentioned anywhere in the docs or roadmap. If Supabase is unreachable, the collection page, product page, and order history will all crash with an unformatted Next.js stack trace visible to users.

**Required files to add to roadmap:**
- `app/error.js` — root error boundary
- `app/not-found.js` — 404 page
- `app/collections/error.js`
- `app/product/[slug]/error.js`
- `app/order/success/error.js`

---

### 4.2 No Structured Logging (HIGH)

**File:** All docs — absent

There is zero logging infrastructure mentioned. In production, you need to trace:

- Which Stripe webhook events were received
- Which webhook handler ran for each event
- Whether inventory was decremented/restored
- Which user triggered which checkout

Without this, debugging a failed payment requires manually correlating Stripe Dashboard logs, Supabase logs, and Vercel function logs across three different dashboards.

**Minimum viable logging:**

```javascript
// In the webhook handler
console.log(JSON.stringify({
  event: 'stripe_webhook',
  type: event.type,
  session_id: session.id,
  order_id: orderId,
  timestamp: new Date().toISOString(),
}));
```

Use Vercel's structured log integration or add a lightweight service like Axiom or Logtail.

---

### 4.3 No Rate Limiting Anywhere (HIGH)

**File:** All docs — absent

The following endpoints have no rate limiting:

| Endpoint | Attack surface |
|---|---|
| `POST /api/stripe/checkout` | Checkout spam, inventory exhaustion |
| `POST /api/commissions` (Server Action) | Commission form spam |
| Supabase Auth `/auth/v1/token` | Brute force |
| `GET /api/webhook/stripe` | Webhook replay spam |

Vercel does not add rate limiting by default. The commission form's `INSERT WITH CHECK (true)` policy at the DB level is the last line of defense — and it has no limits.

**Fix options:**
- Vercel WAF (paid) for IP-level rate limiting
- Upstash Redis + middleware for token-bucket limiting on Next.js routes
- At minimum, implement in `middleware.js`:

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // For the webhook: only allow Stripe IP ranges
  if (request.nextUrl.pathname === '/api/webhook/stripe') {
    // Stripe webhook IPs are documented; alternatively,
    // signature verification (already planned) is sufficient
  }
  return NextResponse.next();
}
```

---

### 4.4 `middleware.js` Not in Roadmap Phase 0 (MEDIUM)

**File:** `docs/implementation-roadmap.md` line 260

`middleware.js` is listed under "New Files" at the bottom of the roadmap but not assigned to any phase. Auth guard middleware for `/account/*` routes is a prerequisite for Phase 4 (User Accounts), not a post-Phase-6 afterthought. Without it, unauthenticated users can visit `/account/orders` — the page will crash or show empty state rather than redirecting.

**Fix:** Move `middleware.js` creation to Phase 4.1 and make it a blocker for that phase.

---

### 4.5 No Environment Variable Validation at Startup (MEDIUM)

**File:** `docs/architecture-overview.md` lines 225–237 — absent

If `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, or `STRIPE_WEBHOOK_SECRET` are undefined in the Vercel environment:

- The Stripe client initializes with `undefined` and throws runtime errors on the first API call.
- Webhook signature verification fails silently if the secret is empty string.
- Server Actions that use the service role key will fail with cryptic Supabase errors.

**Fix:** Add a startup validation file:

```javascript
// lib/env.js
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_APP_URL',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

Import this in `app/layout.js` (server component) so it fails fast on deploy.

---

### 4.6 Anonymous Cart Migration Has a Double-Write Bug (MEDIUM)

**File:** `docs/architecture-overview.md` lines 149–160, `lib/CartContext.js`

The plan for anonymous → authenticated cart migration:

> On login: migrate localStorage cart to server cart

`CartContext.js` persists to localStorage on every `items` change. If the merge logic writes localStorage items to the server cart and then clears localStorage, but the `useEffect` on line 29 runs one more time and writes the empty `items` array back to localStorage — this is fine. But if the merge happens out of order (server cart response arrives after the local effect runs), you get a race where the server cart's items are overwritten by the empty localStorage.

The current `CartContext.js` has no server cart integration at all — the whole two-path (anonymous/authenticated) merge logic needs to be designed before implementation. The current code is 100% client-side and will be thrown away.

---

### 4.7 `pending` Orders Have No Timeout or Cleanup (MEDIUM)

**File:** `docs/data-model.md` — absent

An `orders` record is created with `status = 'pending'` when checkout begins. If:

- The user closes the browser tab before completing payment
- Stripe's webhook delivery permanently fails
- A network error occurs after order creation but before Stripe redirect

...the order stays `pending` forever. There's no cron job, no expiry column, no cleanup policy mentioned anywhere.

**Fix:** Add a `expires_at` column and a cleanup job:

```sql
ALTER TABLE orders ADD COLUMN expires_at TIMESTAMPTZ
  GENERATED ALWAYS AS (created_at + INTERVAL '2 hours') STORED;

CREATE INDEX idx_orders_expires ON orders(expires_at) WHERE status = 'pending';
```

Run a Supabase scheduled function every hour:

```sql
UPDATE orders SET status = 'cancelled'
  WHERE status = 'pending' AND expires_at < now();
```

Also restore inventory for those cancelled orders.

---

### 4.8 Commission Reference Image Upload Has No Validation (LOW)

**File:** `docs/implementation-roadmap.md` line 178

> Add file upload for reference images → Supabase Storage

The `reference_images TEXT[]` column stores URLs, and the roadmap mentions a file upload field on the commission form. No mention of:

- **File type validation** — only accept `image/jpeg`, `image/png`, `image/webp`
- **File size limit** — Supabase Storage default is 50MB; set a lower limit (e.g., 5MB per image)
- **Maximum file count** — no limit means a user can upload hundreds of images
- **Virus/malware scanning** — images from unknown users

**Fix:** Configure the Supabase Storage bucket with file size and MIME type restrictions via the Dashboard or storage policies.

---

### 4.9 Order Confirmation Email Not Implemented (LOW)

**File:** `docs/implementation-roadmap.md` line 111 (marked as "(Future)")

Order confirmation email is critical for customer trust, not a nice-to-have. A $350 purchase with no confirmation email will generate support requests and chargebacks. Move this out of "Future" into Phase 3 alongside the webhook handler. The webhook handler is the exact right place to trigger it.

---

## 5. Summary of Critical Changes Required Before Going Live

| Priority | Issue | File | Fix Required |
|---|---|---|---|
| CRITICAL | `is_admin`/`handle_new_user`/`get_or_create_cart` SECURITY DEFINER missing `search_path` | `data-model.md` | Add `SET search_path = public, pg_temp` to all three |
| CRITICAL | `profiles.is_admin` not protected from self-promotion | `data-model.md` | Add `UPDATE` RLS policy with `WITH CHECK` on `is_admin` field |
| CRITICAL | Concurrent checkout race condition depletes inventory incorrectly | `stripe-integration.md` | Use `SELECT ... FOR UPDATE` on stock check |
| CRITICAL | Webhook idempotency check is non-atomic | `stripe-integration.md` | Use `UPDATE ... WHERE status = 'pending' RETURNING id` |
| CRITICAL | `CartContext` doesn't validate localStorage shape; server must re-fetch prices | `lib/CartContext.js` | Validate shape client-side; always re-fetch prices server-side at checkout |
| HIGH | Commission SELECT policy leaks PII via email match | `data-model.md` | Remove `email = auth.email()` branch |
| HIGH | Order success page has timing window before webhook fires | `stripe-integration.md` | Poll for order status or pre-create order record |
| HIGH | `customer_email NOT NULL` violated for anonymous checkout | `data-model.md` | Make nullable or require auth before checkout |
| HIGH | No error boundaries — page crashes visible to users | roadmap | Add `error.js` at all route levels |
| HIGH | No rate limiting on commission form or checkout | all docs | Middleware rate limiting or Vercel WAF |
| HIGH | No structured logging | all docs | Add structured logging to webhook handler and checkout action |
| MEDIUM | Missing RLS on `order_items` and `order_status_history` | `data-model.md` | Add explicit `ENABLE ROW LEVEL SECURITY` + policies |
| MEDIUM | `middleware.js` auth guard not scheduled before Phase 4 | roadmap | Move to Phase 4.1 blocker |
| MEDIUM | No environment variable validation at startup | all docs | Add `lib/env.js` validated at build time |
| MEDIUM | `pending` orders never cleaned up | `data-model.md` | Add `expires_at` + cron cleanup job |
