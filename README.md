# 🚀 SIAKAD Starter Template

Starter template lengkap berbasis **Google Apps Script + TailwindCSS + Chart.js** yang siap pakai untuk membuat aplikasi web SPA dengan fitur Login, Dashboard, CRUD, dan Laporan.

---

## 📋 Daftar Isi

1. [Apa yang Ada di Template Ini](#-apa-yang-ada-di-template-ini)
2. [Cara Pakai (Langkah demi Langkah)](#-cara-pakai-langkah-demi-langkah)
3. [Generate Entitas CRUD Baru](#-generate-entitas-crud-baru)
4. [Struktur File Lengkap](#-struktur-file-lengkap)
5. [Penjelasan Setiap Modul](#-penjelasan-setiap-modul)
6. [CLI Generator: generate-crud.js](#-cli-generator-generate-crudjs)
7. [CLI Link Generator: update-crud-link.js](#-cli-link-generator-update-crud-linkjs)
8. [Tips & Troubleshooting](#-tips--troubleshooting)

---

## ✅ Apa yang Ada di Template Ini

| Modul | Sudah Siap? | Keterangan |
|-------|-------------|------------|
| **Login** | ✅ Siap pakai | Sheet `Users` + hash password SHA-256 |
| **Dashboard** | ✅ Template siap | 4 KPI Cards, 2 Chart, Recent Data table |
| **CRUD** | ✅ Generik + CLI Generator | Tinggal generate entitas baru via CLI |
| **Laporan** | ✅ Template siap | Filter + tabel read-only |
| **Helper** | ✅ Siap pakai | `showToast`, `gasRun`, `capitalize`, pagination |
| **Navigasi** | ✅ Siap pakai | Sidebar + menuRegistry + pindahMenu |

---

## 📦 Cara Pakai (Langkah demi Langkah)

### Langkah 1: Copy Starter ke Folder Project Baru

Buka terminal, lalu:

```bash
# Dari folder siakad, copy starter ke folder project baru
cp -r templates/default/starter/ D:/GAS/project-anda/
cd D:/GAS/project-anda/
```

> **Catatan:** Di Windows, folder tujuan akan otomatis dibuat.

### Langkah 2: Buat Google Sheets (Database)

Buka Google Drive → **Buat spreadsheet baru**.

Buat sheet **`Users`** dengan header:
| username | password |
|----------|----------|
| admin | (isi password, nanti di-hash otomatis) |

> **⚠️ Sheet Users WAJIB ada** karena dipakai untuk login. Sheet entitas lain dibuat nanti sesuai kebutuhan.

### Langkah 3: Setup Clasp & Push

```bash
# Install clasp (jika belum)
npm install -g @google/clasp

# Login ke Google
clasp login

# Buat project Apps Script baru
clasp create --title "Nama Aplikasi Anda"

# Copy scriptId yang muncul ke .clasp.json
# Buka .clasp.json → ganti "scriptId" dengan ID dari clasp create

# Push semua file ke Apps Script
clasp push
```

### Langkah 4: Konfigurasi Spreadsheet

```bash
# Buka editor Apps Script
clasp open
```

Di editor Apps Script:
1. **Jalankan fungsi `setupConfig()`** sekali dari editor (Run → setupConfig)
2. **Ganti `SPREADSHEET_ID`** dengan ID spreadsheet Anda (URL spreadsheet: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`)
3. Jalankan lagi `setupConfig()` untuk menyimpan

### Langkah 5: Buat User Admin

Di editor Apps Script, buka **Execution Log**, lalu jalankan kode ini di **editor** (bukan di log):

```javascript
function addUser() {
  var sheet = ensureSheet('Users', ['username', 'password']);
  sheet.appendRow(['admin', hashPassword('admin123')]);
  console.log('User admin berhasil ditambahkan!');
}
```

> **Atau** isi manual di sheet: username = `admin`, password = `admin123` (nanti akan di-hash otomatis saat login pertama).

### Langkah 6: Generate Entitas CRUD

```bash
# Dari folder siakad (bukan folder project baru!)
node generate-crud.js Barang --fields nama:text,kategori:dropdown:Elektronik,Furnitur,stok:number,harga:number
```

> **Penjelasan:** Perintah ini akan membuat 2 file baru dan mengupdate 5 file yang sudah ada secara otomatis.

### Langkah 7: Deploy Web App

Di editor Apps Script:
1. Klik **Deploy** → **New deployment**
2. Pilih tipe **Web app**
3. Atur akses sesuai kebutuhan
4. Klik **Deploy**
5. Salin URL web app yang dihasilkan
6. Buka URL tersebut di browser

---

## 🎯 Generate Entitas CRUD Baru

Template ini sudah include **CRUD Generator CLI** yang bisa membuat entitas baru secara otomatis. Generator ada di folder **siakad** (bukan di folder starter).

### Cara Kerja Generator

Satu perintah akan mengotomatiskan **7 langkah manual**:

```
┌──────────────────────────────────────────────────┐
│ node generate-crud.js <NamaEntitas> [options]    │
├──────────────────────────────────────────────────┤
│                                                  │
│ 1. ✅ Membuat [Entitas].js          (server)     │
│ 2. ✅ Membuat [Entitas]View.html    (view)       │
│ 3. ✅ Update JavascriptCrud.html     (crudConfig) │
│ 4. ✅ Update JavascriptCore.html     (menu)      │
│ 5. ✅ Update Aside.html             (sidebar)    │
│ 6. ✅ Update Index.html             (include)    │
│ 7. ✅ Update Code.js                (path)       │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Contoh Penggunaan

**Entitas sederhana (2 field default: nama, kode):**
```bash
node generate-crud.js Jurusan
```

**Entitas dengan field kustom:**
```bash
node generate-crud.js Barang --fields nama:text,kategori:dropdown:Elektronik,Furnitur,stok:number,harga:number
```

**Entitas dengan radio button:**
```bash
node generate-crud.js Karyawan --fields nama:text,status:radio:Aktif,TidakAktif,gaji:number
```

**Dengan opsi tambahan:**
```bash
node generate-crud.js Ruangan --prefix RG --icon 🏠 --title "Manajemen Ruangan"
```

### Format Parameter `--fields`

Format: `nama_field:tipe:opsi1,opsi2`

| Tipe | Contoh | Hasil |
|------|--------|-------|
| `text` | `nama:text` | Input teks biasa |
| `number` | `stok:number` | Input angka |
| `email` | `email:email` | Input email |
| `textarea` | `alamat:textarea` | Textarea multi-baris |
| `dropdown` | `jurusan:dropdown:RPL,TKJ,AKL` | Dropdown select |
| `radio` | `kelas:radio:XI,XII` | Radio button |

### Dry Run (Lihat perubahan tanpa eksekusi)

```bash
node generate-crud.js Barang --fields nama:text --dry-run
```

### Lihat Semua Opsi

```bash
node generate-crud.js --help
```

---

## 📁 Struktur File Lengkap

```
project-anda/
│
├── 📄 Code.js                    # ENTRY POINT + LOGIN
│   ├── doGet()                   # Render halaman utama
│   ├── include()                 # Include file HTML
│   ├── checkLogin()              # Validasi login
│   ├── hashPassword()            # Hash SHA-256
│   ├── getSheet() / ensureSheet() # Akses spreadsheet
│   ├── generateId()              # Generate ID unik
│   └── resolveTemplatePath()     # Mapping nama ke path file
│
├── 📄 _helper.js                 # UTILITY
│   └── getSheetPaginated()       # Pagination helper
│
├── 📄 dashboard.js               # DASHBOARD SERVER
│   └── getDashboardSummary()     # Data untuk KPI + chart
│
├── 📄 laporan.js                 # LAPORAN SERVER
│   └── getLaporan()              # Data laporan read-only
│
├── 📄 [Entitas].js               # CRUD SERVER (auto-generated)
│   ├── get[Entitas]()            # Baca semua data
│   ├── create[Entitas]()         # Tambah data
│   ├── update[Entitas]()         # Update data
│   └── delete[Entitas]()         # Hapus data
│
├── 📄 appsscript.json            # Konfigurasi Apps Script
├── 📄 .clasp.json                # Konfigurasi clasp
├── 📄 .claspignore               # File yang diabaikan clasp
├── 📄 .gitignore                 # File yang diabaikan git
│
└── 📁 views/
    ├── 📁 layout/
    │   ├── 📄 Head.html          # CDN Tailwind + Chart.js + font
    │   ├── 📄 Aside.html         # Sidebar navigasi
    │   └── 📄 Index.html         # Layout utama (include semua)
    │
    ├── 📁 auth/
    │   └── 📄 Login.html         # Form login
    │
    ├── 📁 modules/
    │   ├── 📄 dashboardView.html # Tampilan dashboard
    │   └── 📄 [Entitas]View.html # Tampilan CRUD (auto-generated)
    │
    └── 📁 scripts/
        ├── 📄 Javascript.html    # ORCHESTRATOR (include semua JS)
        │
        ├── 📁 helper/
        │   └── 📄 JavascriptHelper.html  # showToast, gasRun, capitalize
        │
        ├── 📁 core/
        │   └── 📄 JavascriptCore.html    # menuRegistry, pindahMenu
        │
        └── 📁 modules/
            ├── 📁 login/
            │   └── 📄 JavascriptLogin.html    # prosesLogin, prosesLogout
            │
            ├── 📁 crud/
            │   └── 📄 JavascriptCrud.html     # crudConfig, renderForm, loadData, simpanData, dll
            │
            ├── 📁 dashboard/
            │   └── 📄 JavascriptDashboard.html # Chart, KPI, leaderboard
            │
            └── 📁 laporan/
                └── 📄 JavascriptLaporan.html   # Filter, render tabel laporan
```

---

## 🧩 Penjelasan Setiap Modul

### 1. Modul Login (`Code.js` + `Login.html` + `JavascriptLogin.html`)

**Alur kerja:**
```
User buka web app
        ↓
Tampil form login (Login.html)
        ↓
User isi username & password → klik Masuk
        ↓
prosesLogin() dipanggil (JavascriptLogin.html)
        ↓
google.script.run.checkLogin() → Code.js
        ↓
Cari user di sheet "Users" → verifikasi password (hash SHA-256)
        ↓
Berhasil? → sembunyikan Login, tampilkan Dashboard
Gagal? → tampilkan toast error
```

**Yang perlu disesuaikan:** Tidak ada, sudah siap pakai. Tinggal isi sheet Users.

---

### 2. Modul Dashboard (`dashboard.js` + `dashboardView.html` + `JavascriptDashboard.html`)

**Alur kerja:**
```
User klik menu Dashboard
        ↓
pindahMenu('dashboard') → panggil loadDataDashboard()
        ↓
google.script.run.getDashboardSummary() → dashboard.js
        ↓
Server baca data dari sheet → hitung KPI, chart, recent data
        ↓
renderDashboard(res) → update KPI cards, render chart, render tabel
```

**Yang perlu disesuaikan:**
- `dashboard.js` → fungsi `getDashboardSummary()` → sesuaikan query dengan sheet Anda
- `dashboardView.html` → ganti label KPI, chart, dan tabel
- `JavascriptDashboard.html` → sesuaikan render function dengan data dari server

---

### 3. Modul CRUD (`[Entitas].js` + `JavascriptCrud.html` + `[Entitas]View.html`)

**Alur kerja:**
```
User klik menu entitas (misal "Barang")
        ↓
pindahMenu('barang') → panggil loadDataBarang()
        ↓
loadDataBarang() → (isi dropdown dinamis) → loadData('barang')
        ↓
google.script.run.getBarang() → Barang.js
        ↓
renderTable('barang', data) → tampilkan tabel
        ↓
User klik "Simpan" → simpanData('barang')
        ↓
google.script.run.createBarang(obj) / updateBarang(obj)
        ↓
Toast sukses → refresh tabel
```

**8 titik yang harus terhubung:**

| # | Titik | File | Contoh |
|---|-------|------|--------|
| 1 | Server | `Barang.js` | `getBarang()`, `createBarang()`, dll |
| 2 | View | `BarangView.html` | `id="modulBarang"`, `id="formBarang"`, `id="tabelBarang"` |
| 3 | Config | `JavascriptCrud.html` | Entry di `crudConfig` |
| 4 | Wrapper | `JavascriptCrud.html` | `loadDataBarang()`, `renderForm('barang')` |
| 5 | Menu | `JavascriptCore.html` | Entry di `menuRegistry` |
| 6 | Sidebar | `Aside.html` | `<button onclick="pindahMenu('barang')">` |
| 7 | Include | `Index.html` | `<?!= include('BarangView'); ?>` |
| 8 | Path | `Code.js` | `'BarangView': 'views/modules/BarangView'` |

> **Semua ini dibuat OTOMATIS oleh `generate-crud.js`** 🚀

---

### 4. Modul Laporan (`laporan.js` + `JavascriptLaporan.html`)

**Alur kerja:**
```
User klik menu Laporan
        ↓
loadDataLaporan() → google.script.run.getLaporan()
        ↓
Server JOIN data dari beberapa sheet
        ↓
Client render tabel + isi filter dropdown
        ↓
User pilih filter → applyFilterLaporan() → render ulang tabel
```

**Yang perlu disesuaikan:**
- `laporan.js` → fungsi `getLaporan()` → query JOIN sesuai data Anda
- Buat view HTML sendiri untuk laporan
- `JavascriptLaporan.html` → sesuaikan filter dan render function

---

### 5. Modul Helper (`JavascriptHelper.html` + `_helper.js`)

Fungsi siap pakai:

| Fungsi | File | Kegunaan |
|--------|------|----------|
| `showToast(msg, type)` | JS Helper | Tampilkan notifikasi (success/error) |
| `gasRun(fnName, args, onSuccess, onError)` | JS Helper | Panggil server dengan error handling |
| `capitalize(str)` | JS Helper | Kapitalisasi huruf pertama |
| `getSheetPaginated(sheet, offset, limit)` | `_helper.js` | Baca data dengan pagination |

---

## 🔧 CLI Generator: generate-crud.js

Generator ada di **folder siakad** (project utama), bukan di folder starter.

### Cara Akses dari Folder Starter

Jika folder starter ada di `D:/GAS/project-anda/`:

```bash
# Panggil generator dari folder project baru
node D:/GAS/siakad/generate-crud.js Barang --fields nama:text
```

### Semua Opsi

| Opsi | Deskripsi | Contoh |
|------|-----------|--------|
| `--fields` | Definisi field | `nama:text,stok:number,kategori:dropdown:A,B,C` |
| `--prefix` | Prefix ID | `--prefix BRG` → ID: `BRG-123456789` |
| `--icon` | Icon sidebar | `--icon 📦` |
| `--title` | Judul menu | `--title "Manajemen Barang"` |
| `--force` | Timpa file yang sudah ada | `--force` |
| `--dry-run` | Lihat perubahan tanpa eksekusi | `--dry-run` |

---

## 🔗 CLI Link Generator: update-crud-link.js

Untuk menghubungkan dropdown dinamis antar entitas (relasi).

### Contoh

Hubungkan dropdown **Jurusan** di form **Siswa** dengan data dari sheet **Jurusan**:

```bash
node update-crud-link.js siswa jurusan Jurusan getOptionsJurusan --text "{nama} ({kode})"
```

### Penjelasan Parameter

| Argumen | Contoh | Keterangan |
|---------|--------|------------|
| `entity` | `siswa` | Entitas target (key di crudConfig) |
| `field` | `jurusan` | Nama field di form target |
| `sourceEntity` | `Jurusan` | Entitas sumber data |
| `sourceFunction` | `getOptionsJurusan` | Fungsi server helper |
| `--label` | `kode` | Field yang dipakai sebagai value option |
| `--text` | `"{nama} ({kode})"` | Format teks yang ditampilkan |

---

## 💡 Tips & Troubleshooting

| Masalah | Solusi |
|---------|--------|
| **Login gagal terus** | Pastikan sheet `Users` ada dengan header `username,password`. Coba isi manual user `admin` dengan password `admin123` |
| **SPREADSHEET_ID error** | Jalankan `setupConfig()` di editor Apps Script, pastikan ID spreadsheet benar |
| **clasp push error** | Cek `.claspignore` — pastikan hanya file yang diperlukan yang ter-push |
| **Tabel kosong terus** | Cek apakah sheet dengan nama yang sesuai sudah ada di spreadsheet |
| **Form tidak muncul** | Pastikan `renderForm('entitas')` dipanggil setelah definisi crudConfig |
| **Edit tidak berfungsi** | Cek urutan kolom di `editData` — parameter dikirim via `row.join()`, urutan harus sesuai |
| **Data tidak tersimpan** | Pastikan fungsi server mengembalikan `{ success: true, message: '...' }` |
| **Generator error** | Jalankan dari folder **siakad**, bukan dari folder starter |
| **Ingin reset project** | Hapus semua file `[Entitas].js` dan `[Entitas]View.html`, lalu hapus entri terkait di file yang sudah di-update |

### Alur Debugging Cepat

```bash
# 1. Cek apakah file sudah ter-push
clasp push

# 2. Buka editor dan cek Execution Log
clasp open

# 3. Test fungsi server langsung dari editor
#   → Pilih fungsi (misal: getBarang) → Run → lihat log
```

---

## 🚀 Quick Start (1 Menit)

```bash
# 1. Copy starter
cp -r templates/default/starter/ D:/GAS/project-saya/
cd D:/GAS/project-saya/

# 2. Setup clasp
clasp create --title "Aplikasi Saya"
# Copy scriptId ke .clasp.json

# 3. Generate entitas
node D:/GAS/siakad/generate-crud.js Barang --fields nama:text,stok:number

# 4. Push
clasp push

# 5. Buka editor → setupConfig() → Deploy
clasp open
```

**Selesai!** Aplikasi Anda sudah siap dengan **Login, Dashboard, CRUD, dan Laporan**. 🎉

