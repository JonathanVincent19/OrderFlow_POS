# ⚠️ PENTING: Cek Environment Variables

## Masalah yang Terjadi

Error menunjukkan bahwa **Supabase URL salah**. API mengembalikan HTML error page (404) dari Supabase dashboard, bukan dari project API kamu.

## Solusi: Perbaiki `.env.local`

### Step 1: Cek File `.env.local`

Buka file `.env.local` di root project dan pastikan formatnya seperti ini:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ovgoilbekmbhwxyyslny.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.ovgoilbekmbhwxyyslny.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Pastikan URL Format Benar

**✅ BENAR:**
```
NEXT_PUBLIC_SUPABASE_URL=https://ovgoilbekmbhwxyyslny.supabase.co
```

**❌ SALAH:**
```
NEXT_PUBLIC_SUPABASE_URL=https://supabase.com/dashboard/project/...
NEXT_PUBLIC_SUPABASE_URL=https://app.supabase.com/...
NEXT_PUBLIC_SUPABASE_URL=ovgoilbekmbhwxyyslny.supabase.co (tanpa https://)
```

### Step 3: Ambil URL yang Benar dari Supabase

1. Buka **Supabase Dashboard**
2. Pilih **project kamu**
3. Buka **Project Settings** (ikon gear) → **API**
4. Di bagian **Project URL**, copy URL yang ada
   - Format harus: `https://xxxxx.supabase.co`
   - **JANGAN** copy URL dari address bar browser (yang ada `/dashboard` di akhir)

### Step 4: Restart Server

Setelah update `.env.local`:

1. **Stop server** (Ctrl+C)
2. **Restart**:
   ```bash
   npm run dev
   ```
3. **Refresh browser**

---

## Verifikasi

Setelah restart, cek dengan:

```bash
curl http://localhost:3000/api/menu
```

Harusnya return **JSON**, bukan HTML. Contoh response yang benar:

```json
{
  "success": true,
  "data": {
    "categories": [...],
    "allItems": [...]
  }
}
```

atau jika belum ada data:

```json
{
  "success": true,
  "data": {
    "categories": [],
    "allItems": []
  }
}
```

Jika masih return HTML, berarti URL masih salah!

