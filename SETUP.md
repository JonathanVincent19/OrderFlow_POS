# Setup Instructions

## Step 1: Setup Supabase Database

1. Create a new project di [Supabase](https://supabase.com)
2. Buka **SQL Editor** di dashboard
3. Copy semua isi dari file `supabase_schema.sql`
4. Paste dan **Run** di SQL Editor
5. Database tables sudah dibuat + ada sample data

## Step 2: Get Supabase Credentials

### Project URL & API Keys:
1. Buka **Project Settings** → **API**
2. Copy:
   - **Project URL** → untuk `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → untuk `SUPABASE_SERVICE_ROLE_KEY`

### Database Connection String:
1. Buka **Project Settings** → **Database**
2. Scroll ke bagian **Connection string**
3. Pilih tab **URI**
4. Copy connection string → untuk `DATABASE_URL`
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - Ganti `[YOUR-PASSWORD]` dengan database password kamu (bisa di-reset di Database settings)

## Step 3: Create Environment File

Buat file `.env.local` di root project dengan isi:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URL (for Prisma)
DATABASE_URL=postgresql://postgres:your_password@db.your_project_ref.supabase.co:5432/postgres

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**PENTING:** Replace semua `your_*` dengan nilai yang benar dari Supabase!

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Generate Prisma Client

```bash
npm run db:generate
```

Ini akan generate TypeScript types dari Prisma schema.

## Step 6: Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Troubleshooting

### Error: Missing Supabase environment variables
→ Pastikan file `.env.local` sudah dibuat dan semua variabel sudah diisi

### Error: Database connection failed
→ Cek DATABASE_URL, pastikan password dan project ref sudah benar

### Error: Table not found
→ Pastikan SQL schema sudah di-run di Supabase SQL Editor

