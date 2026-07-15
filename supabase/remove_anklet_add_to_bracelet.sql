-- 1. Delete the anklet product
DELETE FROM products WHERE slug = 'charm-anklet';

-- 2. Add anklet image to Bloom Charm Bracelet
UPDATE products 
SET images = ARRAY['/images/products/bracelet-new-1.jpg', '/images/products/bracelet-new-6.jpg', '/images/products/anklet-new-1.jpg'] 
WHERE slug = 'bloom-charm-bracelet';
