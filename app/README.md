# App Directory Structure

## 📁 Folder & File Organization

```
app/
├── page.tsx                    # 🏠 Customer Menu Page (Home)
├── layout.tsx                  # 📐 Root Layout
├── globals.css                 # 🎨 Global Styles
│
├── cart/                       # 🛒 Customer Shopping Cart
│   └── page.tsx
│
├── checkout/                   # 💳 Customer Checkout
│   └── page.tsx
│
├── order-success/              # ✅ Order Confirmation
│   └── page.tsx
│
├── kasir/                      # 💰 Cashier Dashboard
│   └── page.tsx                #    (Accept/Reject Orders)
│
├── kitchen/                    # 👨‍🍳 Kitchen Dashboard
│   └── page.tsx                #    (Order Queue & Status)
│
├── admin/                      # ⚙️ Admin Panel
│   └── page.tsx                #    (Menu Management)
│
└── api/                        # 🔌 API Routes
    ├── menu/
    │   └── route.ts            #    GET /api/menu
    └── orders/
        ├── route.ts            #    GET, POST /api/orders
        └── [id]/
            └── route.ts        #    PATCH, DELETE /api/orders/[id]
```

---

## 📝 Naming Convention

### Pages (Next.js App Router)
- Format: `folder-name/page.tsx`
- URL: `/folder-name`
- Example: `app/cart/page.tsx` → `/cart`

### API Routes
- Format: `api/resource/route.ts`
- Example: `app/api/menu/route.ts` → `/api/menu`

### Dynamic Routes
- Format: `api/resource/[id]/route.ts`
- Example: `app/api/orders/[id]/route.ts` → `/api/orders/[uuid]`

---

## 🎯 Folder Names & Purposes

| Folder | URL | Purpose | User Role |
|--------|-----|---------|-----------|
| `/` | `/` | Menu browsing | Customer |
| `/cart` | `/cart` | Shopping cart | Customer |
| `/checkout` | `/checkout` | Order placement | Customer |
| `/order-success` | `/order-success` | Order confirmation | Customer |
| `/kasir` | `/kasir` | Pending orders | Cashier |
| `/kitchen` | `/kitchen` | Order queue | Kitchen |
| `/admin` | `/admin` | Menu management | Admin |

