# Web Order System - Cafe Ordering Platform

QR code-based ordering system for cafe with separate interfaces for customers, cashier, and kitchen.

## 🚀 Getting Started

### 1. Setup Supabase Database

1. Create a new project in [Supabase](https://supabase.com)
2. Go to SQL Editor
3. Copy and run the SQL from `supabase_schema.sql`
4. This will create all necessary tables with sample data

### 2. Get Supabase Credentials

1. Go to Project Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

3. Go to Project Settings → Database
4. Copy the **Connection string** (URI format) → `DATABASE_URL`

### 3. Setup Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Generate Prisma Client

```bash
npm run db:generate
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
web_order/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (customer)/        # Customer pages
│   ├── kasir/             # Cashier pages
│   ├── kitchen/           # Kitchen pages
│   └── admin/             # Admin pages (future)
├── components/            # React components
├── lib/                   # Utilities
│   └── supabase.ts       # Supabase client
├── prisma/                # Prisma schema
│   └── schema.prisma
└── supabase_schema.sql    # SQL schema for Supabase
```

## 🗄️ Database Schema

- **menu_categories**: Menu categories
- **menu_items**: Individual menu items
- **orders**: Customer orders
- **order_items**: Items in each order

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io (to be implemented)

## 📝 Features

### Customer Flow
- [ ] Browse menu by categories
- [ ] Add items to cart
- [ ] Checkout with customer information
- [ ] Payment at cashier

### Cashier Interface
- [ ] View pending orders
- [ ] Input customer name & table number
- [ ] Accept/Reject orders

### Kitchen Interface
- [ ] View order queue
- [ ] Update order status (Preparing → Ready)

### Admin Interface
- [ ] Manage menu items
- [ ] Update availability
- [ ] View statistics

## 🔄 Next Steps

1. ✅ Database schema created
2. ✅ Supabase connection setup
3. ⏳ API routes implementation
4. ⏳ Customer UI (menu browsing, cart)
5. ⏳ Cashier UI (pending orders, accept/reject)
6. ⏳ Kitchen UI (order queue, status updates)
7. ⏳ Real-time updates (WebSocket)

# OrderFlow_POS
