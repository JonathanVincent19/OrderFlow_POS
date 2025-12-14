-- =====================================================
-- MANY-TO-MANY RELATIONSHIP FOR MENU ITEMS & CATEGORIES
-- Run this SQL in Supabase SQL Editor if you want items to belong to multiple categories
-- =====================================================

-- Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS menu_item_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(menu_item_id, category_id) -- Prevent duplicate associations
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_item_categories_menu_item ON menu_item_categories(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_categories_category ON menu_item_categories(category_id);

-- Optional: Migrate existing data from category_id to junction table
-- This will copy existing category_id relationships to the new junction table
INSERT INTO menu_item_categories (menu_item_id, category_id)
SELECT id, category_id 
FROM menu_items 
WHERE category_id IS NOT NULL
ON CONFLICT (menu_item_id, category_id) DO NOTHING;

-- Note: After migration, you may want to:
-- 1. Keep category_id for backward compatibility OR
-- 2. Drop category_id column (but this requires updating all code first)

-- =====================================================
-- EXAMPLE QUERIES FOR MANY-TO-MANY:
-- =====================================================

-- Get all items with their categories
-- SELECT 
--     mi.*,
--     array_agg(c.name) as categories
-- FROM menu_items mi
-- LEFT JOIN menu_item_categories mic ON mi.id = mic.menu_item_id
-- LEFT JOIN menu_categories c ON mic.category_id = c.id
-- GROUP BY mi.id;

-- Get items by category
-- SELECT mi.*
-- FROM menu_items mi
-- INNER JOIN menu_item_categories mic ON mi.id = mic.menu_item_id
-- WHERE mic.category_id = 'category-uuid-here';

-- Add item to category
-- INSERT INTO menu_item_categories (menu_item_id, category_id) 
-- VALUES ('item-uuid', 'category-uuid');

-- Remove item from category
-- DELETE FROM menu_item_categories 
-- WHERE menu_item_id = 'item-uuid' AND category_id = 'category-uuid';

