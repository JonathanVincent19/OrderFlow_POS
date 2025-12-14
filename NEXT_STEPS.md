# Langkah Selanjutnya Setelah Setup Database

## ✅ Yang Sudah Selesai:
1. ✅ SQL Schema sudah di-run di Supabase
2. ✅ File `.env.local` sudah dibuat dengan credentials

## 🔧 Step 1: Update DATABASE_URL

**PENTING**: File `.env.local` sudah dibuat, tapi kamu perlu update `DATABASE_URL` dengan password database kamu!

1. Buka Supabase Dashboard
2. Buka **Project Settings** → **Database**
3. Scroll ke bagian **Connection string**
4. Pilih tab **URI**
5. Copy connection string yang muncul
6. Buka file `.env.local` di project
7. Ganti baris `DATABASE_URL=...` dengan connection string yang kamu copy

**Jika lupa password database:**
- Di Database settings, ada tombol **Reset Database Password**
- Reset password, lalu update di `.env.local`

---

## 📦 Step 2: Install Dependencies

Buka terminal di folder project, lalu jalankan:

```bash
npm install
```

Ini akan install semua packages yang diperlukan (Next.js, Supabase, Prisma, dll).

---

## 🔨 Step 3: Generate Prisma Client

Setelah install selesai, generate Prisma client untuk TypeScript types:

```bash
npm run db:generate
```

Ini akan generate types dari database schema yang sudah dibuat.

---

## 🚀 Step 4: Test Koneksi Database

Jalankan development server:

```bash
npm run dev
```

Buka browser: [http://localhost:3000](http://localhost:3000)

Jika tidak ada error, berarti koneksi ke Supabase berhasil! ✅

---

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
→ Pastikan file `.env.local` ada di root project dan semua variabel sudah diisi

### Error: "Database connection failed" atau "Invalid connection string"
→ Cek `DATABASE_URL` di `.env.local`, pastikan:
  - Password sudah benar
  - Format connection string sudah benar
  - Tidak ada spasi di awal/akhir

### Error saat `npm install`
→ Pastikan Node.js sudah terinstall (versi 18+)
→ Coba hapus `node_modules` dan `package-lock.json`, lalu `npm install` lagi

### Error: "Table does not exist"
→ Pastikan SQL schema sudah di-run di Supabase SQL Editor
→ Cek di Supabase Dashboard → Table Editor, pastikan tables sudah muncul

---

## 📝 Setelah Semua Berjalan

Setelah server berjalan tanpa error, kita bisa lanjut ke:
1. ✅ API Routes (GET menu, POST order)
2. ✅ Customer UI (menu browsing, cart, checkout)
3. ✅ Kasir UI (pending orders, accept/reject)
4. ✅ Kitchen UI (order queue, status updates)

Katakan kalau sudah berhasil atau ada error yang muncul!

