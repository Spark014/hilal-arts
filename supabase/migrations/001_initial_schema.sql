-- HILAL Arts — Initial Database Schema
-- Supabase PostgreSQL

-- ─────────────────────────────────────────────────────────────
-- 1. COLLECTIONS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  arabic_name TEXT,
  description TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- 2. PRODUCTS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  arabic_name TEXT,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  collection_label TEXT,
  script TEXT,
  dimensions TEXT,
  canvas_size TEXT,
  price INTEGER NOT NULL,
  customization_fee INTEGER DEFAULT 0,
  processing_time TEXT,
  description TEXT,
  calligrapher TEXT,
  image TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- ─────────────────────────────────────────────────────────────
-- 3. PRODUCT IMAGES
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- ─────────────────────────────────────────────────────────────
-- 4. PRODUCT FEATURES
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_product_features_product ON product_features(product_id);

-- ─────────────────────────────────────────────────────────────
-- 5. PRODUCT CUSTOMIZATIONS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_product_customizations_product ON product_customizations(product_id);

-- ─────────────────────────────────────────────────────────────
-- 6. PROFILES (extends auth.users)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
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

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 7. CARTS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id);

-- ─────────────────────────────────────────────────────────────
-- 8. CART ITEMS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  customization TEXT,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);

-- ─────────────────────────────────────────────────────────────
-- 9. ORDERS
-- ─────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM (
      'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status order_status DEFAULT 'pending',
  subtotal INTEGER NOT NULL,
  shipping INTEGER DEFAULT 0,
  tax INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  shipping_name TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_country TEXT,
  shipping_postal_code TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  notes TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);

-- ─────────────────────────────────────────────────────────────
-- 10. ORDER ITEMS
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase INTEGER NOT NULL,
  customization TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ─────────────────────────────────────────────────────────────
-- 11. ORDER STATUS HISTORY
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_status_history_order ON order_status_history(order_id);

-- ─────────────────────────────────────────────────────────────
-- 12. COMMISSIONS
-- ─────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'commission_status') THEN
    CREATE TYPE commission_status AS ENUM (
      'new', 'contacted', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  desired_verse TEXT,
  message TEXT,
  dimensions TEXT,
  budget_range TEXT,
  script_preference TEXT,
  color_preference TEXT,
  reference_images TEXT[],
  status commission_status DEFAULT 'new',
  admin_notes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_email ON commissions(email);

-- ─────────────────────────────────────────────────────────────
-- 13. HELPER FUNCTIONS
-- ─────────────────────────────────────────────────────────────

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = user_uuid AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Get or create cart for user
CREATE OR REPLACE FUNCTION get_or_create_cart(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
  cart_uuid UUID;
BEGIN
  -- Only allow users to access their own cart
  IF user_uuid != auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT id INTO cart_uuid FROM public.carts WHERE user_id = user_uuid;

  IF cart_uuid IS NULL THEN
    INSERT INTO public.carts (user_id) VALUES (user_uuid) RETURNING id INTO cart_uuid;
  END IF;

  RETURN cart_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ─────────────────────────────────────────────────────────────
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────────

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: public read
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Products are manageable by admins" ON products;
CREATE POLICY "Products are manageable by admins"
  ON products FOR ALL USING (is_admin(auth.uid()));

-- COLLECTIONS: public read
DROP POLICY IF EXISTS "Collections are viewable by everyone" ON collections;
CREATE POLICY "Collections are viewable by everyone"
  ON collections FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Collections are manageable by admins" ON collections;
CREATE POLICY "Collections are manageable by admins"
  ON collections FOR ALL USING (is_admin(auth.uid()));

-- PRODUCT IMAGES: public read
DROP POLICY IF EXISTS "Product images are viewable by everyone" ON product_images;
CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT USING (true);

-- PRODUCT FEATURES: public read
DROP POLICY IF EXISTS "Product features are viewable by everyone" ON product_features;
CREATE POLICY "Product features are viewable by everyone"
  ON product_features FOR SELECT USING (true);

-- PRODUCT CUSTOMIZATIONS: public read
DROP POLICY IF EXISTS "Product customizations are viewable by everyone" ON product_customizations;
CREATE POLICY "Product customizations are viewable by everyone"
  ON product_customizations FOR SELECT USING (true);

-- PROFILES: strict RLS — users only see/edit own, never promote themselves to admin
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by owner" ON profiles;
CREATE POLICY "Profiles are viewable by owner"
  ON profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND is_admin = COALESCE((SELECT p.is_admin FROM public.profiles p WHERE p.user_id = auth.uid()), false)
  );

-- CARTS: users own
DROP POLICY IF EXISTS "Users can only access own carts" ON carts;
CREATE POLICY "Users can only access own carts"
  ON carts FOR ALL USING (auth.uid() = user_id);

-- CART ITEMS: users own via cart
DROP POLICY IF EXISTS "Users can only access own cart items" ON cart_items;
CREATE POLICY "Users can only access own cart items"
  ON cart_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
  ));

-- ORDERS: users see own
DROP POLICY IF EXISTS "Users can only view own orders" ON orders;
CREATE POLICY "Users can only view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

-- ORDER ITEMS: users see own via order
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only view own order items" ON order_items;
CREATE POLICY "Users can only view own order items"
  ON order_items FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

-- ORDER STATUS HISTORY: users see own via order
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only view own order status history" ON order_status_history;
CREATE POLICY "Users can only view own order status history"
  ON order_status_history FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid()
  ));

-- COMMISSIONS: public insert, logged-in submitters can view own only
DROP POLICY IF EXISTS "Anyone can submit commissions" ON commissions;
CREATE POLICY "Anyone can submit commissions"
  ON commissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Submitters can view own commissions" ON commissions;
CREATE POLICY "Submitters can view own commissions"
  ON commissions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all commissions" ON commissions;
CREATE POLICY "Admins can manage all commissions"
  ON commissions FOR ALL USING (is_admin(auth.uid()));
