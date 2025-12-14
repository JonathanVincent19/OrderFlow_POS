-- =====================================================
-- SUPABASE DATABASE SCHEMA
-- Run this SQL in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- MENU CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MENU ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255),
    table_number VARCHAR(50),
    order_notes TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'preparing', 'ready', 'completed', 'rejected')),
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_order_time DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_accepted_at ON orders(accepted_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON order_items(menu_item_id);

-- =====================================================
-- TRIGGER: Update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_menu_categories_updated_at 
    BEFORE UPDATE ON menu_categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at 
    BEFORE UPDATE ON menu_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================
-- Insert sample categories
INSERT INTO menu_categories (id, name, description, sort_order) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Family Style Menu', 'Menu untuk keluarga', 1),
    ('00000000-0000-0000-0000-000000000002', 'NEW MENU', 'Menu baru', 2),
    ('00000000-0000-0000-0000-000000000003', 'Minuman', 'Berbagai minuman', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (id, category_id, name, description, price, is_available, sort_order) VALUES
    ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Nasi Putih', 'Nasi putih dengan bawang goreng', 6000, true, 1),
    ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Ceciwis Bawang Putih', 'Ceciwis dengan bawang putih (untuk 2-3 orang)', 24000, true, 2),
    ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', 'Infuse Water', 'Infuse water segar (untuk 2 orang)', 27000, true, 1)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- Uncomment if you want to enable RLS
-- =====================================================
-- ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Example policies (adjust based on your needs):
-- Allow anyone to read menu items
-- CREATE POLICY "Allow public read on menu_items" ON menu_items FOR SELECT USING (true);
-- CREATE POLICY "Allow public read on menu_categories" ON menu_categories FOR SELECT USING (true);

