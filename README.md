
# 🚀 SIAKAD Starter Template

**Sistem Informasi Akademik (SIAKAD)** — Starter template lengkap berbasis **Google Apps Script + TailwindCSS + Chart.js** yang siap pakai untuk membuat aplikasi web SPA (Single Page Application) dengan fitur **Login, Dashboard, CRUD, dan Laporan**.

---

## 📋 Daftar Isi

1. [Tentang Project](#-tentang-project)
2. [Fitur Utama](#-fitur-utama)
3. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
4. [Struktur Project](#-struktur-project)
5. [Cara Instalasi & Setup](#-cara-instalasi--setup)
6. [Panduan Penggunaan](#-panduan-penggunaan)
7. [Modul API & Fungsi Server](#-modul-api--fungsi-server)
8. [CLI Generator CRUD](#-cli-generator-crud)
9. [Panduan Kustomisasi](#-panduan-kustomisasi)
10. [Troubleshooting](#-troubleshooting)
11. [Lisensi](#-lisensi)

---

## 🎯 Tentang Project

SIAKAD Starter Template adalah kerangka aplikasi web akademik yang dibangun di atas **Google Apps Script** (GAS), memungkinkan deployment gratis tanpa perlu server backend tradisional. Template ini dirancang untuk:

- **Developer pemula** yang ingin belajar membuat aplikasi web dengan Google Apps Script
- **Developer berpengalaman** yang membutuhkan boilerplate cepat untuk proyek akademik
- **Sekolah/Institusi** yang membutuhkan sistem informasi sederhana berbasis Google Workspace

### Arsitektur Aplikasi

```
┌──────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Login   │  │Dashboard │  │   CRUD   │  │ Laporan  │ │
│  │  (SPA)   │  │  (SPA)   │  │  (SPA)   │  │  (SPA)   │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       └──────────────┴─────────────┴──────────────┘       │
│                         │                                 │
│              google.script.run (RPC)                      │
└─────────────────────────┬────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────┐
│              GOOGLE APPS SCRIPT (Server)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Code.js │  │ Siswa.js │  │Jurusan.js│  │dashboard │ │
│  │(Entry +  │  │ (CRUD)   │  │ (CRUD)   │  │ .js etc  │ │
│  │  Login)  │  │          │  │          │  │          │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                         │                                 │
└─────────────────────────▼────────────────────────────────┘
                          │
               ┌──────────▼──────────┐
               │  Google Sheets (DB)  │
               │  ┌────────────────┐  │
               │  │ Users          │  │
               │  │ Siswa          │  │
               │  │ Jurusan        │  │
               │  └────────────────┘  │
               └─────────────────────┘
```

### Alur Aplikasi

```
User Buka Web App
       │
       ▼
┌─────────────────┐
│   Form Login    │ ◄── Cek credentials di sheet "Users"
│ (Login.html)    │     Hash SHA-256
└────────┬────────┘
         │ Berhasil
         ▼
┌──────────────────────────────────────────────────────────┐
│                   DASHBOARD UTAMA                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │  4 KPI Cards │  │  2 Charts    │  │  Recent Data   │ │
│  │  (Angka)     │  │ (Doughnut +  │  │  (Tabel)       │ │
│  │              │  │  Bar)        │  │                │ │
│  └──────────────┘  └──────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────┘
         │
         ├──► Klik Menu "Siswa"  → CRUD Siswa (Read/Write)
         ├──► Klik Menu "Jurusan" → CRUD Jurusan (Read/Write)
         ├──► Klik Menu "Laporan" → Laporan Read-Only
         └──► Klik "Keluar"      → Kembali ke Login
```

---

## ✅ Fitur Utama

| Modul | Status | Deskripsi |
|-------|--------|-----------|
| **🔐 Login** | ✅ Siap pakai | Form login dengan validasi ke sheet `Users`, password di-hash SHA-256 |
| **📊 Dashboard** | ✅ Template siap | 4 Kartu KPI, 2 Chart (Doughnut & Bar), tabel Data Terbaru |
| **📝 CRUD** | ✅ Generik + CLI Generator | Create, Read, Update, Delete — tinggal generate entitas baru via CLI |
| **📄 Laporan** | ✅ Template siap | Tampilan read-only dengan filter, cocok untuk cetak/ekspor |
| **🔧 Helper** | ✅ Siap pakai | `showToast`, `gasRun`, `capitalize`, pagination server-side |
| **🧭 Navigasi** | ✅ Siap pakai | Sidebar navigasi + menuRegistry + fungsi `pindahMenu()` |
| **🏭 Generator CLI** | ✅ Termasuk | Script Node.js untuk auto-generate entitas CRUD baru (7 file sekaligus) |
| **🎨 UI Modern** | ✅ CDN | TailwindCSS untuk styling, Chart.js untuk grafik, font Inter |

---

## 🛠 Teknologi yang Digunakan

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **Google Apps Script** | V8 (Chrome) | Backend server-side, integrasi Google Sheets, Web App deployment |
| **TailwindCSS** | Latest (CDN) | Utility-first CSS framework untuk UI modern |
| **Chart.js** | Latest (CDN) | Library grafik JavaScript (doughnut, bar) |
| **Google Fonts (Inter)** | - | Font modern untuk tampilan lebih baik |
| **Google Sheets** | - | Database penyimpanan data (No-SQL via Spreadsheet) |
| **Node.js** | 14+ | Untuk menjalankan CLI Generator CRUD |
| **Clasp** | Latest | CLI resmi Google untuk push/pull Apps Script project |

---

## 📁 Struktur Project

```
project-anda/
│
├── 📄 Code.js                   # ENTRY POINT + LOGIN
│   ├── doGet()                  # Render halaman utama (Index.html)
│   ├── include()                # Include file HTML partial
│   ├── getSpreadsheetId()       # Ambil ID spreadsheet dari Properties
│   ├── setupConfig()            # Setup konfigurasi awal
│   ├── checkLogin()             # Validasi login user
│   ├── hashPassword()           # Hash password SHA-256
│   ├── isPasswordValid()        # Verifikasi password
│   ├── getSheet() / ensureSheet() # Akses & buat sheet
│   ├── generateId()             # Generate ID unik (prefix-timestamp)
│   ├── sanitizeData()           # Konversi Date → string
│   ├── resolveTemplatePath()    # Mapping nama file → path HTML
│   └── buildResult()            # Helper response {success, message}
│
├── 📄 _helper.js                # UTILITY
│   └── getSheetPaginated()      # Baca data dengan pagination (offset, limit)
│
├── 📄 dashboard.js              # DASHBOARD SERVER
│   └── getDashboardSummary()    # Ambil data KPI + chart + recent
│
├── 📄 laporan.js                # LAPORAN SERVER
│   └── getLaporan()             # Ambil data laporan read-only
│
├── 📄 Siswa.js                  # CRUD SERVER - SISWA
│   ├── getSiswa()               # Baca semua data siswa
│   ├── createSiswa()            # Tambah data siswa baru
│   ├── updateSiswa()            # Update data siswa
│   └── deleteSiswa()           # Hapus data siswa
│
├── 📄 Jurusan.js                # CRUD SERVER - JURUSAN
│   ├── getJurusan()             # Baca semua data jurusan
│   ├── createJurusan()          # Tambah data jurusan baru
│   ├── updateJurusan()          # Update data jurusan
│   ├── deleteJurusan()          # Hapus data jurusan
│   └── getOptionsJurusan()      # Helper untuk dropdown relasi
│
├── 📄 generate-crud.js          # CLI Generator CRUD (Node.js)
├── 📄 starter.sh                # Script setup otomatis (Git Bash / WSL)
├── 📄 starter.bat               # Script setup otomatis (Windows CMD)
│
├── 📄 appsscript.json           # Manifest Apps Script
│   ├── timeZone: "Asia/Jakarta"
│   ├── runtimeVersion: "V8"
│   ├── webapp.access: "MYSELF" / "ANYONE"
│   └── webapp.executeAs: "USER_DEPLOYING"
│
├── 📄 .clasp.json               # Konfigurasi clasp (scriptId, rootDir)
├── 📄 .claspignore              # File yg diabaikan saat clasp push
├── 📄 .gitignore                # File yg diabaikan git
│
├── 📁 views/
│   ├── 📁 auth/
│   │   └── 📄 Login.html        # Form login (username + password)
│   │
│   ├── 📁 layout/
│   │   ├── 📄 Head.html         # CDN: TailwindCSS, Chart.js, Google Fonts
│   │   ├── 📄 Aside.html        # Sidebar navigasi (menu buttons)
│   │   └── 📄 Index.html        # Layout utama SPA (include semua)
│   │
│   ├── 📁 modules/
│   │   ├── 📄 dashboardView.html    # Tampilan dashboard
│   │   ├── 📄 SiswaView.html        # Tampilan CRUD Siswa
│   │   └── 📄 JurusanView.html      # Tampilan CRUD Jurusan
│   │
│   └── 📁 scripts/
│       ├── 📄 Javascript.html       # ORCHESTRATOR (include semua JS file)
│       │
│       ├── 📁 helper/
│       │   └── 📄 JavascriptHelper.html  # showToast, gasRun, capitalize
│       │
│       ├── 📁 core/
│       │   └── 📄 JavascriptCore.html    # menuRegistry, pindahMenu, registerMenu
│       │
│       └── 📁 modules/
│           ├── 📁 login/
│           │   └── 📄 JavascriptLogin.html   # prosesLogin, prosesLogout
│           │
│           ├── 📁 crud/
│           │   └── 📄 JavascriptCrud.html    # CRUD Engine: crudConfig, renderForm,
│           │                                      renderTable, loadData, simpanData,
│           │                                      editData, hapusData, resetForm
│           │
│           ├── 📁 dashboard/
│           │   └── 📄 JavascriptDashboard.html  # loadDataDashboard, renderDashboard,
│           │                                        renderChart1, renderChart2,
│           │                                        renderRecentData
│           │
│           └── 📁 laporan/
│               └── 📄 JavascriptLaporan.html    # loadDataLaporan, renderLaporanTable,
│                                                    applyFilterLaporan, resetFilterLaporan
```

---

## 📦 Cara Instalasi & Setup

### Prasyarat

| Tools | Keterangan |
|-------|------------|
| **Node.js** (v14+) | Untuk menjalankan CLI generator |
| **Google Account** | Untuk Google Apps Script & Google Sheets |
| **Clasp** | `npm install -g @google/clasp` |
| **Code Editor** | VS Code (recommended) atau editor lainnya |

### ⚡ Cara Super Cepat: Jalankan Starter Script

Template ini sudah include **2 starter script** yang akan mengotomatiskan langkah 1-8 secara interaktif:

**Untuk Git Bash / WSL (Linux/Mac):**
```bash
# Dari folder template
cd (FOLDER KAMU)
bash starter.sh
```

**Untuk Windows CMD (Command Prompt):**
```cmd
:: Dari folder template
cd /d D:\GAS\magang
starter.bat
```

**Apa yang dilakukan starter script:**
1. ✅ Memeriksa Node.js & Clasp
2. ✅ Meminta nama project baru
3. ✅ Menyalin semua file starter ke folder project baru
4. ✅ Login ke Google via Clasp (jika belum)
5. ✅ Membuat project Apps Script baru
6. ✅ Push semua file ke Apps Script
7. ✅ Menampilkan instruksi setup spreadsheet & deploy

### Langkah Manual: Clone atau Copy Starter

Jika tidak ingin menggunakan starter script, lakukan manual:

```bash
# Copy starter ke folder project baru
cp -r templates/default/starter/ (FOLDER KAMU)/project-anda/
cd (FOLDER KAMU)/project-anda/
```

Atau jika menggunakan git:

```bash
git clone <repo-url> (FOLDER KAMU)/project-anda
cd (FOLDER KAMU)/project-anda
```

### Langkah 2: Buat Google Sheets Database

1. Buka [Google Drive](https://drive.google.com)
2. Klik **Buat** → **Google Sheets**
3. Buat sheet **`Users`** dengan header:
   | username | password |
   |----------|----------|
   | admin    | admin123 |

   > **⚠️ WAJIB:** Sheet `Users` harus ada karena dipakai untuk login. Password `admin123` akan diverifikasi otomatis.

### Langkah 3: Setup Clasp & Push ke Apps Script

```bash
# Login ke Google (akan terbuka browser)
clasp login

# Buat project Apps Script baru
clasp create --title "SIAKAD Aplikasi Saya"

# Copy scriptId yang muncul ke .clasp.json
# Buka .clasp.json → ganti "scriptId" dengan ID dari clasp create

# Push semua file ke Apps Script
clasp push
```

### Langkah 4: Konfigurasi Spreadsheet

```bash
# Buka editor Apps Script di browser
clasp open
```

Di editor Apps Script:

1. **Buka file `Code.js`**
2. **Jalankan fungsi `setupConfig()`** sekali dari editor (Run → pilih `setupConfig` → Run)
3. **Ganti `SPREADSHEET_ID`** dengan ID spreadsheet Anda
   - URL spreadsheet: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
4. Jalankan lagi `setupConfig()` untuk menyimpan konfigurasi

### Langkah 5: Buat User Admin (Jika Belum Ada)

Di editor Apps Script, jalankan kode ini:

```javascript
function addUser() {
  var sheet = ensureSheet('Users', ['username', 'password']);
  sheet.appendRow(['admin', hashPassword('admin123')]);
  console.log('User admin berhasil ditambahkan!');
}
```

> Atau langsung isi manual di spreadsheet: username = `admin`, password bisa diisi plain text (nanti di-hash otomatis saat login).

### Langkah 6: Generate Entitas CRUD (Opsional)

```bash
# Dari folder siakad (project utama), bukan folder project baru
node generate-crud.js Barang --fields nama:text,kategori:dropdown:Elektronik,Furnitur,stok:number,harga:number
```

> Perintah ini akan membuat 2 file baru dan mengupdate 5 file yang sudah ada secara otomatis.

### Langkah 7: Deploy Web App

1. Di editor Apps Script, klik **Deploy** → **New deployment**
2. Pilih tipe **Web app**
3. **Description**: isi sesuai keinginan
4. **Execute as**: `User accessing the web app` atau `Me`
5. **Who has access**: `Anyone` (untuk publik) atau `Anyone within [domain]`
6. Klik **Deploy**
7. **Salin URL Web App** yang dihasilkan
8. Buka URL tersebut di browser

### Langkah 8: Login & Mulai Menggunakan

1. Buka URL Web App
2. Login dengan:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Dashboard akan tampil

---

## 🚀 Panduan Penggunaan

### 🔐 Login

**File terkait:**
- Server: `Code.js` (fungsi `checkLogin`, `hashPassword`, `isPasswordValid`)
- View: `views/auth/Login.html`
- Script: `views/scripts/modules/login/JavascriptLogin.html`

**Cara kerja:**
1. User membuka web app → otomatis diarahkan ke form login
2. User mengisi username & password
3. Client memanggil `google.script.run.checkLogin()` (via `gasRun`)
4. Server mencari username di sheet `Users`
5. Password diverifikasi dengan SHA-256 hash
6. Jika cocok → sembunyikan login, tampilkan dashboard
7. Jika gagal → toast error

**Struktur sheet `Users`:**
| username | password |
|----------|----------|
| admin    | [hash SHA-256 dari password] |

### 📊 Dashboard

**File terkait:**
- Server: `dashboard.js` (fungsi `getDashboardSummary`)
- View: `views/modules/dashboardView.html`
- Script: `views/scripts/modules/dashboard/JavascriptDashboard.html`

**Komponen Dashboard:**
1. **Welcome Banner** — Gradient background dengan teks selamat datang
2. **4 KPI Cards** — Menampilkan total data (sesuaikan di `dashboard.js`)
3. **Chart 1 (Doughnut)** — Distribusi data (misal: per jurusan)
4. **Chart 2 (Bar)** — Perbandingan data (misal: per kelas)
5. **Tabel Data Terbaru** — Menampilkan 5-10 record terakhir

**Kustomisasi Dashboard:**

Di `dashboard.js`, fungsi `getDashboardSummary()`:

```javascript
function getDashboardSummary() {
  var sheetSiswa = getSheet("Siswa");
  var dataSiswa = sheetSiswa ? sheetSiswa.getDataRange().getValues() : [];
  
  return {
    kpi: {
      total1: dataSiswa.length - 1,           // Total siswa
      total2: hitungPerJurusan(dataSiswa),    // Jumlah jurusan
      total3: hitungAktif(dataSiswa),         // Siswa aktif
      avg: rataRata(dataSiswa)                // Rata-rata
    },
    chart1Data: { "RPL": 10, "TKJ": 15, "AKL": 8 },  // Doughnut
    chart2Data: [                             // Bar chart
      { label: "XI", value: 18 },
      { label: "XII", value: 15 }
    ],
    recentData: [                             // Data terbaru
      { kolom1: "Nama", kolom2: "Kelas", kolom3: "Jurusan" }
    ]
  };
}
```

### 📝 CRUD (Create, Read, Update, Delete)

**File terkait:**
- Server: `[Entitas].js` (misal: `Siswa.js`, `Jurusan.js`)
- View: `views/modules/[Entitas]View.html`
- Script: `views/scripts/modules/crud/JavascriptCrud.html`

**Engine CRUD Generik (`JavascriptCrud.html`):**

| Fungsi | Deskripsi |
|--------|-----------|
| `crudConfig` | Objek konfigurasi per entitas (form fields, table columns, server functions) |
| `renderForm(entity)` | Render form HTML dari konfigurasi field |
| `loadData(entity)` | Load data dari server & render tabel |
| `renderTable(entity, data)` | Render tabel dari array data |
| `simpanData(entity)` | Simpan data baru (create) atau update |
| `editDataByIndex(entity, rowIndex)` | Edit dari cache tanpa panggil server |
| `hapusData(entity, id)` | Hapus data dengan konfirmasi |
| `resetForm(entity)` | Reset form ke keadaan awal |
| `getFieldValue(field)` | Ambil nilai field (handle radio khusus) |
| `setFieldValue(field, val)` | Set nilai field (handle radio khusus) |
| `formatCellValue(value, type)` | Format sel untuk tampilan tabel |
| `_crudDataCache` | Cache data client-side untuk akses cepat edit |

**Alur CRUD lengkap:**
```
User klik menu entitas
       │
       ▼
pindahMenu('siswa') → panggil loadDataSiswa()
       │
       ▼
populateSiswaJurusanDropdown() → isi dropdown Jurusan dari server
       │
       ▼
loadData('siswa') → google.script.run.getSiswa()
       │
       ▼
renderTable('siswa', data)
       │
       ▼
User klik "Tambah" → form kosong
User klik "Edit" → form terisi data → editDataByIndex()
User klik "Simpan" → createSiswa() / updateSiswa()
User klik "Hapus" → deleteSiswa() dengan konfirmasi
```

**Konfigurasi CRUD (`crudConfig` di `JavascriptCrud.html`):**

```javascript
const crudConfig = {
  siswa: {
    formWrapperId: "formSiswa",         // ID wrapper form
    tableId: "tabelSiswa",              // ID tabel
    titleFormId: "titleFormSiswa",      // ID judul form
    form: {
      id:   { el: "siswa_id", type: "hidden" },
      nama: { el: "siswa_nama", type: "text", label: "Nama", placeholder: "Nama" },
      kelas: {
        el: "siswa_kelas",
        type: "radio",
        label: "Kelas",
        options: ["XI", "XII"]
      },
      Jurusan: {
        el: "siswa_Jurusan",
        type: "dropdown",
        label: "Jurusan",
        options: ['-- Pilih Jurusan --']
      },
      // field lainnya...
    },
    btnSaveId: "btnSimpanSiswa",         // ID tombol simpan
    btnCancelId: "btnBatalSiswa",        // ID tombol batal
    loader: ["getSiswa"],                // Fungsi server untuk load data
    create: "createSiswa",              // Fungsi server create
    update: "updateSiswa",              // Fungsi server update
    delete: "deleteSiswa",              // Fungsi server delete
    tableColumns: [                      // Mapping kolom tabel
      { label: "ID", key: 0 },
      { label: "Nama", key: 1 },
      { label: "Kelas", key: 2 },
      { label: "Jurusan", key: 3 },
      // kolom lainnya...
    ]
  }
};
```

**Tipe Field yang Didukung:**

| Tipe | Contoh Konfigurasi | Tampilan |
|------|-------------------|----------|
| `hidden` | `{ type: "hidden" }` | Input hidden |
| `text` | `{ type: "text", placeholder: "Nama" }` | Input teks |
| `number` | `{ type: "number", placeholder: "Stok" }` | Input angka |
| `email` | `{ type: "email", placeholder: "email@ex.com" }` | Input email |
| `date` | `{ type: "date" }` | Input date picker |
| `textarea` | `{ type: "textarea" }` | Textarea multi-baris |
| `password` | `{ type: "password" }` | Input password |
| `radio` | `{ type: "radio", options: ["A","B"] }` | Radio button grup |
| `dropdown` | `{ type: "dropdown", options: ["X","Y"] }` | Select dropdown |

### 📄 Laporan

**File terkait:**
- Server: `laporan.js` (fungsi `getLaporan`)
- Script: `views/scripts/modules/laporan/JavascriptLaporan.html`

**Fitur Laporan:**
- Read-only (tidak bisa edit/hapus)
- Filter data (dropdown filter)
- Tabel dinamis
- Bisa dikembangkan untuk ekspor PDF/CSV

**Struktur data laporan:**
```javascript
// Dari server (laporan.js)
{
  data: [
    { kolom1: "Nilai A", kolom2: "Nilai B", kolom3: "Nilai C" },
    // ...
  ],
  filterOptions: {
    jurusan: ["RPL", "TKJ", "AKL"],
    kelas: ["XI", "XII"]
  }
}
```

### 🧰 Helper & Utilities

**Client-side (`JavascriptHelper.html`):**

| Fungsi | Parameter | Deskripsi |
|--------|-----------|-----------|
| `showToast(msg, type)` | `msg`: string, `type`: "success" \| "error" | Tampilkan notifikasi toast |
| `gasRun(fnName, args, onSuccess, onError)` | `fnName`: string, `args`: array/obj, `onSuccess`: callback, `onError`: callback | Panggil server function dengan error handling |
| `capitalize(str)` | `str`: string | Kapitalisasi huruf pertama |
| `registerMenu(key, config)` | `key`: string, `config`: object | Daftarkan menu baru |
| `pindahMenu(menu)` | `menu`: string (key menu) | Pindah antar halaman |

**Server-side (`_helper.js`):**

| Fungsi | Parameter | Deskripsi |
|--------|-----------|-----------|
| `getSheetPaginated(sheetName, offset, limit)` | `sheetName`: string, `offset`: number, `limit`: number | Baca data dengan pagination |

---

## 🔌 Modul API & Fungsi Server

### Entry Point & Konfigurasi (`Code.js`)

```javascript
// Entry point web app
function doGet() → HtmlOutput (Index.html)

// Include file HTML
function include(filename) → string (content HTML)

// Spreadsheet config
function getSpreadsheetId() → string
function setupConfig() → {success, message}
function getConfiguredSpreadsheet() → Spreadsheet
function getSheet(sheetName) → Sheet | null
function ensureSheet(sheetName, headers) → Sheet

// ID generator
function generateId(prefix) → string (prefix-timestamp)

// Password
function hashPassword(password) → string (SHA-256 hex)
function isPasswordValid(stored, provided) → boolean

// Login
function checkLogin(username, password) → {success, message}

// Utility
function sanitizeData(data) → array (Date → string)
function buildResult(success, message) → {success, message}
function resolveTemplatePath(filename) → string (path mapping)
```

### CRUD Server Pattern

Setiap entitas CRUD mengikuti pola yang konsisten:

```javascript
// READ - Ambil semua data
function get[NamaEntitas]() → array of arrays

// CREATE - Tambah data baru
function create[NamaEntitas](obj) → {success, message}

// UPDATE - Update data existing
function update[NamaEntitas](obj) → {success, message}

// DELETE - Hapus data
function delete[NamaEntitas](id) → {success, message}

// OPTIONAL - Helper untuk dropdown relasi
function getOptions[NamaEntitas]() → array of objects
```

### Format Response Server

Semua fungsi server yang mengubah data (create, update, delete) harus mengembalikan:

```javascript
{
  success: true,     // Boolean: true = berhasil, false = gagal
  message: "..."    // String: pesan untuk ditampilkan ke user
}
```

Fungsi read (get) mengembalikan array 2 dimensi (array of arrays):
```javascript
[
  ["ID-001", "Nama A", "Value A"],  // Row 1
  ["ID-002", "Nama B", "Value B"],  // Row 2
  // ...
]
```

---

## 🏭 CLI Generator CRUD

### Tentang Generator

`generate-crud.js` adalah script Node.js untuk mengotomatiskan pembuatan entitas CRUD baru. Satu perintah akan mengupdate **7 file sekaligus**:

```
 node generate-crud.js <NamaEntitas> [options]

 ┌─────────────────────────────────────────────────────────┐
 │                                                         │
 │ 1. ✅ Membuat [Entitas].js                  (server)    │
 │ 2. ✅ Membuat [Entitas]View.html            (view)      │
 │ 3. ✅ Update JavascriptCrud.html            (crudConfig)│
 │ 4. ✅ Update JavascriptCore.html            (menu)      │
 │ 5. ✅ Update Aside.html                    (sidebar)   │
 │ 6. ✅ Update Index.html                    (include)   │
 │ 7. ✅ Update Code.js                       (path)      │
 │                                                         │
 └─────────────────────────────────────────────────────────┘
```

### Cara Menggunakan

```bash
# Pastikan berada di folder yang sama dengan generate-crud.js
cd (FOLDER KAMU)/siakad

# Generate entitas dengan 2 field default (nama, kode)
node generate-crud.js Jurusan

# Generate dengan field kustom
node generate-crud.js Barang --fields nama:text,kategori:dropdown:Elektronik,Furnitur,stok:number,harga:number

# Generate dengan radio button
node generate-crud.js Karyawan --fields nama:text,status:radio:Aktif,TidakAktif,gaji:number

# Dengan opsi tambahan
node generate-crud.js Ruangan --prefix RG --icon 🏠 --title "Manajemen Ruangan"
```

### Opsi Lengkap

| Opsi | Deskripsi | Default | Contoh |
|------|-----------|---------|--------|
| `--fields` | Definisi field entitas | `nama:text,kode:text` | `--fields nama:text,stok:number` |
| `--prefix` | Prefix untuk ID | Huruf pertama + UR | `--prefix BRG` → ID: `BRG-123456789` |
| `--icon` | Emoji/icon untuk sidebar | `📋` | `--icon 📦` |
| `--title` | Judul menu di sidebar | `Manajemen Data {Entity}` | `--title "Manajemen Barang"` |
| `--force` | Timpa file yang sudah ada | false | `--force` |
| `--dry-run` | Lihat perubahan tanpa eksekusi | false | `--dry-run` |

### Format Parameter `--fields`

Format: `nama_field:tipe:opsi1,opsi2`

| Tipe | Contoh | Hasil |
|------|--------|-------|
| `text` | `nama:text` | Input teks biasa |
| `number` | `stok:number` | Input angka |
| `email` | `email:email` | Input email |
| `date` | `tanggal:date` | Input date picker |
| `textarea` | `alamat:textarea` | Textarea multi-baris |
| `password` | `pin:password` | Input password |
| `dropdown` | `jurusan:dropdown:RPL,TKJ,AKL` | Dropdown select |
| `radio` | `kelas:radio:XI,XII` | Radio button grup |

### Menghubungkan Dropdown Relasi (Link Generator)

Untuk menghubungkan dropdown antar entitas (misal: field Jurusan di form Siswa mengambil data dari sheet Jurusan), gunakan pola berikut:

**Di file `JavascriptCrud.html`, tambahkan fungsi wrapper:**

```javascript
function loadDataSiswa() {
  populateSiswaJurusanDropdown();  // Isi dropdown dari server
  loadData("siswa");               // Load tabel
}

function populateSiswaJurusanDropdown() {
  google.script.run.withSuccessHandler(list => {
    const selectEl = document.getElementById('siswa_Jurusan');
    if (!selectEl) return;
    
    let html = '<option value="">-- Pilih Jurusan --</option>';
    list.forEach(item => {
      html += `<option value="${item.nama}">${item.nama} (${item.kode})</option>`;
    });
    selectEl.innerHTML = html;
  }).getOptionsJurusan();  // Panggil fungsi helper di Jurusan.js
}
```

**Di file `[Entitas].js` (sumber data), tambahkan fungsi helper:**

```javascript
function getOptionsJurusan() {
  var sheet = getSheet('Jurusan');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift();
  return data.map(function(r) {
    return { id: r[0], nama: r[1], kode: r[2] };
  });
}
```

### Marker yang Digunakan Generator

Generator menggunakan komentar marker untuk menemukan posisi yang tepat untuk menyisipkan kode baru:

| File | Marker |
|------|--------|
| `JavascriptCrud.html` | `// >>> Entitas CRUD akan ditambahkan di sini oleh generate-crud.js <<<` |
| `JavascriptCore.html` | `// >>> Entitas CRUD baru akan ditambahkan otomatis di sini oleh generator <<<` |
| `Code.js` | `// >>> Tambahkan mapping view entitas baru di sini <<<` |
| `Index.html` | `<!-- >>> Tambahkan include view entitas baru di sini <<< -->` |

---

## 🎨 Panduan Kustomisasi

### Mengubah Tampilan

#### Warna & Tema

Warna dasar menggunakan TailwindCSS. Ubah di `views/layout/Head.html`:

```html
<style>
  body { font-family: 'Inter', sans-serif; }
  .fade-in { animation: fadeIn 0.3s ease-in-out; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  
  /* Tambahkan kustom CSS di sini */
  .bg-primary { background-color: #1e40af; }
  .text-primary { color: #1e40af; }
</style>
```

#### Judul Aplikasi

Ubah di beberapa tempat:
1. `Code.js` → `doGet()` → `.setTitle('Aplikasi Saya')`
2. `views/layout/Head.html` → `<title>Aplikasi Saya</title>`
3. `views/auth/Login.html` → `<h1 class="...">Aplikasi Saya</h1>`
4. `views/layout/Aside.html` → `<h2 class="...">APLIKASI</h2>`
5. `setupConfig()` → `APP_NAME: 'APLIKASI_ANDA'`

#### Icon Aplikasi (Favicon)

Tambahkan di `views/layout/Head.html`:

```html
<link rel="icon" type="image/png" href="https://example.com/favicon.png">
```

### Menambah Menu Baru

Untuk menambah menu secara manual (tanpa generator):

**1. Buat Server File** — `[Entitas].js`:
```javascript
function get[Entitas]() { ... }
function create[Entitas](obj) { ... }
function update[Entitas](obj) { ... }
function delete[Entitas](id) { ... }
```

**2. Buat View File** — `views/modules/[Entitas]View.html`:
```html
<div id="modul[Entitas]" class="hidden fade-in">
  <div class="..." id="form[Entitas]"></div>
  <div class="...">
    <table>
      <thead>...</thead>
      <tbody id="tabel[Entitas]"></tbody>
    </table>
  </div>
</div>
```

**3. Update `crudConfig`** di `JavascriptCrud.html`:
```javascript
[entitas]: {
  formWrapperId: "form[Entitas]",
  tableId: "tabel[Entitas]",
  form: { ... },
  btnSaveId: "btnSimpan[Entitas]",
  // ...
}
```

**4. Update `menuRegistry`** di `JavascriptCore.html`:
```javascript
[entitas]: {
  title: "Manajemen Data [Entitas]",
  loader: () => typeof loadData[Entitas] === "function" && loadData[Entitas]()
}
```

**5. Tambah Sidebar Button** di `Aside.html`:
```html
<button onclick="pindahMenu('[entitas]')" id="menu[Entitas]Btn" class="...">📋 [Entitas]</button>
```

**6. Tambah include di `Index.html`**:
```html
<?!= include('[Entitas]View'); ?>
```

**7. Tambah path mapping di `Code.js`**:
```javascript
'[Entitas]View': 'views/modules/[Entitas]View',
```

### Menambah Halaman Baru (Non-CRUD)

Untuk halaman seperti Dashboard, About, dll:

1. Buat view HTML di `views/modules/`
2. Buat script JS di `views/scripts/modules/[nama]/`
3. Daftarkan di `menuRegistry` di `JavascriptCore.html`
4. Tambah sidebar button di `Aside.html`
5. Tambah include view di `Index.html`
6. Buat fungsi server di file `.js` baru

### Mengubah Struktur Database

Spreadsheet digunakan sebagai database. Setiap entitas adalah sheet terpisah:

- **Baris 1**: Header / nama kolom
- **Baris 2+**: Data records
- **Kolom 1**: ID (auto-generated, format: `PREFIX-timestamp`)
- **Kolom 2+**: Field values sesuai urutan di `crudConfig`

Untuk menambah kolom baru pada entitas yang sudah ada:
1. Tambah kolom di spreadsheet
2. Update `crudConfig.form` di `JavascriptCrud.html`
3. Update `tableColumns` di `crudConfig`
4. Update fungsi server (create, update) di `[Entitas].js`

---

## 🔧 Troubleshooting

### Masalah Umum & Solusi

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| **Login gagal terus** | Sheet `Users` tidak ada atau salah format | Pastikan sheet `Users` ada dengan header `username,password`. Coba isi manual user `admin` dengan password `admin123` |
| **SPREADSHEET_ID error** | Belum konfigurasi spreadsheet | Jalankan `setupConfig()` di editor Apps Script, pastikan ID spreadsheet benar |
| **clasp push error** | File tidak terdaftar atau clasp bermasalah | Cek `.claspignore` — pastikan hanya file yang diperlukan yang ter-push. Jalankan `clasp login` ulang |
| **Tabel kosong terus** | Sheet entitas belum ada atau belum di-create | Buka spreadsheet dan buat sheet dengan nama yang sesuai, atau jalankan fungsi server `ensureSheet()` |
| **Form tidak muncul** | `renderForm('entitas')` belum dipanggil | Pastikan `renderForm('entitas')` dipanggil setelah definisi `crudConfig` (biasanya di bagian bawah `JavascriptCrud.html`) |
| **Edit tidak berfungsi** | Index kolom tidak sesuai | Cek urutan kolom di `tableColumns` — `editData` menggunakan `row.join()`, urutan harus sesuai dengan urutan field di form |
| **Data tidak tersimpan** | Fungsi server tidak mengembalikan format yang benar | Pastikan fungsi server mengembalikan `{ success: true, message: '...' }` |
| **Generator error** | Menjalankan dari folder yang salah | Jalankan `generate-crud.js` dari folder **siakad** (project utama), bukan dari folder project baru/starter |
| **404 saat deploy** | Path mapping salah | Cek `resolveTemplatePath()` di `Code.js` — pastikan semua mapping file benar |
| **Dropdown tidak muncul** | Fungsi helper belum dipanggil | Pastikan fungsi `populate[Nama]Dropdown()` dipanggil di `loadData[Nama]()` |
| **Chart tidak render** | Data tidak sesuai format | Pastikan data chart1 berupa object `{label: count}` dan chart2 berupa array `[{label, value}]` |

### Alur Debugging

```bash
# 1. Cek apakah file sudah ter-push
clasp push

# 2. Lihat log error
clasp logs           # Tampilkan logs dari Apps Script

# 3. Buka editor dan cek Execution Log
clasp open
# → Buka View → Logs (atau Execution log)

# 4. Test fungsi server langsung dari editor
#   → Pilih fungsi (misal: getBarang) → Run → lihat hasil di log

# 5. Debug client-side
#   → Buka web app → F12 (DevTools) → Console
#   → Cek error JavaScript di console
```

### Ingin Reset Project?

```bash
# Hapus semua file entitas
rm [Entitas].js
rm views/modules/[Entitas]View.html

# Hapus entri terkait di:
# - JavascriptCrud.html (hapus dari crudConfig & wrapper functions)
# - JavascriptCore.html (hapus dari menuRegistry)
# - Aside.html (hapus sidebar button)
# - Index.html (hapus include line)
# - Code.js (hapus path mapping)
```

### Tips Performa

1. **Batasi data per halaman**: Gunakan `getSheetPaginated()` di `_helper.js` untuk pagination
2. **Cache data client-side**: `_crudDataCache` menyimpan data di browser untuk akses edit cepat
3. **Minimalkan panggilan server**: Fungsi `populateDropdown()` hanya dipanggil saat load, bukan setiap render
4. **Gunakan sanitizeData()**: Konversi Date object ke string sebelum dikirim ke client

---

## 📄 Entitas yang Tersedia

### Siswa

| Field | Tipe | Keterangan |
|-------|------|------------|
| ID | auto | Format: `SUR-timestamp` |
| Nama | text | Nama lengkap siswa |
| Kelas | radio | Pilihan: XI, XII |
| Jurusan | dropdown (dinamis) | Data dari sheet Jurusan |
| Sekolah | text | Asal sekolah |
| PeriodeAwal | date | Tanggal mulai magang |
| PeriodeAkhir | date | Tanggal selesai magang |
| Pembimbing | text | Nama pembimbing |
| Surat | text | Nomor surat |
| TanggalSurat | text | Tanggal surat |

### Jurusan

| Field | Tipe | Keterangan |
|-------|------|------------|
| ID | auto | Format: `JUR-timestamp` |
| Nama | text | Nama jurusan (RPL, TKJ, AKL, dll) |
| Kode | text | Kode jurusan |
| **Helper** | `getOptionsJurusan()` | Untuk dropdown dinamis di form Siswa |

---

## 🤝 Kontribusi

Jika Anda ingin berkontribusi pada project ini:

1. Fork repository
2. Buat branch baru: `git checkout -b fitur-anda`
3. Commit perubahan: `git commit -m 'Menambah fitur X'`
4. Push ke branch: `git push origin fitur-anda`
5. Buat Pull Request

### Panduan Kontribusi

- Ikuti struktur kode yang sudah ada
- Gunakan komentar yang jelas (minimal untuk setiap fungsi)
- Update README jika menambah fitur baru
- Test sebelum push: `clasp push` dan deploy web app

---

## 📜 Lisensi

Project ini dilisensikan di bawah **MIT License**.

```
MIT License

Copyright (c) 2024 SIAKAD

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Credits

- **Google Apps Script** — Platform server-side gratis dari Google
- **TailwindCSS** — Framework CSS utility-first
- **Chart.js** — Library grafik JavaScript
- **Clasp** — Command-line tool untuk Google Apps Script
- **Inter Font** — Font dari Rasmus Andersson

---

<div align="center">
  <br>
  <p>Dibuat dengan ❤️ untuk kemudahan pengembangan aplikasi akademik</p>
  <p>
    <a href="#-daftar-isi">Kembali ke Atas ↑</a>
  </p>
</div>

