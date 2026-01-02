-- =====================================================
-- Recyce Platform - Supabase Storage Setup
-- Run this in Supabase SQL Editor after creating the project
-- =====================================================

-- Create storage buckets for device images
-- Note: Buckets can also be created via Supabase Dashboard > Storage

-- 1. Create the 'devices' bucket for device model images
INSERT INTO storage.buckets (id, name, public)
VALUES ('devices', 'devices', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create the 'brands' bucket for brand logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('brands', 'brands', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Create the 'categories' bucket for category icons
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Create the 'blog' bucket for blog post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Create the 'general' bucket for misc uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('general', 'general', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES - Public Read Access
-- =====================================================

-- Allow public read access to device images
CREATE POLICY "Public read access for devices"
ON storage.objects FOR SELECT
USING (bucket_id = 'devices');

-- Allow public read access to brand logos
CREATE POLICY "Public read access for brands"
ON storage.objects FOR SELECT
USING (bucket_id = 'brands');

-- Allow public read access to category icons
CREATE POLICY "Public read access for categories"
ON storage.objects FOR SELECT
USING (bucket_id = 'categories');

-- Allow public read access to blog images
CREATE POLICY "Public read access for blog"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog');

-- Allow public read access to general bucket
CREATE POLICY "Public read access for general"
ON storage.objects FOR SELECT
USING (bucket_id = 'general');

-- =====================================================
-- STORAGE POLICIES - Admin Write Access
-- =====================================================

-- Allow admins to upload device images
CREATE POLICY "Admin upload for devices"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'devices' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to upload brand logos
CREATE POLICY "Admin upload for brands"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'brands' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to upload category icons
CREATE POLICY "Admin upload for categories"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'categories' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to upload blog images
CREATE POLICY "Admin upload for blog"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to upload to general bucket
CREATE POLICY "Admin upload for general"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'general' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- =====================================================
-- STORAGE POLICIES - Admin Update/Delete Access
-- =====================================================

-- Allow admins to update device images
CREATE POLICY "Admin update for devices"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'devices' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to delete device images
CREATE POLICY "Admin delete for devices"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'devices' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to update/delete brands
CREATE POLICY "Admin update for brands"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'brands' AND
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin delete for brands"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'brands' AND
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Allow admins to update/delete categories
CREATE POLICY "Admin update for categories"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'categories' AND
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin delete for categories"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'categories' AND
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Allow admins to update/delete blog images
CREATE POLICY "Admin update for blog"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog' AND
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin delete for blog"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog' AND
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- =====================================================
-- USAGE INSTRUCTIONS
-- =====================================================

-- To get the public URL for an uploaded image:
-- supabase.storage.from('devices').getPublicUrl('model-slug.jpg').data.publicUrl

-- Example URL format:
-- https://[project-ref].supabase.co/storage/v1/object/public/devices/iphone-15-pro-max.jpg

-- =====================================================
-- END OF STORAGE SETUP
-- =====================================================
