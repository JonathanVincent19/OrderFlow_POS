# Setup Environment Variables (.env.local)

## ⚠️ PENTING: File `.env.local` kosong!

File `.env.local` ada tapi belum berisi credentials. Ikuti langkah berikut:

## Step 1: Ambil Credentials dari Supabase

1. Buka **Supabase Dashboard** → Pilih project kamu
2. Buka **Project Settings** (ikon gear di sidebar kiri) → **API**

### Ambil 3 nilai berikut:

1. **Project URL**
   - Copy nilai di bagian "Project URL"
   - Format: `https://xxxxx.supabase.co`

2. **anon public key**
   - Copy nilai di bagian "Project API keys" → **anon public**
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **service_role key** (secret!)
   - Copy nilai di bagian "Project API keys" → **service_role** (yang secret)
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ⚠️ JANGAN share key ini ke publik!

### Ambil Database Connection String:


4. Buka **Project Settings** → **Database**
5. Scroll ke bagian **Connection string**
6. Pilih tab **URI**
7. Copy connection string yang muncul
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - **Jika password kosong**: Reset password dulu di Database settings → Reset Database Password

---

## Step 2: Isi File `.env.local`

Buka file `.env.local` di project root dan isi dengan format berikut:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database URL (for Prisma)
DATABASE_URL=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**GANTI semua `xxxxx` dan `your_password` dengan nilai yang benar dari Supabase!**

---

## Step 3: Restart Development Server

Setelah file `.env.local` diisi:

1. **Stop server** yang sedang running (Ctrl+C di terminal)
2. **Restart server**:
   ```bash
   npm run dev
   ```
3. Refresh browser di `http://localhost:3000`

---

## ✅ Verifikasi

Setelah restart, coba akses:
- `http://localhost:3000/api/menu`
- Harusnya return JSON (bukan error page)

Jika masih error, cek:
- Pastikan semua environment variables sudah diisi
- Pastikan tidak ada spasi di awal/akhir nilai
- Pastikan password database benar
- Restart server setelah update `.env.local`

