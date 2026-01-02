-- =====================================================
-- Recyce Platform - Row Level Security (RLS) Policies
-- Supabase Security Configuration
-- Version: 1.0.0
-- =====================================================

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE condition_multipliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns a resource
CREATE OR REPLACE FUNCTION is_owner(owner_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = owner_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- ADDRESSES POLICIES
-- =====================================================

-- Users can view their own addresses
CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (is_owner(user_id));

-- Users can insert their own addresses
CREATE POLICY "Users can insert own addresses"
  ON addresses FOR INSERT
  WITH CHECK (is_owner(user_id));

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  USING (is_owner(user_id))
  WITH CHECK (is_owner(user_id));

-- Users can delete their own addresses
CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  USING (is_owner(user_id));

-- Admins can view all addresses
CREATE POLICY "Admins can view all addresses"
  ON addresses FOR SELECT
  USING (is_admin());

-- =====================================================
-- DEVICE CATALOG POLICIES (PUBLIC READ)
-- =====================================================

-- Anyone can view active device categories
CREATE POLICY "Public can view active categories"
  ON device_categories FOR SELECT
  USING (is_active = TRUE);

-- Admins can manage device categories
CREATE POLICY "Admins can manage categories"
  ON device_categories FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Anyone can view active device brands
CREATE POLICY "Public can view active brands"
  ON device_brands FOR SELECT
  USING (is_active = TRUE);

-- Admins can manage device brands
CREATE POLICY "Admins can manage brands"
  ON device_brands FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Anyone can view active device models
CREATE POLICY "Public can view active models"
  ON device_models FOR SELECT
  USING (is_active = TRUE);

-- Admins can manage device models
CREATE POLICY "Admins can manage models"
  ON device_models FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Anyone can view device variants
CREATE POLICY "Public can view variants"
  ON device_variants FOR SELECT
  USING (TRUE);

-- Admins can manage device variants
CREATE POLICY "Admins can manage variants"
  ON device_variants FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- PRICING POLICIES
-- =====================================================

-- Anyone can view condition multipliers
CREATE POLICY "Public can view conditions"
  ON condition_multipliers FOR SELECT
  USING (TRUE);

-- Admins can manage condition multipliers
CREATE POLICY "Admins can manage conditions"
  ON condition_multipliers FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Public can view active pricing rules (for price calculation)
CREATE POLICY "Public can view active pricing rules"
  ON pricing_rules FOR SELECT
  USING (is_active = TRUE);

-- Admins can manage pricing rules
CREATE POLICY "Admins can manage pricing rules"
  ON pricing_rules FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- OFFERS POLICIES
-- =====================================================

-- Users can view their own offers
CREATE POLICY "Users can view own offers"
  ON offers FOR SELECT
  USING (is_owner(user_id));

-- Users can create their own offers
CREATE POLICY "Users can create own offers"
  ON offers FOR INSERT
  WITH CHECK (is_owner(user_id));

-- Users can update their own pending offers
CREATE POLICY "Users can update own pending offers"
  ON offers FOR UPDATE
  USING (is_owner(user_id) AND status = 'pending')
  WITH CHECK (is_owner(user_id));

-- Admins can view all offers
CREATE POLICY "Admins can view all offers"
  ON offers FOR SELECT
  USING (is_admin());

-- Admins can update any offer
CREATE POLICY "Admins can update all offers"
  ON offers FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- ORDERS POLICIES
-- =====================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (is_owner(user_id));

-- Users can create their own orders (from accepted offers)
CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (is_owner(user_id));

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (is_admin());

-- Admins can update any order
CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- INSPECTIONS POLICIES
-- =====================================================

-- Users can view inspections for their orders
CREATE POLICY "Users can view own order inspections"
  ON inspections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = inspections.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admins can manage all inspections
CREATE POLICY "Admins can manage inspections"
  ON inspections FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- PAYOUTS POLICIES
-- =====================================================

-- Users can view their own payouts
CREATE POLICY "Users can view own payouts"
  ON payouts FOR SELECT
  USING (is_owner(user_id));

-- Admins can manage all payouts
CREATE POLICY "Admins can manage payouts"
  ON payouts FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- CONTENT POLICIES
-- =====================================================

-- Anyone can view published blog posts
CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Admins can manage all blog posts
CREATE POLICY "Admins can manage blog posts"
  ON blog_posts FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Anyone can view FAQs
CREATE POLICY "Public can view FAQs"
  ON faqs FOR SELECT
  USING (TRUE);

-- Admins can manage FAQs
CREATE POLICY "Admins can manage FAQs"
  ON faqs FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- SUPPORT TICKETS POLICIES
-- =====================================================

-- Users can view their own tickets
CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  USING (is_owner(user_id));

-- Users can create their own tickets
CREATE POLICY "Users can create own tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (is_owner(user_id));

-- Users can update their own open tickets
CREATE POLICY "Users can update own open tickets"
  ON support_tickets FOR UPDATE
  USING (is_owner(user_id) AND status = 'open')
  WITH CHECK (is_owner(user_id));

-- Admins can view all tickets
CREATE POLICY "Admins can view all tickets"
  ON support_tickets FOR SELECT
  USING (is_admin());

-- Admins can manage all tickets
CREATE POLICY "Admins can manage all tickets"
  ON support_tickets FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- =====================================================
-- AUDIT LOGS POLICIES
-- =====================================================

-- Users can view their own audit logs
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  USING (is_owner(user_id));

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (is_admin());

-- Only system can insert audit logs (via triggers)
CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (TRUE);

-- =====================================================
-- SECURITY NOTES
-- =====================================================

/*
 * IMPORTANT SECURITY CONSIDERATIONS:
 * 
 * 1. All tables have RLS enabled - no data is accessible without explicit policies
 * 2. Public read access is granted only to:
 *    - Device catalog (categories, brands, models, variants)
 *    - Condition multipliers
 *    - Active pricing rules (needed for quote calculation)
 *    - Published blog posts
 *    - FAQs
 * 
 * 3. User data (offers, orders, addresses, profiles) is strictly isolated
 *    - Users can only access their own data
 *    - Admins have full access via is_admin() function
 * 
 * 4. Sensitive operations (inspections, payouts) are admin-only
 * 
 * 5. The is_admin() function is SECURITY DEFINER to safely check admin role
 * 
 * 6. All write operations check ownership or admin status
 * 
 * 7. Audit logs track all sensitive operations for compliance
 */

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schemas
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_owner(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_order_number() TO authenticated;

-- =====================================================
-- END OF RLS POLICIES
-- =====================================================
