# ✅ Pre-Deploy Security Checklist

Gunakan checklist ini sebelum deploy untuk memastikan semua security measures sudah benar.

## 🔒 Security Checklist

### 1. Environment Variables
- [ ] `ADMIN_PASSWORD` sudah di-set di platform deployment (Vercel/Netlify/dll)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` sudah di-set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah di-set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` sudah di-set (server-side only)
- [ ] `DATABASE_URL` sudah di-set (server-side only)
- [ ] Semua env vars sudah di-set untuk Production environment

### 2. Code Security
- [ ] Tidak ada file `.env*` yang ter-commit di git
- [ ] Tidak ada hardcoded credentials di code
- [ ] Semua API routes sudah menggunakan validation
- [ ] Admin routes sudah protected dengan auth
- [ ] Price manipulation sudah dicegah

### 3. Build & Test
- [ ] `npm run build` berhasil tanpa error
- [ ] Test semua fitur utama bekerja:
  - [ ] Menu page bisa diakses
  - [ ] Order bisa dibuat
  - [ ] Admin panel meminta password
  - [ ] Admin bisa create/update/delete items
  - [ ] Kasir bisa accept orders
  - [ ] Kitchen bisa update order status

### 4. Admin Password
**PENTING**: Set `ADMIN_PASSWORD` di environment variables!

Di platform deployment (contoh Vercel):
1. Go to Project Settings → Environment Variables
2. Add new variable:
   - Name: `ADMIN_PASSWORD`
   - Value: `your_strong_password_here`
   - Environment: Production (dan Preview jika perlu)

**Catatan**: 
- Saat pertama kali akses `/admin` di production, akan muncul prompt untuk password
- Password akan disimpan di localStorage browser (hanya untuk session ini)
- Untuk portfolio/demo, ini acceptable. Untuk production real app, gunakan proper session management.

---

## 🚀 Deploy Steps

1. **Commit semua changes**:
   ```bash
   git add .
   git commit -m "Add security measures and validation"
   git push
   ```

2. **Deploy ke platform** (Vercel/Netlify/dll)

3. **Set Environment Variables** di platform dashboard

4. **Test setelah deploy**:
   - [ ] Homepage bisa diakses
   - [ ] Menu bisa dilihat
   - [ ] Order bisa dibuat
   - [ ] Admin panel meminta password saat create/update/delete

---

## ✅ Final Verification

Setelah deploy, test:

### Test Customer Flow:
1. ✅ Akses homepage
2. ✅ Add items to cart
3. ✅ Checkout dan create order
4. ✅ Lihat order success page

### Test Admin Flow:
1. ✅ Akses `/admin`
2. ✅ Saat create/update/delete, password prompt muncul
3. ✅ Input password yang benar, operation berhasil
4. ✅ Input password salah atau cancel, operation gagal dengan error

### Test Security:
```bash
# Test admin route tanpa auth (should fail)
curl -X POST https://your-domain.com/api/admin/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'

# Should return: {"success":false,"error":"Unauthorized. Admin access required."}
```

---

## 🎯 Status: READY TO DEPLOY ✅

Jika semua checklist sudah dicentang, aplikasi sudah siap untuk deploy!

---

**Last Updated**: $(date)

