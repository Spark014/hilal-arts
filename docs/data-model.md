# HILAL Arts — Data Model

## Philosophy

Migrate from the current static `lib/data.js` to a proper relational PostgreSQL schema in Supabase. Products, collections, orders, users, and commissions are all naturally relational — SQL is the right fit.

---

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   collections   │       │    products     │       │  product_images │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ collection_id   │       │ id (PK)         │
│ slug (unique)   │       │ id (PK)         │◄─────│ product_id (FK) │
│ name            │       │ slug (unique)   │       │ url             │
│ arabic_name     │       │ name            │       │ alt_text        │
│ description     │       │ arabic_name     │       │ sort_order      │
│ image           │       │ script          │       └─────────────────┘
│ sort_order      │       │ dimensions      │
└─────────────────┘       │ canvas_size     │       ┌─────────────────┐
                          │ price           │       │   customizations│
┌─────────────────┐       │ customization_fee       ├─────────────────┤
│     users       │       │ processing_time │       │ id (PK)         │
├─────────────────┤       │ description     │◄─────│ product_id (FK) │
│ id (PK)         │       │ calligrapher    │       │ label           │
│ email           │       │ is_featured     │       └─────────────────┘
│ created_at      │       │ is_active       │
└─────────────────┘       │ stock_quantity  │       ┌─────────────────┐
        │                 │ sort_order      │       │    features     │
        │                 │ created_at      │       ├─────────────────┤
        │                 └─────────────────┘       │ id (PK)         │
        │                                           │ product_id (FK) │
        ▼                                           │ text            │
┌─────────────────┐                                 └─────────────────┘
│    profiles     │
├─────────────────┤
│ user_id (PK,FK) │
│ full_name       │
│ phone           │
│ address         │
│ city            │
│ country         │
│ is_admin        │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     carts       │       │   cart_items    │       │    orders       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ cart_id (FK)    │       │ id (PK)         │
│ user_id (FK)    │       │ product_id (FK) │       │ user_id (FK)    │
│ created_at      │       │ quantity        │       │ stripe_session_id│
│ updated_at      │       │ customization   │       │ stripe_payment_intent_id
└─────────────────┘       │ added_at        │       │ status          │
                          └─────────────────┘       │ subtotal        │
                                                    │ shipping        │
┌─────────────────┐       ┌─────────────────┐       │ tax             │
│   order_items   │       │   commissions   │       │ total           │
├─────────────────┤       ├─────────────────┤       │ currency        │
│ id (PK)         │       │ id (PK)         │       │ shipping_name   │
│ order_id (FK)   │       │ name            │       │ shipping_address │
│ product_id (FK) │       │ email           │       │ shipping_city   │
│ quantity        │       │ phone           │       │ shipping_country │
│ price_at_purchase│      │ desired_verse   │       │ notes           │
│ customization   │       │ message         │       │ created_at      │
│                 │       │ dimensions      │       │ updated_at      │
│                 │       │ budget_range    │       └─────────────────┘
│                 │       │ script_preference       │
│                 │       │ status          │       ┌─────────────────┐
│                 │       │ created_at      │       │  order_status_history
│                 │       │ updated_at      │       ├─────────────────┤
│                 │       └─────────────────┘       │ id (PK)         │
│                 │                                 │ order_id (FK)   │
│                 │                                 │ status          │
│                 │                                 │ notes           │
│                 │                                 │ created_at      │
│                 │                                 └─────────────────┘
└─────────────────┘
```

---

## Table Definitions

### `collections`

Product categories. Replaces the static `collections` array in `lib/data.js`.

```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  arabic_name TEXT,
  description TEXT,
  image TEXT,                    -- URL to collection hero image
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Seed data** (matches current site):
```sql
INSERT INTO collections (slug, name, arabic_name, sort_order) VALUES
  ('quranic-verses', 'Quranic Verses', 'الآيات القرآنية', 1),
  ('99-names', '99 Names of Allah', 'الأسماء الحسنى', 2),
  ('bridal-gift', 'Bridal & Gift', 'مجموعة العروس', 3),
  ('limited-editions', 'Limited Editions', 'قطع فريدة', 4);
```

---

### `products`

The product catalog. Replaces the static `products` array.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  arabic_name TEXT,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  collection_label TEXT,         -- Denormalized for quick display (e.g., "Ayatul Kursi Collection")
  script TEXT,                   -- 'Thuluth', 'Diwani', 'Nastaliq', 'Naskh', 'Jali Thuluth', 'Ottoman Tezhip'
  dimensions TEXT,               -- e.g., '60 × 30″'
  canvas_size TEXT,              -- 'large' | 'medium' | 'small'
  price INTEGER NOT NULL,        -- Stored in cents (e.g., 35000 = $350.00)
  customization_fee INTEGER DEFAULT 0,  -- In cents
  processing_time TEXT,          -- e.g., '2–3 weeks'
  description TEXT,
  calligrapher TEXT,
  image TEXT,                    -- Primary image URL
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 1,  -- -1 for unlimited (made-to-order)
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for collection filtering
CREATE INDEX idx_products_collection ON products(collection_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
```

**Notes:**
- `price` stored as INTEGER cents to avoid floating-point issues with Stripe
- `stock_quantity = -1` means unlimited (made-to-order pieces like commissions)
- `collection_label` is denormalized to avoid a join on the product card grid

---

### `product_images`

Gallery images per product. Replaces the `images` array in product objects.

```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
```

---

### `product_features`

Bullet points like "Hand-gilded gold leaf", "Archival-grade canvas".

```sql
CREATE TABLE product_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_product_features_product ON product_features(product_id);
```

---

### `product_customizations`

Customization options like "Color palette", "Design style", "Layout inspiration".

```sql
CREATE TABLE product_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_product_customizations_product ON product_customizations(product_id);
```

---

### `users` (Managed by Supabase Auth)

Not explicitly created — Supabase Auth manages this table. We extend it with `profiles`.

---

### `profiles`

Extended user information. Linked to Supabase Auth `users` table.

```sql
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### `carts`

Server-side cart for authenticated users. Anonymous users still use localStorage (migrated on login).

```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX idx_carts_user ON carts(user_id);
```

---

### `cart_items`

Individual items in a cart.

```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  customization TEXT,            -- Free text for custom requests
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(cart_id, product_id)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
```

---

### `orders`

Purchase records. Created after successful Stripe payment.

```sql
CREATE TYPE order_status AS ENUM (
  'pending',           -- Awaiting payment
  'paid',              -- Payment confirmed
  'processing',        -- Atelier working on it
  'shipped',           -- Dispatched
  'delivered',         -- Received by customer
  'cancelled',         -- Order cancelled
  'refunded'           -- Refund issued
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status order_status DEFAULT 'pending',
  subtotal INTEGER NOT NULL,      -- In cents
  shipping INTEGER DEFAULT 0,       -- In cents
  tax INTEGER DEFAULT 0,          -- In cents
  total INTEGER NOT NULL,           -- In cents
  currency TEXT DEFAULT 'usd',
  
  -- Shipping details (copied at checkout time)
  shipping_name TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_country TEXT,
  shipping_postal_code TEXT,
  
  -- Customer-facing
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  
  -- Internal
  notes TEXT,
  tracking_number TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe_session ON orders(stripe_session_id);
```

---

### `order_items`

Line items within an order. Captures price at time of purchase (products may change price later).

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,       -- Snapshot at purchase time
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase INTEGER NOT NULL, -- In cents
  customization TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

---

### `order_status_history`

Audit trail of status changes. For customer "where is my order?" and admin tracking.

```sql
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_status_history_order ON order_status_history(order_id);
```

---

### `commissions`

Bespoke inquiry submissions. No auth required to submit.

```sql
CREATE TYPE commission_status AS ENUM (
  'new',
  'contacted',
  'quoted',
  'accepted',
  'in_progress',
  'completed',
  'cancelled'
);

CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact info (no auth required)
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Request details
  desired_verse TEXT,
  message TEXT,
  dimensions TEXT,
  budget_range TEXT,              -- e.g., "$200–$400", "Flexible"
  script_preference TEXT,
  color_preference TEXT,
  
  -- Reference images (URLs to Supabase Storage)
  reference_images TEXT[],
  
  -- Tracking
  status commission_status DEFAULT 'new',
  admin_notes TEXT,
  
  -- If user was logged in
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_email ON commissions(email);
```

---

## RLS Policies

### products
```sql
-- Public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (is_active = true);

-- Only admins can write (handled via service role or admin check)
CREATE POLICY "Products are manageable by admins"
  ON products FOR ALL USING (is_admin(auth.uid()));
```

### carts
```sql
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own carts"
  ON carts FOR ALL USING (auth.uid() = user_id);
```

### cart_items
```sql
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own cart items"
  ON cart_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
  ));
```

### orders
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

-- Inserts happen via Edge Function (Stripe webhook), bypassing RLS with service key
```

### commissions
```sql
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can submit commissions"
  ON commissions FOR INSERT WITH CHECK (true);

-- Submitters can view their own (matched by email if not authenticated)
CREATE POLICY "Submitters can view own commissions by email"
  ON commissions FOR SELECT
  USING (
    auth.uid() = user_id OR
    email = auth.email()
  );

-- Admins can view all
CREATE POLICY "Admins can manage all commissions"
  ON commissions FOR ALL USING (is_admin(auth.uid()));
```

---

## Helper Functions

```sql
-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = user_uuid AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get or create cart for user
CREATE OR REPLACE FUNCTION get_or_create_cart(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
  cart_uuid UUID;
BEGIN
  SELECT id INTO cart_uuid FROM carts WHERE user_id = user_uuid;
  
  IF cart_uuid IS NULL THEN
    INSERT INTO carts (user_id) VALUES (user_uuid) RETURNING id INTO cart_uuid;
  END IF;
  
  RETURN cart_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Migration from Static Data

The current `lib/data.js` contains 13 products across 4 collections. Migration steps:

1. Insert collections into `collections` table
2. Insert products into `products` table
3. Insert `images` arrays into `product_images`
4. Insert `features` arrays into `product_features`
5. Insert `customizations` arrays into `product_customizations`
6. Update frontend to fetch from Supabase instead of `lib/data.js`
7. Keep `lib/data.js` as a fallback or seed reference until migration is verified

A seed script (`scripts/seed-database.js`) should be written to automate this.
