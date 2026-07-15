-- Migration 003: Admin dashboard tables
-- Run this in Supabase SQL Editor

-- Banners for homepage
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  link TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Discount codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value NUMERIC NOT NULL,
  min_order NUMERIC DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Store settings (key-value)
CREATE TABLE IF NOT EXISTS store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings
INSERT INTO store_settings (key, value) VALUES
('delivery_charges', '{"standard": 350, "express": 700, "pickup": 0}'::jsonb),
('store_info', '{"name": "INARA", "email": "info@inarajewels.lk", "phone": "+94 77 123 4567", "address": "Colombo, Sri Lanka"}'::jsonb),
('currency', '"LKR"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- RLS policies
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Admin policies for banners
CREATE POLICY "Admin can manage banners" ON banners FOR ALL USING (public.is_admin());
CREATE POLICY "Anyone can view active banners" ON banners FOR SELECT USING (is_active = true);

-- Admin policies for discount_codes
CREATE POLICY "Admin can manage discount_codes" ON discount_codes FOR ALL USING (public.is_admin());
CREATE POLICY "Anyone can verify discount codes" ON discount_codes FOR SELECT USING (is_active = true);

-- Admin policies for store_settings
CREATE POLICY "Admin can manage store_settings" ON store_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Anyone can read store_settings" ON store_settings FOR SELECT USING (true);
