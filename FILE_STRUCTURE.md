# Struktur File dan Folder - Web Order System

## 📁 Struktur File Saat Ini

```
web_order/
├── app/
│   ├── page.tsx                    # Customer: Menu browsing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   │
│   ├── cart/
│   │   └── page.tsx                # Customer: Shopping cart
│   │
│   ├── checkout/
│   │   └── page.tsx                # Customer: Checkout form
│   │
│   ├── order-success/
│   │   └── page.tsx                # Customer: Order confirmation
│   │
│   ├── kasir/
│   │   └── page.tsx                # Cashier: Pending orders dashboard
│   │
│   ├── kitchen/
│   │   └── page.tsx                # Kitchen: Order queue dashboard
│   │
│   ├── admin/
│   │   └── page.tsx                # Admin: Menu management
│   │
│   └── api/
│       ├── menu/
│       │   └── route.ts            # API: Get menu items & categories
│       └── orders/
│           ├── route.ts            # API: Create & list orders
│           └── [id]/
│               └── route.ts        # API: Update/Delete order by ID
│
├── lib/
│   ├── supabase.ts                 # Supabase client configuration
│   └── store.ts                    # Zustand cart store
│
├── prisma/
│   └── schema.prisma               # Database schema
│
└── supabase_schema.sql             # SQL schema for Supabase
```

---

## 💡 Rekomendasi Rename (Opsional)

Jika ingin lebih jelas, bisa rename:

### Option 1: Tambahkan prefix untuk clarity
```
app/
├── (customer)/
│   ├── menu/page.tsx               # Customer menu
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   └── order-success/page.tsx
│
├── (staff)/
│   ├── cashier/page.tsx            # atau kasir/page.tsx
│   ├── kitchen/page.tsx
│   └── admin/page.tsx
```

### Option 2: Keep current (Recommended)
Struktur saat ini sudah cukup jelas karena:
- Next.js App Router convention menggunakan folder name sebagai route
- Nama folder sudah deskriptif (`kasir`, `kitchen`, `admin`)
- File `page.tsx` adalah convention Next.js

---

## 🎯 Current File Purposes

| File/Folder | Purpose | User Role |
|------------|---------|-----------|
| `app/page.tsx` | Menu browsing, add to cart | Customer |
| `app/cart/page.tsx` | View cart, manage items | Customer |
| `app/checkout/page.tsx` | Order form, place order | Customer |
| `app/order-success/page.tsx` | Order confirmation | Customer |
| `app/kasir/page.tsx` | Pending orders, accept/reject | Cashier |
| `app/kitchen/page.tsx` | Order queue, update status | Kitchen |
| `app/admin/page.tsx` | Manage menu & categories | Admin |
| `lib/supabase.ts` | Database client setup | - |
| `lib/store.ts` | Cart state management | - |
| `app/api/menu/route.ts` | Menu API endpoints | - |
| `app/api/orders/route.ts` | Orders API endpoints | - |

---

## ✅ Rekomendasi: Tetap Pakai Struktur Saat Ini

Alasan:
1. ✅ Mengikuti Next.js 14 App Router convention
2. ✅ Nama folder sudah jelas dan deskriptif
3. ✅ Route URL sudah konsisten (`/kasir`, `/kitchen`, `/admin`)
4. ✅ Mudah di-maintain dan di-scale

Jika ingin lebih organized, bisa tambahkan komentar di file atau buat README per folder.

