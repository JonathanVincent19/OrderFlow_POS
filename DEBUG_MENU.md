# Debug: Menu Tidak Tampil

## Langkah-langkah Troubleshooting:

### 1. Cek Database di Supabase

1. Buka **Supabase Dashboard** → **Table Editor**
2. Pastikan tables berikut ada:
   - `menu_categories`
   - `menu_items`

### 2. Cek Data di Database

Jika tables kosong, jalankan SQL berikut di **Supabase SQL Editor**:

```sql
-- Check if tables exist and have data
SELECT COUNT(*) as category_count FROM menu_categories;
SELECT COUNT(*) as item_count FROM menu_items;

-- If empty, insert sample data:
INSERT INTO menu_categories (id, name, description, sort_order) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Family Style Menu', 'Menu untuk keluarga', 1),
    ('00000000-0000-0000-0000-000000000002', 'NEW MENU', 'Menu baru', 2),
    ('00000000-0000-0000-0000-000000000003', 'Minuman', 'Berbagai minuman', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, category_id, name, description, price, is_available, sort_order) VALUES
    ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Nasi Putih', 'Nasi putih dengan bawang goreng', 6000, true, 1),
    ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Ceciwis Bawang Putih', 'Ceciwis dengan bawang putih (untuk 2-3 orang)', 24000, true, 2),
    ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', 'Infuse Water', 'Infuse water segar (untuk 2 orang)', 27000, true, 1)
ON CONFLICT (id) DO NOTHING;
```

### 3. Cek API Route

Buka browser dan akses:
```
http://localhost:3000/api/menu
```

Harusnya return JSON dengan format:
```json
{
  "success": true,
  "data": {
    "categories": [...],
    "allItems": [...]
  }
}
```

Jika error, cek:
- Console terminal (dimana `npm run dev` running)
- Pastikan `.env.local` sudah benar
- Pastikan Supabase connection string valid

### 4. Cek Browser Console

1. Buka browser Developer Tools (F12)
2. Tab **Console**
3. Lihat apakah ada error message
4. Tab **Network**
5. Cek request ke `/api/menu` - apa status code dan response?

### 5. Cek Environment Variables

Pastikan file `.env.local` ada dan berisi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

### 6. Restart Development Server

Setelah update `.env.local`, **restart** server:
```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Quick Fix:

Jika semua tables kosong, copy dan jalankan SQL ini di Supabase SQL Editor:

```sql
-- Insert sample categories
INSERT INTO menu_categories (id, name, description, sort_order, is_active) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Family Style Menu', 'Menu untuk keluarga', 1, true),
    ('00000000-0000-0000-0000-000000000002', 'NEW MENU', 'Menu baru', 2, true),
    ('00000000-0000-0000-0000-000000000003', 'Minuman', 'Berbagai minuman', 3, true)
ON CONFLICT DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (id, category_id, name, description, price, is_available, sort_order) VALUES
    ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Nasi Putih', 'Nasi putih dengan bawang goreng', 6000, true, 1),
    ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Ceciwis Bawang Putih', 'Ceciwis dengan bawang putih (untuk 2-3 orang)', 24000, true, 2),
    ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', 'Infuse Water', 'Infuse water segar (untuk 2 orang)', 27000, true, 1)
ON CONFLICT DO NOTHING;
```

Setelah itu refresh halaman `/` di browser.

