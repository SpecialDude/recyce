-- =====================================================
-- Recyce Platform - Database Schema
-- Supabase PostgreSQL Migration
-- Version: 1.0.0
-- Phase: 1 (Core Platform)
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CUSTOM TYPES & ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE address_type AS ENUM ('shipping', 'billing');
CREATE TYPE variant_type AS ENUM ('carrier', 'storage', 'color');
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'declined', 'expired');
CREATE TYPE order_status AS ENUM (
  'pending',
  'awaiting_shipment',
  'shipped',
  'received',
  'inspecting',
  'inspected',
  'payout_pending',
  'payout_complete',
  'cancelled'
);
CREATE TYPE inspection_status AS ENUM ('pending', 'in_progress', 'completed', 'disputed');
CREATE TYPE payout_method AS ENUM ('paypal', 'stripe', 'check', 'zelle');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE pricing_rule_type AS ENUM ('base_price', 'condition_override', 'seasonal_bonus');

-- =====================================================
-- USER MANAGEMENT
-- =====================================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Addresses table
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type address_type NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'US' NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on user_id for addresses
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- =====================================================
-- DEVICE CATALOG
-- =====================================================

-- Device categories (Phone, Tablet, Laptop, etc.)
CREATE TABLE device_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  display_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Device brands (Apple, Samsung, Google, etc.)
CREATE TABLE device_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES device_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  logo_url TEXT,
  display_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(category_id, slug)
);

CREATE INDEX idx_device_brands_category_id ON device_brands(category_id);

-- Device models (iPhone 15 Pro Max, Galaxy S24, etc.)
CREATE TABLE device_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES device_brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  has_carrier_variants BOOLEAN DEFAULT FALSE NOT NULL,
  has_storage_variants BOOLEAN DEFAULT FALSE NOT NULL,
  has_accessories BOOLEAN DEFAULT TRUE NOT NULL,
  image_url TEXT,
  specifications JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(brand_id, slug)
);

CREATE INDEX idx_device_models_brand_id ON device_models(brand_id);
CREATE INDEX idx_device_models_active ON device_models(is_active);

-- Device variants (Unlocked, 256GB, etc.)
CREATE TABLE device_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID NOT NULL REFERENCES device_models(id) ON DELETE CASCADE,
  variant_type variant_type NOT NULL,
  variant_value TEXT NOT NULL,
  price_adjustment DECIMAL(10,2) DEFAULT 0 NOT NULL,
  display_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(model_id, variant_type, variant_value)
);

CREATE INDEX idx_device_variants_model_id ON device_variants(model_id);

-- =====================================================
-- PRICING SYSTEM
-- =====================================================

-- Condition multipliers (Flawless, Good, Fair, etc.)
CREATE TABLE condition_multipliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  condition_name TEXT NOT NULL,
  condition_slug TEXT NOT NULL UNIQUE,
  multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  description TEXT NOT NULL,
  display_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Pricing rules (seasonal discounts, special pricing, etc.)
CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES device_models(id) ON DELETE CASCADE,
  category_id UUID REFERENCES device_categories(id) ON DELETE CASCADE,
  rule_type pricing_rule_type NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT pricing_rule_target CHECK (
    (model_id IS NOT NULL AND category_id IS NULL) OR
    (model_id IS NULL AND category_id IS NOT NULL)
  )
);

CREATE INDEX idx_pricing_rules_model_id ON pricing_rules(model_id);
CREATE INDEX idx_pricing_rules_category_id ON pricing_rules(category_id);
CREATE INDEX idx_pricing_rules_active ON pricing_rules(is_active);

-- =====================================================
-- OFFER & ORDER MANAGEMENT
-- =====================================================

-- Offers table
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_model_id UUID NOT NULL REFERENCES device_models(id) ON DELETE RESTRICT,
  condition_id UUID NOT NULL REFERENCES condition_multipliers(id) ON DELETE RESTRICT,
  carrier_variant_id UUID REFERENCES device_variants(id) ON DELETE RESTRICT,
  storage_variant_id UUID REFERENCES device_variants(id) ON DELETE RESTRICT,
  has_original_box BOOLEAN DEFAULT FALSE NOT NULL,
  has_charger BOOLEAN DEFAULT FALSE NOT NULL,
  quoted_price DECIMAL(10,2) NOT NULL,
  final_price DECIMAL(10,2),
  status offer_status DEFAULT 'pending' NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_offers_user_id ON offers(user_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_created_at ON offers(created_at DESC);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  status order_status DEFAULT 'pending' NOT NULL,
  shipping_address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT,
  tracking_number TEXT,
  shipping_carrier TEXT,
  shipping_notes TEXT,
  label_url TEXT,
  shipped_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- =====================================================
-- INSPECTION & PAYOUT
-- =====================================================

-- Inspections table
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  inspector_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  actual_condition_id UUID NOT NULL REFERENCES condition_multipliers(id) ON DELETE RESTRICT,
  discrepancies TEXT,
  adjusted_price DECIMAL(10,2),
  photos JSONB DEFAULT '[]',
  notes TEXT,
  status inspection_status DEFAULT 'pending' NOT NULL,
  inspected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_inspections_order_id ON inspections(order_id);
CREATE INDEX idx_inspections_status ON inspections(status);

-- Payouts table
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  method payout_method NOT NULL,
  payment_email TEXT,
  payment_details JSONB DEFAULT '{}',
  status payout_status DEFAULT 'pending' NOT NULL,
  processed_at TIMESTAMPTZ,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_payouts_user_id ON payouts(user_id);
CREATE INDEX idx_payouts_order_id ON payouts(order_id);
CREATE INDEX idx_payouts_status ON payouts(status);

-- =====================================================
-- CONTENT MANAGEMENT
-- =====================================================

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  status blog_status DEFAULT 'draft' NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- FAQs table
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0 NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_featured ON faqs(is_featured);

-- Support tickets table
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status ticket_status DEFAULT 'open' NOT NULL,
  priority ticket_priority DEFAULT 'medium' NOT NULL,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_assigned_to ON support_tickets(assigned_to);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_models_updated_at BEFORE UPDATE ON device_models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  prefix TEXT := 'RCY';
  timestamp_part TEXT;
  random_part TEXT;
BEGIN
  timestamp_part := UPPER(TO_CHAR(NOW(), 'YYMMDD'));
  random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  RETURN prefix || '-' || timestamp_part || '-' || random_part;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- HELPER VIEWS
-- =====================================================

-- View for device models with brand and category info
CREATE OR REPLACE VIEW device_models_with_brand AS
SELECT 
  dm.*,
  db.name AS brand_name,
  db.slug AS brand_slug,
  db.logo_url AS brand_logo,
  dc.name AS category_name,
  dc.slug AS category_slug,
  dc.icon_url AS category_icon
FROM device_models dm
JOIN device_brands db ON dm.brand_id = db.id
JOIN device_categories dc ON db.category_id = dc.id;

-- View for offers with complete details
CREATE OR REPLACE VIEW offers_with_details AS
SELECT 
  o.*,
  dm.name AS device_name,
  dm.image_url AS device_image,
  db.name AS brand_name,
  dc.name AS category_name,
  cm.condition_name,
  cm.multiplier AS condition_multiplier,
  p.full_name AS user_name,
  p.email AS user_email
FROM offers o
JOIN device_models dm ON o.device_model_id = dm.id
JOIN device_brands db ON dm.brand_id = db.id
JOIN device_categories dc ON db.category_id = dc.id
JOIN condition_multipliers cm ON o.condition_id = cm.id
JOIN profiles p ON o.user_id = p.id;

-- View for orders with complete details
CREATE OR REPLACE VIEW orders_with_details AS
SELECT 
  ord.*,
  off.quoted_price,
  off.final_price AS offer_final_price,
  dm.name AS device_name,
  db.name AS brand_name,
  cm.condition_name,
  p.full_name AS user_name,
  p.email AS user_email,
  a.street AS shipping_street,
  a.city AS shipping_city,
  a.state AS shipping_state,
  a.zip_code AS shipping_zip
FROM orders ord
JOIN offers off ON ord.offer_id = off.id
JOIN device_models dm ON off.device_model_id = dm.id
JOIN device_brands db ON dm.brand_id = db.id
JOIN condition_multipliers cm ON off.condition_id = cm.id
JOIN profiles p ON ord.user_id = p.id
JOIN addresses a ON ord.shipping_address_id = a.id;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE device_categories IS 'Top-level device categories (Phone, Tablet, etc.)';
COMMENT ON TABLE device_brands IS 'Device brands within categories (Apple, Samsung, etc.)';
COMMENT ON TABLE device_models IS 'Specific device models with pricing and specifications';
COMMENT ON TABLE device_variants IS 'Device variants like carrier, storage, color options';
COMMENT ON TABLE condition_multipliers IS 'Condition multipliers for price calculation';
COMMENT ON TABLE pricing_rules IS 'Dynamic pricing rules for special offers and seasonal pricing';
COMMENT ON TABLE offers IS 'User device sell offers with quoted prices';
COMMENT ON TABLE orders IS 'Accepted offers that are now orders in fulfillment';
COMMENT ON TABLE inspections IS 'Device inspections by admin after receiving device';
COMMENT ON TABLE payouts IS 'Payment records for completed orders';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
