-- Add new bracelet image to Bloom Charm Bracelet
-- Run this in Supabase SQL Editor

UPDATE products 
SET images = ARRAY['/images/products/bracelet-new-1.jpg', '/images/products/bracelet-new-6.jpg'] 
WHERE slug = 'bloom-charm-bracelet';
