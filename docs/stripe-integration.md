# HILAL Arts — Stripe Integration Plan

## Overview

Stripe handles all payment processing. The flow uses **Stripe Checkout** (hosted payment page) rather than building a custom checkout form. This is faster to implement, PCI-compliant by default, and supports Apple Pay / Google Pay out of the box.

---

## Payment Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│  User   │────▶│  CartDrawer │────▶│  "Checkout" btn │────▶│ Next.js     │
│         │     │  (frontend) │     │                 │     │ Server Action│
└─────────┘     └─────────────┘     └─────────────────┘     └──────┬──────┘
                                                                   │
                     ┌─────────────────────────────────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  validate cart  │  ← Check stock, calculate totals
            │  create order   │  ← Insert into orders (status: pending)
            │  lock inventory │  ← Decrement stock (or reserve)
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Supabase Edge  │
            │  Function:      │
            │  createStripeCheckout()
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Stripe API      │
            │ POST /v1/checkout/sessions
            └────────┬────────┘
                     │
                     ▼ session.url
            ┌─────────────────┐
            │  Redirect User  │────▶ Stripe Hosted Checkout Page
            └─────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌────────┐   ┌────────┐   ┌────────┐
   │ Success│   │ Cancel │   │ Error  │
   │        │   │        │   │        │
   │ Return │   │ Return │   │ Return │
   │ to     │   │ to     │   │ to     │
   │ /order/│   │ /cart  │   │ /cart  │
   │ success│   │        │   │        │
   │?session│   │        │   │        │
   │_id=xxx │   │        │   │        │
   └────┬───┘   └────────┘   └────────┘
        │
        │ (Stripe webhook fires asynchronously)
        │
        ▼
┌─────────────────┐
│ Stripe Webhook  │  ← POST to /api/webhook/stripe
│ checkout.       │
│ session.        │
│ completed       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Supabase Edge   │
│ Function:       │
│ handleWebhook() │
└────────┬────────┘
         │
         ├──▶ Verify signature (prevent spoofing)
         ├──▶ Retrieve session + line items from Stripe
         ├──▶ Update order: status = 'paid'
         ├──▶ Create order_items from line items
         ├──▶ Clear user's cart
         ├──▶ (Future) Send order confirmation email
         └──▶ Return 200 OK to Stripe
```

---

## Stripe Configuration

### Required Products in Stripe Dashboard

For each product in your catalog, create a corresponding **Stripe Product + Price**:

| HILAL Product | Stripe Product ID | Stripe Price ID | Amount |
|---|---|---|---|
| Ayat al-Kursi — Teal | `prod_xxx1` | `price_xxx1` | $350.00 |
| 99 Names — Burgundy Diamond | `prod_xxx2` | `price_xxx2` | $400.00 |
| ... | ... | ... | ... |

**Important:** Store `stripe_price_id` in the `products` table. This links your database to Stripe.

```sql
ALTER TABLE products ADD COLUMN stripe_price_id TEXT;
ALTER TABLE products ADD COLUMN stripe_product_id TEXT;
```

Alternatively, use **dynamic line items** (create price on the fly) — simpler for small catalogs, but Stripe Product catalog is cleaner for reporting.

### Recommended: Dynamic Price Creation

Instead of pre-creating every product in Stripe, create prices dynamically at checkout time:

```javascript
// In Edge Function
const session = await stripe.checkout.sessions.create({
  line_items: cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product_name,
        description: `${item.script} script · ${item.dimensions}`,
        images: [item.product_image],  // Stripe shows this on checkout
      },
      unit_amount: item.price,  // in cents
    },
    quantity: item.quantity,
  })),
  mode: 'payment',
  success_url: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${appUrl}/cart`,
  customer_email: userEmail,
  metadata: {
    order_id: orderId,
    user_id: userId,
  },
  shipping_address_collection: {
    allowed_countries: ['US', 'CA', 'GB', 'AU', 'FR', 'DE', 'AE', 'SA'],
  },
  automatic_tax: { enabled: true },  // If you register for Stripe Tax
});
```

**Pros:** No need to sync product catalog to Stripe. One source of truth (your DB).
**Cons:** Less visibility in Stripe Dashboard. Slightly slower checkout (price created on the fly).

For a 13-product boutique, dynamic is perfectly fine.

---

## Webhook Handling

### Events to Listen For

| Event | Action |
|---|---|
| `checkout.session.completed` | Payment succeeded — fulfill order |
| `checkout.session.async_payment_failed` | Payment failed (e.g., bank transfer) — cancel order, restore inventory |
| `checkout.session.expired` | Session expired (30 min) — cancel order, restore inventory |
| `charge.refunded` | Refund issued — update order status |

### Webhook Endpoint

```
POST https://hilalarts.vercel.app/api/webhook/stripe
```

**Security:**
```javascript
const signature = request.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(
  payload,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

**Idempotency:**
```sql
-- Prevent duplicate order processing
CREATE UNIQUE INDEX idx_orders_stripe_session ON orders(stripe_session_id);
```

In the webhook handler, check if order already has `status = 'paid'` before processing. If yes, return 200 immediately (idempotent).

---

## Shipping

### Current State

The site mentions "Complimentary white-glove delivery" and "Worldwide shipping" in the header. This suggests **free shipping** is part of the brand promise.

### Stripe Checkout Configuration

```javascript
// Free shipping
shipping_options: [
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: { amount: 0, currency: 'usd' },
      display_name: 'Complimentary White-Glove Delivery',
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 5 },
        maximum: { unit: 'business_day', value: 14 },
      },
    },
  },
],
```

If you later want to charge for international shipping, add a second option:
```javascript
{
  shipping_rate_data: {
    type: 'fixed_amount',
    fixed_amount: { amount: 2500, currency: 'usd' },  // $25.00
    display_name: 'International Shipping',
    // ...
  },
}
```

---

## Tax

### Option 1: Stripe Tax (Recommended)

Stripe Tax automatically calculates sales tax based on shipping address.

```javascript
automatic_tax: { enabled: true },
```

**Requirements:**
- Register for Stripe Tax in Dashboard
- Provide tax category for products (e.g., "Artwork")
- Stripe handles VAT/GST for international orders

**Cost:** 0.5% of transaction ( Stripe Tax fee) + standard Stripe processing fee (2.9% + 30¢ for US cards)

### Option 2: Manual (Skip for Now)

For a boutique with low volume, you can calculate tax manually or absorb it into the price. But Stripe Tax is worth it for peace of mind.

---

## Order Confirmation Page

### `/order/success?session_id=cs_xxx`

```javascript
// page.js
export default async function OrderSuccessPage({ searchParams }) {
  const { session_id } = searchParams;
  
  // Verify session with Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id);
  
  // Fetch order from Supabase
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('stripe_session_id', session_id)
    .single();
  
  return (
    <div>
      <h1>Thank You — شكراً لك</h1>
      <p>Order #{order.id.slice(0, 8)}</p>
      <OrderDetails order={order} />
      <p>You will receive a confirmation email shortly.</p>
    </div>
  );
}
```

**Note:** Use `searchParams` (not `params`) because `session_id` is a query parameter.

---

## Failed Payment Recovery

### Cart Persistence on Cancel

If user cancels at Stripe, return them to `/cart` with cart intact:
- Server-side cart (authenticated users): persists automatically
- localStorage cart (anonymous users): persists until they clear it or complete purchase

### Abandoned Checkout Emails (Future)

Stripe can send abandoned checkout recovery emails (built-in feature in Dashboard). Or build custom: listen for `checkout.session.expired`, email user with cart recovery link.

---

## Commission Deposits (Future Enhancement)

For bespoke commissions (quoted individually), you may want to accept deposits via Stripe:

1. Admin creates a commission quote in a dashboard
2. Generates a Stripe Payment Link or Invoice for the deposit amount
3. Customer pays via link
4. Webhook updates commission status to `deposit_paid`

Out of scope for MVP, but Stripe Invoices + Payment Links handle this elegantly.

---

## Testing

### Stripe Test Mode

Always use test keys (`sk_test_`, `pk_test_`) during development.

### Test Cards

| Card Number | Scenario |
|---|---|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 3220` | 3D Secure required |

### Webhook Testing Locally

Use Stripe CLI:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

This tunnels Stripe webhooks to your local dev server.

---

## Cost Breakdown

| Fee | Rate | Example ($350 order) |
|---|---|---|
| Stripe processing (US card) | 2.9% + $0.30 | $10.45 |
| Stripe Tax (if enabled) | 0.5% | $1.75 |
| **Total fees** | **~3.4% + $0.30** | **~$12.20** |
| **Net to HILAL** | | **~$337.80** |

For a boutique with $350 average order value, this is reasonable. No monthly Stripe fees — purely transaction-based.

---

## Files to Create

| File | Purpose |
|---|---|
| `lib/stripe-client.js` | Stripe client initialization (publishable key) |
| `lib/stripe-server.js` | Stripe server initialization (secret key) |
| `app/api/stripe/checkout/route.js` | Create checkout session |
| `app/api/webhook/stripe/route.js` | Handle Stripe webhooks |
| `app/order/success/page.js` | Order confirmation page |
| `app/order/cancel/page.js` | Payment cancelled page |
| `scripts/sync-products-to-stripe.js` | (Optional) Sync product catalog to Stripe |
