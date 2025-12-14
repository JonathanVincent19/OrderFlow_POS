# UI Design - Kasir & Kitchen Interface

## 1. KASIR INTERFACE

### Layout: Dashboard Pending Orders

**Header Section:**
- Title: "Kasir - Pending Orders"
- Badge counter: jumlah pending orders (contoh: "5 Pending")
- Filter/Refresh button (optional)

**Main Content Area - Order Cards:**

Setiap order ditampilkan dalam card dengan desain:

```
┌─────────────────────────────────────────┐
│ Order #001                   10:23 AM   │
├─────────────────────────────────────────┤
│ Customer Name: [Input Field]            │
│                                         │
│ Table Number: [Input Field]             │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Items:                              │ │
│ │ • Nasi Putih x2         Rp 12.000  │ │
│ │ • Ceciwis Bawang Putih x1 Rp 24.000│ │
│ │ • Infuse Water x1       Rp 27.000  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Total: Rp 63.000                        │
│                                         │
│ [Notes: "Tidak pedas"]                  │
│                                         │
│ [Accept Order]  [Reject/Delete]         │
└─────────────────────────────────────────┘
```

**Fitur:**
- Input field untuk Customer Name (wajib sebelum accept)
- Input field untuk Table Number (wajib sebelum accept)
- List items dengan quantity dan harga
- Total harga yang ditonjolkan (bold, larger font)
- Order notes ditampilkan jika ada
- Timestamp kapan order dibuat
- Tombol Accept (hijau/primary) dan Reject (merah/secondary)
- Setelah Accept, card hilang dari list atau pindah ke "Accepted Orders" section

**State Management:**
- Real-time update saat ada order baru masuk
- Sound notification (optional) untuk order baru
- Auto-refresh atau WebSocket untuk sync

**Empty State:**
Jika tidak ada pending orders, tampilkan:
- Icon empty state
- Text: "Tidak ada pending orders"
- Message: "Order baru akan muncul di sini"

---

## 2. KITCHEN INTERFACE

### Layout: Order Queue

**Header Section:**
- Title: "Kitchen - Order Queue"
- Status filter tabs: [All] [Preparing] [Ready]
- Badge counter per status

**Main Content Area - Order Cards:**

Orders diurutkan berdasarkan waktu accepted (terbaru di atas), dengan status badge:

```
┌─────────────────────────────────────────┐
│ Table #05 | Order #001    [PREPARING]  │
│ Accepted: 10:25 AM                      │
├─────────────────────────────────────────┤
│ Customer: Budi                          │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Items to Prepare:                   │ │
│ │ • Nasi Putih x2                     │ │
│ │ • Ceciwis Bawang Putih x1           │ │
│ │ • Infuse Water x1                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Notes: "Tidak pedas"]                  │
│                                         │
│ [Mark as Ready]  [View Details]         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Table #03 | Order #002      [READY]    │
│ Accepted: 10:20 AM                      │
├─────────────────────────────────────────┤
│ Customer: Sari                          │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Items:                              │ │
│ │ • Nasi Putih x1                     │ │
│ │ • Infuse Water x1                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ✓ Ready to serve                        │
│                                         │
│ [Mark as Completed]                     │
└─────────────────────────────────────────┘
```

**Fitur:**
- Status badge dengan warna berbeda:
  - PREPARING (kuning/orange)
  - READY (hijau)
  - COMPLETED (abu-abu, optional)
- Table number dan Order ID untuk identifikasi
- Customer name untuk referensi
- List items dengan quantities (bold, mudah dibaca)
- Order notes ditampilkan jika ada
- Timestamp kapan order di-accept oleh kasir
- Tombol "Mark as Ready" untuk update status
- Tombol "Mark as Completed" untuk selesai (optional, bisa auto-remove)

**Status Flow:**
1. Order masuk dari kasir → status: PREPARING (auto)
2. Kitchen selesai → klik "Mark as Ready" → status: READY
3. Optional: setelah diambil pelayan → status: COMPLETED atau auto-remove

**Priority/Ordering:**
- Orders diurutkan berdasarkan waktu accepted (terbaru di atas)
- Bisa di-sort manual atau filter by status
- Cards dengan status PREPARING lebih menonjol

**Real-time Updates:**
- Auto-refresh saat ada order baru dari kasir
- Sound notification untuk order baru (optional)
- Visual indicator untuk order yang baru masuk (highlight/flash)

**Empty State:**
- Icon empty state
- Text: "Tidak ada order untuk di proses"
- Message: "Order akan muncul setelah di-accept kasir"

---

## 3. COLOR SCHEME & VISUAL DESIGN

### Color Palette:
- **Primary/Accent**: Orange/Gold (sesuai tema cafe, seperti di referensi: #FB923C / #F97316)
- **Success/Ready**: Green (#22C55E)
- **Warning/Preparing**: Yellow/Orange (#FBBF24)
- **Danger/Reject**: Red (#EF4444)
- **Neutral**: Gray tones untuk background dan text

### Typography:
- Headers: Bold, larger font (18-24px)
- Order details: Medium weight (14-16px)
- Prices: Bold, larger font untuk emphasis
- Timestamps: Smaller, lighter font (12px)

### Spacing & Layout:
- Card padding: 16-20px
- Gap between cards: 12-16px
- Comfortable touch targets untuk buttons (min 44x44px untuk mobile)
- Max width untuk cards: readable di desktop (600-800px)

### Mobile Responsive:
- Stack cards vertically
- Full-width buttons
- Larger touch targets
- Swipe actions (optional) untuk accept/reject

---

## 4. USER FLOW

### Kasir Flow:
1. Lihat pending orders muncul di dashboard
2. Input customer name dan table number
3. Verifikasi items dan total harga
4. Konfirmasi pembayaran dari pelanggan
5. Klik "Accept Order"
6. Order hilang dari pending list, muncul di kitchen

### Kitchen Flow:
1. Lihat order baru muncul di queue (status: PREPARING)
2. Baca detail items yang harus dibuat
3. Proses order sesuai items
4. Setelah selesai, klik "Mark as Ready"
5. Order berubah status menjadi READY
6. Optional: setelah diambil, mark as completed atau auto-remove

---

## 5. ADDITIONAL FEATURES (Optional)

### Untuk Kasir:
- Search/filter orders
- Print receipt (optional)
- View order history
- Statistics (orders per day/hour)

### Untuk Kitchen:
- Timer untuk setiap order (berapa lama sudah di-prepare)
- Filter by table number
- Group orders by table
- Kitchen printer integration (optional)

