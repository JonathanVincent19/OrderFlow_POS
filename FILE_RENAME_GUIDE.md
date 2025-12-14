# Panduan Rename File untuk Clarity

## 📋 Rekomendasi Struktur (Tanpa Mengubah URL)

Struktur saat ini sudah cukup baik. Jika ingin lebih jelas, berikut opsi:

### Option 1: Tambahkan Komentar Header (RECOMMENDED ✅)
Tidak perlu rename, cukup tambahkan komentar di setiap file untuk dokumentasi.

### Option 2: Route Groups (Tidak mengubah URL)
Bisa organize dengan route groups `(customer)`, `(staff)` - ini hanya untuk organization, tidak mengubah URL.

### Option 3: Keep Current (Best Practice ✅)
Struktur Next.js App Router sudah jelas dan standar.

---

## 📁 Struktur File Saat Ini & Penjelasan

### Customer Pages
- `app/page.tsx` → **Customer Menu Page** (URL: `/`)
- `app/cart/page.tsx` → **Customer Cart Page** (URL: `/cart`)
- `app/checkout/page.tsx` → **Customer Checkout Page** (URL: `/checkout`)
- `app/order-success/page.tsx` → **Order Success Page** (URL: `/order-success`)

### Staff Pages
- `app/kasir/page.tsx` → **Cashier Dashboard** (URL: `/kasir`)
- `app/kitchen/page.tsx` → **Kitchen Dashboard** (URL: `/kitchen`)
- `app/admin/page.tsx` → **Admin Panel** (URL: `/admin`)

### API Routes
- `app/api/menu/route.ts` → **Menu API** (GET: `/api/menu`)
- `app/api/orders/route.ts` → **Orders API** (GET, POST: `/api/orders`)
- `app/api/orders/[id]/route.ts` → **Order by ID API** (PATCH, DELETE: `/api/orders/[id]`)

### Utilities
- `lib/supabase.ts` → **Supabase Client Configuration**
- `lib/store.ts` → **Zustand Cart Store**

---

## ✅ Action Items

1. ✅ Tambahkan header comments di setiap file
2. ✅ Buat dokumentasi FILE_STRUCTURE.md
3. ⚠️ Jangan rename folder (akan mengubah URL)

Mau saya tambahkan header comments di semua file?

