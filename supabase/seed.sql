-- =====================================================
-- Recyce Platform - Seed Data
-- Sample data for development and testing
-- Version: 1.0.0
-- =====================================================

-- NOTE: Run this after schema.sql and rls_policies.sql

-- =====================================================
-- CONDITION MULTIPLIERS
-- =====================================================

INSERT INTO condition_multipliers (condition_name, condition_slug, multiplier, description, display_order) VALUES
('Flawless', 'flawless', 1.00, 'Like new condition with no signs of wear. Screen is perfect, no scratches on body.', 1),
('Very Good', 'very-good', 0.90, 'Minor cosmetic imperfections. Screen is perfect, minimal wear on body.', 2),
('Good', 'good', 0.75, 'Noticeable wear but fully functional. Light scratches on screen or body.', 3),
('Fair', 'fair', 0.55, 'Heavy wear with visible scratches or small cracks. Fully functional.', 4),
('Broken', 'broken', 0.30, 'Non-functional or severely damaged. Cracked screen, major issues.', 5);

-- =====================================================
-- DEVICE CATEGORIES
-- =====================================================

INSERT INTO device_categories (name, slug, display_order, is_active) VALUES
('Phone', 'phone', 1, TRUE),
('Tablet', 'tablet', 2, TRUE),
('Laptop', 'laptop', 3, TRUE),
('Smartwatch', 'smartwatch', 4, TRUE),
('Gaming Console', 'gaming-console', 5, TRUE),
('Desktop', 'desktop', 6, TRUE);

-- =====================================================
-- DEVICE BRANDS
-- =====================================================

-- Get category IDs
DO $$
DECLARE
  phone_cat_id UUID;
  tablet_cat_id UUID;
  laptop_cat_id UUID;
  watch_cat_id UUID;
  console_cat_id UUID;
  desktop_cat_id UUID;
BEGIN
  SELECT id INTO phone_cat_id FROM device_categories WHERE slug = 'phone';
  SELECT id INTO tablet_cat_id FROM device_categories WHERE slug = 'tablet';
  SELECT id INTO laptop_cat_id FROM device_categories WHERE slug = 'laptop';
  SELECT id INTO watch_cat_id FROM device_categories WHERE slug = 'smartwatch';
  SELECT id INTO console_cat_id FROM device_categories WHERE slug = 'gaming-console';
  SELECT id INTO desktop_cat_id FROM device_categories WHERE slug = 'desktop';

  -- Phone brands
  INSERT INTO device_brands (category_id, name, slug, display_order) VALUES
  (phone_cat_id, 'Apple', 'apple', 1),
  (phone_cat_id, 'Samsung', 'samsung', 2),
  (phone_cat_id, 'Google', 'google', 3),
  (phone_cat_id, 'OnePlus', 'oneplus', 4),
  (phone_cat_id, 'Motorola', 'motorola', 5);

  -- Tablet brands
  INSERT INTO device_brands (category_id, name, slug, display_order) VALUES
  (tablet_cat_id, 'Apple', 'apple', 1),
  (tablet_cat_id, 'Samsung', 'samsung', 2),
  (tablet_cat_id, 'Microsoft', 'microsoft', 3),
  (tablet_cat_id, 'Amazon', 'amazon', 4);

  -- Laptop brands
  INSERT INTO device_brands (category_id, name, slug, display_order) VALUES
  (laptop_cat_id, 'Apple', 'apple', 1),
  (laptop_cat_id, 'Dell', 'dell', 2),
  (laptop_cat_id, 'HP', 'hp', 3),
  (laptop_cat_id, 'Lenovo', 'lenovo', 4),
  (laptop_cat_id, 'Microsoft', 'microsoft', 5);

  -- Smartwatch brands
  INSERT INTO device_brands (category_id, name, slug, display_order) VALUES
  (watch_cat_id, 'Apple', 'apple', 1),
  (watch_cat_id, 'Samsung', 'samsung', 2),
  (watch_cat_id, 'Garmin', 'garmin', 3),
  (watch_cat_id, 'Fitbit', 'fitbit', 4);

  -- Gaming Console brands
  INSERT INTO device_brands (category_id, name, slug, display_order) VALUES
  (console_cat_id, 'Sony', 'sony', 1),
  (console_cat_id, 'Microsoft', 'microsoft', 2),
  (console_cat_id, 'Nintendo', 'nintendo', 3);

  -- Desktop brands
  INSERT INTO device_brands (category_id, name, slug, display_order) VALUES
  (desktop_cat_id, 'Apple', 'apple', 1),
  (desktop_cat_id, 'Dell', 'dell', 2),
  (desktop_cat_id, 'HP', 'hp', 3);
END $$;

-- =====================================================
-- DEVICE MODELS - PHONES (Sample)
-- =====================================================

DO $$
DECLARE
  apple_phone_brand_id UUID;
  samsung_phone_brand_id UUID;
  google_phone_brand_id UUID;
BEGIN
  -- Get brand IDs
  SELECT id INTO apple_phone_brand_id 
  FROM device_brands db
  JOIN device_categories dc ON db.category_id = dc.id
  WHERE db.slug = 'apple' AND dc.slug = 'phone';

  SELECT id INTO samsung_phone_brand_id 
  FROM device_brands db
  JOIN device_categories dc ON db.category_id = dc.id
  WHERE db.slug = 'samsung' AND dc.slug = 'phone';

  SELECT id INTO google_phone_brand_id 
  FROM device_brands db
  JOIN device_categories dc ON db.category_id = dc.id
  WHERE db.slug = 'google' AND dc.slug = 'phone';

  -- Apple iPhones
  INSERT INTO device_models (brand_id, name, slug, base_price, has_carrier_variants, has_storage_variants, specifications) VALUES
  (apple_phone_brand_id, 'iPhone 16 Pro Max', 'iphone-16-pro-max', 950.00, TRUE, TRUE, '{"release_year": 2024, "screen_size": "6.9\"", "5g": true}'),
  (apple_phone_brand_id, 'iPhone 16 Pro', 'iphone-16-pro', 850.00, TRUE, TRUE, '{"release_year": 2024, "screen_size": "6.3\"", "5g": true}'),
  (apple_phone_brand_id, 'iPhone 16', 'iphone-16', 650.00, TRUE, TRUE, '{"release_year": 2024, "screen_size": "6.1\"", "5g": true}'),
  (apple_phone_brand_id, 'iPhone 15 Pro Max', 'iphone-15-pro-max', 850.00, TRUE, TRUE, '{"release_year": 2023, "screen_size": "6.7\"", "5g": true}'),
  (apple_phone_brand_id, 'iPhone 15 Pro', 'iphone-15-pro', 750.00, TRUE, TRUE, '{"release_year": 2023, "screen_size": "6.1\"", "5g": true}'),
  (apple_phone_brand_id, 'iPhone 15', 'iphone-15', 550.00, TRUE, TRUE, '{"release_year": 2023, "screen_size": "6.1\"", "5g": true}'),
  (apple_phone_brand_id, 'iPhone 14 Pro Max', 'iphone-14-pro-max', 700.00, TRUE, TRUE, '{"release_year": 2022, "screen_size": "6.7\"", "5g": true}'),
  (apple_phone_brand_id, 'iPhone 14', 'iphone-14', 450.00, TRUE, TRUE, '{"release_year": 2022, "screen_size": "6.1\"", "5g": true}'),
  (apple_phone_brand_id, 'iPhone 13', 'iphone-13', 350.00, TRUE, TRUE, '{"release_year": 2021, "screen_size": "6.1\"", "5g": true}');

  -- Samsung Phones
  INSERT INTO device_models (brand_id, name, slug, base_price, has_carrier_variants, has_storage_variants, specifications) VALUES
  (samsung_phone_brand_id, 'Galaxy S24 Ultra', 'galaxy-s24-ultra', 900.00, TRUE, TRUE, '{"release_year": 2024, "screen_size": "6.8\"", "5g": true}'),
  (samsung_phone_brand_id, 'Galaxy S24+', 'galaxy-s24-plus', 750.00, TRUE, TRUE, '{"release_year": 2024, "screen_size": "6.7\"", "5g": true}'),
  (samsung_phone_brand_id, 'Galaxy S24', 'galaxy-s24', 650.00, TRUE, TRUE, '{"release_year": 2024, "screen_size": "6.2\"", "5g": true}'),
  (samsung_phone_brand_id, 'Galaxy S23 Ultra', 'galaxy-s23-ultra', 750.00, TRUE, TRUE, '{"release_year": 2023, "screen_size": "6.8\"", "5g": true}'),
  (samsung_phone_brand_id, 'Galaxy Z Fold 5', 'galaxy-z-fold-5', 1200.00, TRUE, TRUE, '{"release_year": 2023, "screen_size": "7.6\"", "5g": true, "foldable": true}'),
  (samsung_phone_brand_id, 'Galaxy Z Flip 5', 'galaxy-z-flip-5', 700.00, TRUE, TRUE, '{"release_year": 2023, "screen_size": "6.7\"", "5g": true, "foldable": true}');

  -- Google Pixels
  INSERT INTO device_models (brand_id, name, slug, base_price, has_carrier_variants, has_storage_variants, specifications) VALUES
  (google_phone_brand_id, 'Pixel 9 Pro XL', 'pixel-9-pro-xl', 750.00, TRUE, TRUE, '{"release_year": 2024, "screen_size": "6.8\"", "5g": true}'),
  (google_phone_brand_id, 'Pixel 9 Pro', 'pixel-9-pro', 650.00, TRUE, TRUE, '{"release_year": 2024, "screen_size": "6.3\"", "5g": true}'),
  (google_phone_brand_id, 'Pixel 9', 'pixel-9', 500.00, TRUE, TRUE, '{"release_year": 2024, "screen_size": "6.3\"", "5g": true}'),
  (google_phone_brand_id, 'Pixel 8 Pro', 'pixel-8-pro', 550.00, TRUE, TRUE, '{"release_year": 2023, "screen_size": "6.7\"", "5g": true}');
END $$;

-- =====================================================
-- DEVICE VARIANTS - Sample Carriers & Storage
-- =====================================================

DO $$
DECLARE
  model_rec RECORD;
BEGIN
  -- Add carrier variants to all phones with carrier support
  FOR model_rec IN 
    SELECT id FROM device_models WHERE has_carrier_variants = TRUE
  LOOP
    INSERT INTO device_variants (model_id, variant_type, variant_value, price_adjustment, display_order) VALUES
    (model_rec.id, 'carrier', 'Unlocked', 0, 1),
    (model_rec.id, 'carrier', 'AT&T', -20, 2),
    (model_rec.id, 'carrier', 'Verizon', -20, 3),
    (model_rec.id, 'carrier', 'T-Mobile', -20, 4),
    (model_rec.id, 'carrier', 'Sprint', -30, 5);
  END LOOP;

  -- Add storage variants to all phones with storage support
  FOR model_rec IN 
    SELECT id FROM device_models WHERE has_storage_variants = TRUE
  LOOP
    INSERT INTO device_variants (model_id, variant_type, variant_value, price_adjustment, display_order) VALUES
    (model_rec.id, 'storage', '128GB', 0, 1),
    (model_rec.id, 'storage', '256GB', 50, 2),
    (model_rec.id, 'storage', '512GB', 100, 3),
    (model_rec.id, 'storage', '1TB', 200, 4);
  END LOOP;
END $$;

-- =====================================================
-- FAQS
-- =====================================================

INSERT INTO faqs (category, question, answer, display_order, is_featured) VALUES
('General', 'How does Recyce work?', 'Recyce makes it easy to sell your electronics. Simply select your device, answer a few questions about its condition, get an instant quote, and ship it to us using a prepaid label. We''ll inspect it and send you payment!', 1, TRUE),
('General', 'What devices do you accept?', 'We accept phones, tablets, laptops, smartwatches, gaming consoles, and desktop computers from major brands including Apple, Samsung, Google, and more.', 2, TRUE),
('Pricing', 'How do you determine the price?', 'Our pricing is based on the device model, its condition, storage capacity, carrier status, and whether you include original accessories. Prices are updated regularly based on market value.', 3, TRUE),
('Shipping', 'How do I ship my device?', 'After accepting an offer, you''ll receive shipping instructions from our team. We cover all shipping costs!', 4, FALSE),
('Payment', 'When will I get paid?', 'Payment is processed after we receive and inspect your device. This typically takes 2-3 business days after we receive it. You''ll be notified via email throughout the process.', 5, TRUE),
('Payment', 'What payment methods do you offer?', 'Currently, payment details are managed by our admin team. You''ll receive instructions after your device is inspected and approved.', 6, FALSE),
('Data Security', 'What happens to my data?', 'We recommend you back up and erase your device before shipping. All devices are securely wiped using industry-standard methods to protect your privacy.', 7, TRUE),
('Inspection', 'What if the condition doesn''t match my description?', 'If we find the condition is different from what you described, we''ll contact you with a revised offer. You can accept the new offer or have your device returned at no cost.', 8, FALSE);

-- =====================================================
-- BLOG POSTS (Sample)
-- =====================================================

-- Note: These will need a valid author_id from profiles table
-- You'll need to insert these after creating an admin user

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Seed data loaded successfully!';
  RAISE NOTICE 'Categories: %', (SELECT COUNT(*) FROM device_categories);
  RAISE NOTICE 'Brands: %', (SELECT COUNT(*) FROM device_brands);
  RAISE NOTICE 'Models: %', (SELECT COUNT(*) FROM device_models);
  RAISE NOTICE 'Variants: %', (SELECT COUNT(*) FROM device_variants);
  RAISE NOTICE 'Conditions: %', (SELECT COUNT(*) FROM condition_multipliers);
  RAISE NOTICE 'FAQs: %', (SELECT COUNT(*) FROM faqs);
END $$;

-- =====================================================
-- END OF SEED DATA
-- =====================================================
