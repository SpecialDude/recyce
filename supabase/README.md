# Recyce Platform - Supabase Setup Guide

## Overview

This directory contains all SQL files needed to set up the Recyce platform database in Supabase.

## Files

- **schema.sql** - Complete database schema with tables, indexes, triggers, and functions
- **rls_policies.sql** - Row Level Security policies for all tables
- **seed.sql** - Sample data for development and testing

## Setup Instructions

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: recyce (or your preferred name)
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create Project" and wait for it to initialize

### 2. Get API Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Update your `.env.local` file in the project root

### 3. Run Database Migrations

#### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `schema.sql`
5. Click "Run" or press `Ctrl+Enter`
6. Repeat for `rls_policies.sql`
7. Repeat for `seed.sql`

#### Option B: Using Supabase CLI (Recommended for production)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or run individual files
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" < supabase/schema.sql
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" < supabase/rls_policies.sql
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" < supabase/seed.sql
```

### 4. Verify Setup

Run this query in SQL Editor to verify everything is set up:

```sql
SELECT 
  'Categories' as table_name, COUNT(*) as count FROM device_categories
UNION ALL
SELECT 'Brands', COUNT(*) FROM device_brands
UNION ALL
SELECT 'Models', COUNT(*) FROM device_models
UNION ALL
SELECT 'Variants', COUNT(*) FROM device_variants
UNION ALL
SELECT 'Conditions', COUNT(*) FROM condition_multipliers
UNION ALL
SELECT 'FAQs', COUNT(*) FROM faqs;
```

You should see data in all tables if seed.sql ran successfully.

### 5. Create Test Admin User

1. Go to Authentication → Users in Supabase dashboard
2. Click "Add User" → "Create new user"
3. Fill in:
   - **Email**: admin@recyce.com (or your preferred email)
   - **Password**: (choose a strong password)
   - **Auto Confirm User**: Yes
4. Click "Create User"
5. Go to SQL Editor and run this query to make them an admin:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@recyce.com';
```

### 6. Test Authentication

Try logging in to the app with your admin credentials to verify everything works.

## Database Schema Overview

### Core Tables

- **profiles** - User accounts (extends Supabase auth.users)
- **addresses** - User shipping and billing addresses
- **device_categories** - Top-level categories (Phone, Tablet, etc.)
- **device_brands** - Brands within categories (Apple, Samsung, etc.)
- **device_models** - Specific models with pricing
- **device_variants** - Carrier, storage, and color options
- **condition_multipliers** - Condition-based pricing multipliers
- **pricing_rules** - Dynamic pricing rules and promotions

### Transaction Tables

- **offers** - User device sell offers
- **orders** - Accepted offers in fulfillment
- **inspections** - Device inspections after receipt
- **payouts** - Payment records

### Content Tables

- **blog_posts** - Blog/news content
- **faqs** - Frequently asked questions
- **support_tickets** - Customer support tickets
- **audit_logs** - Security and compliance logging

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies for:

- **Public read**: Device catalog, conditions, published content
- **User isolation**: Users can only access their own data
- **Admin access**: Admins have full access to manage the platform

### Helper Functions

- `is_admin()` - Check if current user is admin
- `is_owner(user_id)` - Check if current user owns a resource
- `generate_order_number()` - Generate unique order numbers

## Common Admin Tasks

### Add New Device

```sql
-- 1. Get brand ID
SELECT id, name FROM device_brands WHERE name = 'Apple';

-- 2. Insert new model
INSERT INTO device_models (
  brand_id,
  name,
  slug,
  base_price,
  has_carrier_variants,
  has_storage_variants,
  specifications
) VALUES (
  'brand-uuid-here',
  'iPhone 17 Pro',
  'iphone-17-pro',
  1099.00,
  TRUE,
  TRUE,
  '{"release_year": 2025, "screen_size": "6.3\"", "5g": true}'
);
```

### Update Condition Multipliers

```sql
UPDATE condition_multipliers
SET multiplier = 0.95
WHERE condition_slug = 'very-good';
```

### View All Pending Orders

```sql
SELECT 
  order_number,
  user_email,
  device_name,
  status,
  created_at
FROM orders_with_details
WHERE status IN ('pending', 'awaiting_shipment')
ORDER BY created_at DESC;
```

## Troubleshooting

### RLS Blocking Queries?

Make sure you're authenticated when testing. You can temporarily disable RLS for testing:

```sql
-- ONLY FOR DEVELOPMENT/TESTING
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- Re-enable when done
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Can't Access Data?

Check if your user has the correct role:

```sql
SELECT id, email, role FROM profiles WHERE email = 'your@email.com';
```

### Migrations Failed?

Drop all tables and start fresh:

```sql
-- WARNING: This deletes all data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then run migrations again
```

## Backup & Restore

### Create Backup

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or using pg_dump
pg_dump "postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres" > backup.sql
```

### Restore from Backup

```bash
psql "postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres" < backup.sql
```

## Support

For issues or questions:
- Check Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Review the implementation plan in the project root
- Contact the development team

---

**Last Updated**: 2026-01-01
**Version**: 1.0.0
**Phase**: 1 (Core Platform)
