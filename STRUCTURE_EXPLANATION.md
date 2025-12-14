# Penjelasan Struktur File & Folder

## 📁 Struktur Folder Saat Ini (Sudah Benar)

### Customer Pages
```
app/
├── page.tsx              → Menu utama (Homepage)
├── cart/page.tsx         → Shopping cart
├── checkout/page.tsx     → Checkout form
└── order-success/page.tsx → Order confirmation
```

### Staff Pages
```
app/
├── kasir/page.tsx        → Dashboard kasir (Cashier)
├── kitchen/page.tsx      → Dashboard kitchen
└── admin/page.tsx        → Admin panel
```

### API Routes
```
app/api/
├── menu/route.ts         → GET menu items
└── orders/
    ├── route.ts          → GET, POST orders
    └── [id]/route.ts     → PATCH, DELETE order by ID
```

---

## 💡 Penjelasan Nama Folder

### Mengapa `kasir` bukan `cashier`?
- **`kasir`** adalah istilah bahasa Indonesia yang umum digunakan
- URL lebih singkat: `/kasir` vs `/cashier`
- Konsisten dengan konteks lokal

### Alternatif Nama (Jika Diperlukan)

Jika ingin lebih deskriptif, bisa rename (tapi URL akan berubah):

**Saat ini:**
- `kasir/` → URL: `/kasir`
- `kitchen/` → URL: `/kitchen`

**Alternatif:**
- `cashier-dashboard/` → URL: `/cashier-dashboard`
- `kitchen-dashboard/` → URL: `/kitchen-dashboard`

**Tapi disarankan tetap pakai nama singkat!**

---

## ✅ Rekomendasi

**Tetap pakai struktur saat ini karena:**
1. ✅ Nama folder sudah jelas dan deskriptif
2. ✅ URL pendek dan mudah diingat
3. ✅ Konsisten dengan naming convention
4. ✅ Mengikuti Next.js App Router best practices

**Tidak perlu rename karena:**
- URL akan berubah jika rename folder
- Nama saat ini sudah cukup jelas
- Header comments sudah menambahkan dokumentasi

---

## 📝 File Naming Best Practices

### Pages
- ✅ `page.tsx` (Next.js convention)
- ✅ Nama folder = route URL
- ✅ Descriptive folder names

### API Routes
- ✅ `route.ts` (Next.js convention)
- ✅ Resource-based naming (`menu`, `orders`)
- ✅ Dynamic routes dengan `[id]`

### Components (jika nanti ada)
- ✅ PascalCase: `MenuCard.tsx`
- ✅ Descriptive names
- ✅ Co-located dengan pages yang menggunakan

