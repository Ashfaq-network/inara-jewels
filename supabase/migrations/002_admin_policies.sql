-- Admin RLS Policies for Inara Jewels
-- Run this in Supabase SQL Editor

-- Helper function: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix payment_method CHECK constraint to include bank_transfer and card
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check
  CHECK (payment_method IN ('stripe', 'payhere', 'cod', 'bank_transfer', 'card'));

-- Products: Admin can insert, update, delete
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (is_admin());

-- Categories: Admin can insert, update, delete
CREATE POLICY "Admins can insert categories" ON categories
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories" ON categories
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete categories" ON categories
  FOR DELETE USING (is_admin());

-- Orders: Admin can view all, update status
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (is_admin());

-- Order Items: Admin can view all
CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (is_admin());

-- Order Status History: Admin can insert
CREATE POLICY "Admins can insert status history" ON order_status_history
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can view all status history" ON order_status_history
  FOR SELECT USING (is_admin());

-- Reviews: Admin can delete inappropriate reviews
CREATE POLICY "Admins can delete reviews" ON reviews
  FOR DELETE USING (is_admin());

-- Allow anon to insert orders (for guest checkout)
CREATE POLICY "Anyone can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert status history" ON order_status_history
  FOR INSERT WITH CHECK (true);

-- Allow anon to view orders by order_number (for order tracking)
CREATE POLICY "Anyone can view orders by number" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view order items" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view status history" ON order_status_history
  FOR SELECT USING (true);
