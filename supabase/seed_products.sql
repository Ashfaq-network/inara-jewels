-- CLEANUP: Delete all existing products, then reseed with real images only
-- Run this in Supabase SQL Editor

DELETE FROM products;

INSERT INTO products (name, slug, description, price, compare_at_price, images, colors, rating, review_count, stock, category_id, is_featured, is_new, is_best_seller) VALUES
('Eternal Stone Necklace', 'eternal-stone-necklace', 'Elegant stone necklace in rose gold. Perfect for everyday elegance.', 4500, 6000, ARRAY['/images/products/necklace-new-1.jpg'], ARRAY['#B76E79','#C0C0C0'], 4.80, 124, 25, (SELECT id FROM categories WHERE slug='necklaces'), true, true, false),
('Dainty Stone Necklace', 'dainty-stone-necklace', 'Delicate stone pendant on a fine rose gold chain.', 3200, 4500, ARRAY['/images/products/necklace-new-2.jpg'], ARRAY['#B76E79','#FFD700'], 4.65, 89, 30, (SELECT id FROM categories WHERE slug='necklaces'), false, true, false),
('Crystal Drop Earrings', 'crystal-drop-earrings', 'Graceful crystal drop earrings in rose gold.', 5500, 7000, ARRAY['/images/products/earrings-new-1.jpg'], ARRAY['#B76E79','#C0C0C0'], 4.88, 178, 22, (SELECT id FROM categories WHERE slug='earrings'), true, true, true),
('Bloom Charm Bracelet', 'bloom-charm-bracelet', 'Delicate charm bracelet with floral accents.', 3500, 5000, ARRAY['/images/products/bracelet-new-1.jpg'], ARRAY['#B76E79','#C0C0C0'], 4.72, 112, 40, (SELECT id FROM categories WHERE slug='bracelets'), true, true, false),
('Minimal Sparkle Bracelet', 'minimal-sparkle-bracelet', 'Ultra-fine chain bracelet with a single crystal.', 2800, 3800, ARRAY['/images/products/bracelet-new-2.jpg'], ARRAY['#C0C0C0','#B76E79'], 4.80, 167, 45, (SELECT id FROM categories WHERE slug='bracelets'), false, false, false),
('Classic Bangle', 'classic-bangle', 'Elegant twisted rope design bangle in rose gold.', 4200, 5500, ARRAY['/images/products/bracelet-new-3.jpg'], ARRAY['#B76E79','#FFD700'], 4.60, 95, 30, (SELECT id FROM categories WHERE slug='bracelets'), false, false, true),
('Twisted Rope Bangle', 'twisted-rope-bangle', 'Bold twisted rope bangle. A statement piece.', 4800, 6200, ARRAY['/images/products/bracelet-new-4.jpg'], ARRAY['#B76E79'], 4.65, 102, 28, (SELECT id FROM categories WHERE slug='bracelets'), false, true, false),
('Dainty Chain Bracelet', 'dainty-chain-bracelet', 'Dainty layered chain bracelet.', 3800, 5000, ARRAY['/images/products/bracelet-new-5.jpg'], ARRAY['#C0C0C0','#B76E79','#FFD700'], 4.75, 134, 35, (SELECT id FROM categories WHERE slug='bracelets'), true, false, true),
('Radiant Ring', 'radiant-ring', 'Stunning radiant ring with crystal accents.', 5800, 7500, ARRAY['/images/products/ring-new-1.jpg'], ARRAY['#B76E79','#C0C0C0'], 4.90, 156, 15, (SELECT id FROM categories WHERE slug='rings'), true, false, true),
('Charm Anklet', 'charm-anklet', 'Delicate ankle chain with tiny heart charm.', 2200, 3000, ARRAY['/images/products/anklet-new-1.jpg'], ARRAY['#B76E79','#C0C0C0'], 4.55, 56, 30, (SELECT id FROM categories WHERE slug='anklets'), false, true, false);
