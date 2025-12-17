# 🔒 Security Checklist untuk Deploy Portfolio

Dokumen ini berisi checklist lengkap hal-hal yang harus diamankan sebelum deploy project ini ke production.

## ⚠️ PENTING: Baca dan Ikuti Checklist Ini!

---

## 1. ✅ Environment Variables (WAJIB!)

### Yang Harus DIAMANKAN:

#### ❌ JANGAN Pernah Commit ke Git:
- `.env`
- `.env.local`
- `.env.production`
- `.env.development`
- File yang berisi API keys, passwords, atau secrets

#### ✅ Yang Sudah Benar:
- File `.gitignore` sudah termasuk `.env*.local` dan `.env`
- Pastikan tidak ada file `.env*` yang ter-commit

### Verifikasi:
```bash
# Cek apakah ada file .env yang ter-commit di git
git ls-files | grep -E "\.env"

# Jika ada output, HAPUS dari git (tapi jangan delete filenya)
git rm --cached .env.local
```

### Environment Variables yang Diperlukan untuk Deploy:

#### Untuk Platform Deploy (Vercel/Netlify/Railway):
1. **NEXT_PUBLIC_SUPABASE_URL**
   - ✅ AMAN untuk di-expose (public)
   - Format: `https://xxxxx.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - ✅ AMAN untuk di-expose (public key)
   - Ini adalah anon key dari Supabase

3. **SUPABASE_SERVICE_ROLE_KEY** (🚨 SANGAT RAHASIA!)
   - ❌ JANGAN expose ke client-side
   - Hanya digunakan di server-side API routes
   - Hanya set di environment variables platform deploy

4. **DATABASE_URL** (🚨 SANGAT RAHASIA!)
   - ❌ JANGAN expose ke client-side
   - Hanya untuk Prisma di server-side
   - Format: `postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres`

5. **NEXT_PUBLIC_APP_URL** (opsional)
   - ✅ AMAN untuk di-expose
   - Set ke production URL: `https://your-domain.com`

---

## 2. 🔍 Cek Kode untuk Hardcoded Secrets

### Perintah untuk Scan:
```bash
# Cek apakah ada credentials yang hardcoded
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" --exclude-dir=node_modules --exclude-dir=.git .
grep -r "supabase.co" --exclude-dir=node_modules --exclude-dir=.git . | grep -v ".md"
grep -r "postgresql://" --exclude-dir=node_modules --exclude-dir=.git .
```

### Yang Harus Dicek:
- ❌ Tidak ada API keys hardcoded di file `.ts`, `.tsx`, `.js`
- ❌ Tidak ada passwords hardcoded
- ❌ Tidak ada database URLs hardcoded
- ✅ Semua menggunakan `process.env.*`

---

## 3. 📝 File Dokumentasi yang Berisi Contoh Credentials

### File yang Perlu Dibersihkan atau Diperbaiki:

File berikut mungkin berisi contoh credentials atau project-specific info:

1. **CHECK_ENV.md** - Berisi project URL spesifik (`ovgoilbekmbhwxyyslny.supabase.co`)
2. **ENV_SETUP.md** - Berisi contoh credentials format
3. **SETUP.md** - Berisi contoh credentials format
4. **README.md** - Berisi contoh credentials format

### Rekomendasi:
- Ganti semua contoh dengan placeholder generik seperti `xxxxx` atau `your_project_ref`
- Atau hapus file-file dokumentasi setup jika tidak diperlukan untuk portfolio

---

## 4. 🗄️ Database & Supabase Security

### Supabase Row Level Security (RLS):
- ✅ Pastikan RLS policies sudah di-setup dengan benar
- ✅ Pastikan anon key hanya punya akses yang diperlukan
- ✅ Service role key hanya digunakan di server-side

### Database:
- ✅ Pastikan database password kuat
- ✅ Jangan share database URL/credentials

---

## 5. 🌐 Platform-Specific Security

### Jika Deploy di Vercel:
1. Set environment variables di Vercel Dashboard:
   - Project Settings → Environment Variables
   - Set untuk Production, Preview, dan Development jika berbeda

2. Jangan commit `.vercel` folder (sudah ada di `.gitignore` ✅)

### Jika Deploy di Netlify:
1. Set environment variables di Netlify Dashboard:
   - Site settings → Environment variables

### Jika Deploy di Railway/Render:
1. Set environment variables di dashboard platform tersebut

---

## 6. 📦 Dependencies Security

### Perintah untuk Cek Vulnerabilities:
```bash
# Cek vulnerabilities di dependencies
npm audit

# Fix vulnerabilities jika ada
npm audit fix
```

---

## 7. 🔐 API Routes Security

### Pastikan:
- ✅ API routes yang menggunakan `SUPABASE_SERVICE_ROLE_KEY` hanya ada di server-side
- ✅ Tidak ada service role key yang ter-expose ke client
- ✅ Admin routes (jika ada) dilindungi dengan authentication

### File yang Perlu Dicek:
- `app/api/admin/**` - Pastikan routes ini aman
- `lib/supabase.ts` - Pastikan `supabaseAdmin` hanya digunakan di server-side

---

## 8. 🚫 File yang Tidak Boleh Deploy

Pastikan file-file berikut TIDAK ter-deploy:
- `.env.local`
- `.env`
- `.env.*.local`
- `node_modules/`
- `.git/`
- File backup dengan extension `.bak`, `.old`
- File dengan credentials

---

## 9. ✅ Pre-Deploy Checklist

Sebelum deploy, pastikan:

- [ ] Semua environment variables sudah di-set di platform deploy
- [ ] Tidak ada file `.env*` yang ter-commit di git
- [ ] `npm audit` tidak ada critical vulnerabilities
- [ ] Build berhasil: `npm run build`
- [ ] Tidak ada hardcoded secrets di kode
- [ ] File dokumentasi sudah dibersihkan dari info sensitif (jika perlu)
- [ ] Supabase RLS policies sudah benar
- [ ] Test semua fitur utama bekerja

---

## 10. 🔄 Post-Deploy Verification

Setelah deploy:

- [ ] Test aplikasi berjalan normal
- [ ] Cek browser console untuk error
- [ ] Cek network tab untuk request yang tidak ter-authenticate
- [ ] Test fitur-fitur utama (menu, order, admin, dll)
- [ ] Pastikan tidak ada error 500 yang menampilkan stack trace dengan info sensitif

---

## 🎯 Quick Security Test

Jalankan command ini untuk quick check:

```bash
# 1. Cek apakah .env ter-commit
git ls-files | grep -E "\.env" && echo "⚠️ WARNING: .env files found in git!" || echo "✅ OK: No .env files in git"

# 2. Cek hardcoded Supabase keys (exclude .next folder yang adalah build output)
grep -r "eyJhbGc" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude="*.md" . && echo "⚠️ WARNING: Possible hardcoded keys!" || echo "✅ OK: No hardcoded keys found in source code"

# 3. Cek vulnerabilities
npm audit --audit-level=moderate

# 4. Pastikan .next folder tidak ter-commit (build output mengandung env vars)
git ls-files | grep "^\.next/" && echo "⚠️ WARNING: .next folder found in git!" || echo "✅ OK: .next folder not in git"
```

### ⚠️ Catatan Penting:
- File `.env.local` berisi credentials, tapi **SUDAH AMAN** karena ada di `.gitignore`
- Folder `.next/` berisi build output yang mungkin mengandung env vars, pastikan juga ada di `.gitignore`
- Jika file `.next/` ter-commit, **HAPUS** dari git dengan: `git rm -r --cached .next/`

---

## 📚 Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## ⚠️ DISCLAIMER

Ini adalah project portfolio. Pastikan:
1. Tidak ada data sensitif real customer
2. Jika menggunakan demo data, pastikan itu jelas ter-label sebagai demo
3. Jangan gunakan production credentials yang digunakan untuk project real client

---

---

## 🔒 Security Protection Measures

Lihat `SECURITY_MEASURES.md` untuk detail lengkap tentang:

- ✅ Input validation & sanitization
- ✅ Price manipulation protection
- ✅ Admin routes authentication
- ✅ XSS protection
- ✅ SQL injection protection
- ✅ Order status validation
- ✅ Array length limits

**PENTING**: Set `ADMIN_PASSWORD` di environment variables untuk protect admin routes!

---

**Selamat Deploy! 🚀**

