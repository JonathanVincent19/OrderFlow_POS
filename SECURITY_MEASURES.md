# 🔒 Security Measures & Protection

Dokumen ini menjelaskan semua security measures yang telah diimplementasikan untuk melindungi aplikasi dari user yang ingin merusak atau memanipulasi data.

---

## ✅ Protection yang Sudah Diimplementasikan

### 1. **Input Validation & Sanitization**

Semua input dari user divalidasi dan di-sanitize sebelum diproses:

- ✅ **String Sanitization**: Menghapus karakter berbahaya seperti `<`, `>`, `javascript:`, event handlers
- ✅ **Length Validation**: Membatasi panjang input (name: 200 chars, description: 1000 chars)
- ✅ **Type Validation**: Memastikan tipe data sesuai (number, string, boolean, dll)
- ✅ **UUID Validation**: Memvalidasi format UUID untuk ID
- ✅ **Price Validation**: Memastikan harga adalah angka positif yang valid (0 - 10,000,000)
- ✅ **Quantity Validation**: Memastikan quantity adalah integer positif (1-1000)

**File**: `lib/validation.ts`

---

### 2. **Price Manipulation Protection** ⚠️ CRITICAL

**Masalah yang Dicegah**: User bisa mengubah harga item di client-side sebelum mengirim ke server.

**Solusi**:
- Server **tidak mempercayai** harga dari client
- Server selalu fetch harga terbaru dari database sebelum membuat order
- Hanya harga dari database yang digunakan untuk menghitung total

**Contoh**:
```typescript
// ❌ SEBELUM (VULNERABLE):
totalPrice += item.price * item.quantity; // User bisa manipulasi item.price

// ✅ SETELAH (SECURE):
const menuItem = await fetchFromDatabase(item.menu_item_id);
totalPrice += menuItem.price * item.quantity; // Hanya gunakan harga dari database
```

**File**: `app/api/orders/route.ts` (POST method)

---

### 3. **Admin Routes Authentication**

Semua admin routes dilindungi dengan authentication:

- ✅ Admin routes memerlukan password via `Authorization` header
- ✅ Password disimpan di environment variable `ADMIN_PASSWORD`
- ✅ Jika tidak ter-authenticate, return 401 Unauthorized

**Cara Menggunakan**:
```typescript
// Di frontend, tambahkan header saat request ke admin API:
headers: {
  'Authorization': `Bearer ${ADMIN_PASSWORD}`
}
```

**Routes yang Dilindungi**:
- `/api/admin/categories` (POST, PATCH, DELETE)
- `/api/admin/menu-items` (POST, PATCH, DELETE)

**File**: `lib/auth.ts`

---

### 4. **Order Status Validation**

- ✅ Status order divalidasi terhadap daftar status yang valid
- ✅ Mencegah status yang tidak valid seperti `"hacked"`, `"exploited"`, dll

**Valid Status**: `pending`, `accepted`, `preparing`, `ready`, `completed`, `rejected`

---

### 5. **Array Length Limits**

Mencegah abuse dengan membatasi jumlah item:

- ✅ Maximum 50 items per order
- ✅ Maximum 20 categories per menu item

---

### 6. **Database Query Validation**

- ✅ Memverifikasi bahwa ID yang dikirim user benar-benar ada di database
- ✅ Memverifikasi bahwa menu item tersedia sebelum membuat order
- ✅ Memverifikasi bahwa category IDs valid sebelum membuat/update menu item

---

### 7. **XSS (Cross-Site Scripting) Protection**

- ✅ Semua string input di-sanitize untuk menghapus `<script>`, event handlers
- ✅ Menghapus `javascript:` protocol dari URLs
- ✅ Next.js secara default escape output di JSX (tambahan protection)

---

### 8. **SQL Injection Protection**

- ✅ Menggunakan Supabase client yang sudah handle parameterized queries
- ✅ Tidak ada raw SQL queries dengan string concatenation
- ✅ Semua queries menggunakan Supabase query builder

---

## 🔐 Environment Variables untuk Security

Tambahkan ke `.env.local` dan platform deployment:

```env
# Admin password untuk protect admin routes
ADMIN_PASSWORD=your_strong_password_here
```

**⚠️ PENTING**: 
- Gunakan password yang kuat untuk production
- Jangan commit password ke git
- Set di environment variables platform deployment

---

## 📋 Checklist Security

Sebelum deploy, pastikan:

- [ ] `ADMIN_PASSWORD` sudah di-set di environment variables
- [ ] Semua API routes sudah menggunakan validation
- [ ] Price manipulation sudah dicegah (orders API)
- [ ] Admin routes sudah protected dengan auth
- [ ] Input length limits sudah di-set
- [ ] UUID validation sudah diimplementasikan
- [ ] Status validation sudah ada

---

## 🧪 Testing Security

### Test Price Manipulation:
```bash
# Try to create order with manipulated price
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "menu_item_id": "valid-uuid",
      "quantity": 1,
      "price": 0.01  // Try to manipulate price
    }]
  }'

# Should use server-side price, not 0.01
```

### Test Admin Auth:
```bash
# Try to access admin route without auth
curl -X POST http://localhost:3000/api/admin/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'

# Should return 401 Unauthorized

# Try with auth
curl -X POST http://localhost:3000/api/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_admin_password" \
  -d '{"name": "Test"}'

# Should work
```

### Test Input Validation:
```bash
# Try with invalid UUID
curl -X PATCH http://localhost:3000/api/orders/invalid-id \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Should return 400 Bad Request

# Try with XSS attempt
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "<script>alert(\"XSS\")</script>",
    "items": [...]
  }'

# Script tags should be removed
```

---

## 🚨 Known Limitations & Recommendations

### Current Implementation (Portfolio/Demo):
- **Admin Auth**: Menggunakan simple password-based auth via header
- **Rate Limiting**: Belum diimplementasikan (bisa ditambahkan jika diperlukan)
- **CORS**: Menggunakan Next.js default (bisa dikonfigurasi jika diperlukan)
- **Session Management**: Tidak ada (admin auth via header setiap request)

### Untuk Production:
1. **Implementasi Proper Authentication**:
   - Gunakan Supabase Auth atau NextAuth.js
   - JWT tokens dengan expiration
   - Refresh tokens

2. **Rate Limiting**:
   - Tambahkan rate limiting untuk prevent abuse
   - Bisa menggunakan middleware atau service seperti Upstash Redis

3. **CSRF Protection**:
   - Tambahkan CSRF tokens untuk state-changing operations

4. **Logging & Monitoring**:
   - Log semua failed authentication attempts
   - Monitor untuk suspicious patterns

5. **Input Validation di Client-side**:
   - Tambahkan validation di frontend juga (sebagai UX improvement)
   - Tapi jangan hanya rely on client-side validation!

---

## 📚 Files yang Terkait

- `lib/validation.ts` - Validation & sanitization utilities
- `lib/auth.ts` - Admin authentication utilities
- `app/api/orders/route.ts` - Orders API dengan price protection
- `app/api/orders/[id]/route.ts` - Order update dengan validation
- `app/api/admin/**/*.ts` - Admin routes dengan auth protection

---

**Last Updated**: $(date)

