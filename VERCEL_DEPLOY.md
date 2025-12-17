# 🚀 Cara Deploy ke Vercel

Panduan lengkap untuk deploy project ini ke Vercel.

## ⚠️ PENTING: Set Environment Variables SEBELUM Deploy!

Environment variables **HARUS** di-set di Vercel sebelum deploy, atau build akan gagal atau aplikasi tidak akan berjalan dengan benar.

---

## Step 1: Set Environment Variables di Vercel

### 1.1 Buka Vercel Dashboard
1. Login ke [Vercel](https://vercel.com)
2. Pilih project kamu atau create new project
3. Klik **Settings** → **Environment Variables**

### 1.2 Tambahkan Semua Environment Variables

Klik **Add New** dan tambahkan satu per satu:

#### 1. NEXT_PUBLIC_SUPABASE_URL
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://xxxxx.supabase.co` (dari Supabase Dashboard)
- **Environment**: `Production`, `Preview`, `Development` (centang semua)

#### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (anon public key dari Supabase)
- **Environment**: `Production`, `Preview`, `Development` (centang semua)

#### 3. SUPABASE_SERVICE_ROLE_KEY
- **Key**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (service_role key dari Supabase - SECRET!)
- **Environment**: `Production`, `Preview`, `Development` (centang semua)

#### 4. DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: `postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres` (dari Supabase)
- **Environment**: `Production`, `Preview`, `Development` (centang semua)

#### 5. ADMIN_PASSWORD
- **Key**: `ADMIN_PASSWORD`
- **Value**: `your_strong_password_here` (password untuk admin routes)
- **Environment**: `Production`, `Preview`, `Development` (centang semua)

#### 6. NEXT_PUBLIC_APP_URL (Optional)
- **Key**: `NEXT_PUBLIC_APP_URL`
- **Value**: `https://your-project.vercel.app` (URL production kamu)
- **Environment**: `Production` saja

---

## Step 2: Deploy Project

### Cara 1: Deploy via Git (Recommended)
1. Push code ke GitHub/GitLab/Bitbucket
2. Di Vercel, klik **Add New** → **Project**
3. Import repository kamu
4. Vercel akan auto-detect Next.js
5. Klik **Deploy** (pastikan environment variables sudah di-set!)

### Cara 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Untuk production
vercel --prod
```

---

## Step 3: Verifikasi Deploy

Setelah deploy selesai:

1. ✅ Buka URL production kamu
2. ✅ Test homepage bisa diakses
3. ✅ Test menu bisa dilihat
4. ✅ Test order bisa dibuat
5. ✅ Test admin panel (akan muncul password prompt)

---

## 🔍 Troubleshooting

### Error: "Missing Supabase environment variables"
**Penyebab**: Environment variables belum di-set di Vercel

**Solusi**: 
1. Pastikan semua env vars sudah di-set di Vercel Dashboard
2. Set untuk environment yang benar (Production/Preview/Development)
3. Redeploy project setelah set env vars

### Error saat Build: "Missing Supabase environment variables"
**Penyebab**: Build time validation failed

**Solusi**: 
- Environment variables sudah harus di-set SEBELUM build
- Jika masih error, cek apakah env vars sudah benar di Vercel Dashboard

### Admin panel tidak meminta password
**Penyebab**: `ADMIN_PASSWORD` belum di-set

**Solusi**: Set `ADMIN_PASSWORD` di Vercel environment variables

### Aplikasi berjalan tapi tidak bisa connect ke database
**Penyebab**: Supabase env vars salah atau DATABASE_URL salah

**Solusi**: 
1. Double check semua Supabase credentials
2. Pastikan DATABASE_URL format benar
3. Pastikan Supabase project masih aktif

---

## 📋 Checklist Sebelum Deploy

- [ ] Semua environment variables sudah di-set di Vercel
- [ ] NEXT_PUBLIC_SUPABASE_URL sudah benar
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY sudah benar
- [ ] SUPABASE_SERVICE_ROLE_KEY sudah benar (SECRET!)
- [ ] DATABASE_URL sudah benar
- [ ] ADMIN_PASSWORD sudah di-set
- [ ] Code sudah di-push ke git repository
- [ ] Test local build berhasil: `npm run build`

---

## 🔐 Security Reminder

- ✅ Jangan commit `.env.local` ke git
- ✅ Semua secrets harus di-set di Vercel Environment Variables
- ✅ Jangan share environment variables dengan orang lain
- ✅ ADMIN_PASSWORD harus kuat dan unik

---

## 📚 Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Docs](https://supabase.com/docs)

---

**Selamat Deploy! 🚀**

