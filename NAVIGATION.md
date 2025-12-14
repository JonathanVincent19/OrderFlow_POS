# Cara Mengakses Halaman Kasir, Kitchen, dan Admin

## 📍 URL untuk Setiap Halaman

### Customer (Pelanggan)
- **Menu**: `http://localhost:3000/`
- **Cart**: `http://localhost:3000/cart`
- **Checkout**: `http://localhost:3000/checkout`

### Kasir
- **URL**: `http://localhost:3000/kasir`
- **Fungsi**: 
  - Melihat pending orders
  - Input customer name & table number
  - Accept/Reject orders

### Kitchen
- **URL**: `http://localhost:3000/kitchen`
- **Fungsi**:
  - Melihat order queue
  - Update status order (Preparing → Ready)

### Admin
- **URL**: `http://localhost:3000/admin`
- **Fungsi**:
  - Manage menu items
  - Manage categories
  - Toggle availability menu items

---

## 🚀 Quick Access

Setelah development server running (`npm run dev`), buka browser dan akses:

### Option 1: Manual URL
Ketik langsung di address bar browser:
- `/kasir` → Halaman Kasir
- `/kitchen` → Halaman Kitchen
- `/admin` → Halaman Admin

### Option 2: Dari Halaman Admin
Admin page sudah ada tombol navigasi ke Kasir dan Kitchen di header.

### Option 3: Bookmark
Bookmark URL berikut untuk akses cepat:
- `localhost:3000/kasir`
- `localhost:3000/kitchen`
- `localhost:3000/admin`

---

## 🧪 Testing Flow

### 1. Test Customer Flow
1. Buka `localhost:3000`
2. Pilih menu → Add to cart
3. Klik floating cart di bawah
4. Checkout → Place order

### 2. Test Kasir Flow
1. Buka `localhost:3000/kasir` (di tab baru/device lain)
2. Lihat pending order muncul
3. Input customer name & table number
4. Click "Accept Order"

### 3. Test Kitchen Flow
1. Buka `localhost:3000/kitchen` (di tab baru/device lain)
2. Lihat order yang sudah di-accept kasir
3. Klik "Mark as Ready" setelah selesai prepare

### 4. Test Admin Flow
1. Buka `localhost:3000/admin`
2. Lihat menu items & categories
3. Toggle availability menu items

---

## 💡 Tips

- Gunakan **multiple browser tabs** atau **different devices** untuk simulasi multiple users
- Kasir dan Kitchen akan auto-refresh setiap 5 detik untuk update order baru
- Admin page bisa digunakan untuk manage menu availability secara real-time

---

## 📱 Mobile Access

Untuk test di mobile device yang sama network:

1. Cari IP address komputer kamu:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Akses dari mobile browser:
   - `http://[IP-ADDRESS]:3000/kasir`
   - `http://[IP-ADDRESS]:3000/kitchen`
   - `http://[IP-ADDRESS]:3000/admin`

Contoh: `http://192.168.1.100:3000/kasir`

