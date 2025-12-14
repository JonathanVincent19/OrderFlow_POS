# Panduan Menambahkan Image Menu

## Opsi 1: Menggunakan Supabase Storage (Recommended)

### Step 1: Setup Supabase Storage
1. Buka Supabase Dashboard → Storage
2. Buat bucket baru bernama `menu-images`
3. Set bucket menjadi **Public** (agar image bisa diakses tanpa authentication)

### Step 2: Upload Image
1. Klik bucket `menu-images`
2. Upload image Anda (format: JPG, PNG, atau WebP)
3. Copy **Public URL** dari image yang sudah diupload

### Step 3: Update Database
Gunakan SQL Editor di Supabase untuk update `image_url`:

```sql
-- Contoh: Update image untuk menu item tertentu
UPDATE menu_items 
SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/menu-images/nasi-putih.jpg'
WHERE id = '00000000-0000-0000-0000-000000000011';

-- Atau update beberapa menu sekaligus
UPDATE menu_items 
SET image_url = 'https://your-project.supabase.co/storage/v1/object/public/menu-images/ceciwis-bawang-putih.jpg'
WHERE name = 'Ceciwis Bawang Putih';
```

---

## Opsi 2: Menggunakan URL External

Jika Anda sudah punya image di hosting lain (Cloudinary, Imgur, dll):

```sql
UPDATE menu_items 
SET image_url = 'https://example.com/images/nasi-putih.jpg'
WHERE id = '00000000-0000-0000-0000-000000000011';
```

---

## Opsi 3: Melalui Admin Page (Coming Soon)

Admin page akan memiliki fitur upload image langsung tanpa perlu akses database manual.

---

## Format Image yang Disarankan

- **Format**: JPG, PNG, atau WebP
- **Ukuran**: Max 2MB per image
- **Resolusi**: 800x600px atau 1200x900px (ratio 4:3)
- **Nama file**: Gunakan lowercase dengan dash (contoh: `nasi-putih.jpg`)

---

## Contoh Update Multiple Images

```sql
-- Update semua menu items sekaligus
UPDATE menu_items 
SET image_url = CASE 
    WHEN name = 'Nasi Putih' THEN 'https://your-project.supabase.co/storage/v1/object/public/menu-images/nasi-putih.jpg'
    WHEN name = 'Ceciwis Bawang Putih' THEN 'https://your-project.supabase.co/storage/v1/object/public/menu-images/ceciwis.jpg'
    WHEN name = 'Infuse Water' THEN 'https://your-project.supabase.co/storage/v1/object/public/menu-images/infuse-water.jpg'
    ELSE image_url
END
WHERE name IN ('Nasi Putih', 'Ceciwis Bawang Putih', 'Infuse Water');
```

---

## Testing

Setelah update, cek apakah image muncul:
1. Refresh halaman menu (`/`)
2. Image seharusnya muncul di card menu item
3. Jika tidak muncul, pastikan URL image bisa diakses (copy URL dan buka di browser baru)

---

## Troubleshooting

**Image tidak muncul:**
- Pastikan URL image benar dan bisa diakses
- Pastikan image format didukung browser (JPG, PNG, WebP)
- Cek console browser untuk error CORS (jika menggunakan external URL)

**Image terlalu besar:**
- Compress image terlebih dahulu (gunakan tools seperti TinyPNG)
- Max recommended: 500KB per image

