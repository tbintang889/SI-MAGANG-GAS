#!/bin/bash
# ==========================================
# SIAKAD STARTER SCRIPT
# ==========================================
# Script ini membantu setup project baru
# dari SIAKAD Starter Template
# ==========================================

MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${MAGENTA}============================================${NC}"
echo -e "${MAGENTA}  🚀 SIAKAD STARTER TEMPLATE${NC}"
echo -e "${MAGENTA}  Google Apps Script + TailwindCSS + Chart.js${NC}"
echo -e "${MAGENTA}============================================${NC}"
echo ""

# ==========================================
# CEK PRASYARAT
# ==========================================
echo -e "${CYAN}[1/7] Memeriksa Prasyarat...${NC}"

# Cek Node.js
if command -v node &> /dev/null; then
    NODE_VER=$(node -v)
    echo -e "  ${GREEN}✅ Node.js ${NODE_VER}${NC}"
else
    echo -e "  ${RED}❌ Node.js tidak ditemukan.${NC}"
    echo -e "  ${YELLOW}   Download dan install dari: https://nodejs.org/${NC}"
    echo -e "  ${YELLOW}   Setelah install, jalankan ulang script ini.${NC}"
    exit 1
fi

# Cek clasp
if command -v clasp &> /dev/null; then
    CLASP_VER=$(clasp -v 2>&1 | head -1)
    echo -e "  ${GREEN}✅ Clasp ${CLASP_VER}${NC}"
else
    echo -e "  ${YELLOW}⚠️  Clasp belum terinstall. Menginstall...${NC}"
    npm install -g @google/clasp
    if [ $? -eq 0 ]; then
        echo -e "  ${GREEN}✅ Clasp berhasil diinstall${NC}"
    else
        echo -e "  ${RED}❌ Gagal menginstall clasp. Coba manual: npm install -g @google/clasp${NC}"
        exit 1
    fi
fi

# Cek Git Bash
if command -v git &> /dev/null; then
    GIT_VER=$(git --version)
    echo -e "  ${GREEN}✅ ${GIT_VER}${NC}"
else
    echo -e "  ${YELLOW}⚠️  Git tidak terdeteksi (tidak wajib)${NC}"
fi

echo ""

# ==========================================
# INPUT NAMA PROJECT
# ==========================================
echo -e "${CYAN}[2/7] Konfigurasi Project Baru${NC}"
echo ""

# Tentukan folder SIAKAD (folder saat ini)
SIAKAD_DIR=$(pwd)
echo -e "  ${YELLOW}Folder template saat ini:${NC}"
echo -e "  ${SIAKAD_DIR}"

read -p "  Masukkan nama project baru (contoh: aplikasi-saya): " PROJECT_NAME

if [ -z "$PROJECT_NAME" ]; then
    echo -e "  ${RED}❌ Nama project tidak boleh kosong.${NC}"
    exit 1
fi

# Tentukan folder tujuan (satu level di atas folder siakad)
PARENT_DIR=$(dirname "$SIAKAD_DIR")
PROJECT_DIR="${PARENT_DIR}/${PROJECT_NAME}"

if [ -d "$PROJECT_DIR" ]; then
    echo -e "  ${YELLOW}⚠️  Folder '${PROJECT_NAME}' sudah ada di ${PARENT_DIR}${NC}"
    read -p "  Timpa folder yang ada? (y/n): " OVERWRITE
    if [ "$OVERWRITE" != "y" ] && [ "$OVERWRITE" != "Y" ]; then
        echo -e "  ${RED}❌ Dibataalkan.${NC}"
        exit 1
    fi
    rm -rf "$PROJECT_DIR"
fi

echo -e "  ${GREEN}✅ Project: ${PROJECT_NAME}${NC}"
echo -e "  ${GREEN}✅ Lokasi: ${PROJECT_DIR}${NC}"
echo ""

# ==========================================
# COPY STARTER FILES
# ==========================================
echo -e "${CYAN}[3/7] Menyalin File Starter...${NC}"

mkdir -p "$PROJECT_DIR"

# Daftar file yang akan di-copy (exclude file yang tidak perlu)
cp "$SIAKAD_DIR/Code.js" "$PROJECT_DIR/"
cp "$SIAKAD_DIR/_helper.js" "$PROJECT_DIR/"
cp "$SIAKAD_DIR/dashboard.js" "$PROJECT_DIR/"
cp "$SIAKAD_DIR/laporan.js" "$PROJECT_DIR/"
cp "$SIAKAD_DIR/appsscript.json" "$PROJECT_DIR/"
cp "$SIAKAD_DIR/.claspignore" "$PROJECT_DIR/"
cp "$SIAKAD_DIR/.gitignore" "$PROJECT_DIR/"
cp "$SIAKAD_DIR/README.md" "$PROJECT_DIR/"

# Copy folder views
cp -r "$SIAKAD_DIR/views" "$PROJECT_DIR/"

echo -e "  ${GREEN}✅ File server (Code.js, _helper.js, dll)${NC}"
echo -e "  ${GREEN}✅ Folder views (layout, auth, modules, scripts)${NC}"
echo -e "  ${GREEN}✅ File konfigurasi (appsscript.json, .claspignore)${NC}"
echo ""

# ==========================================
# SETUP CLASP
# ==========================================
echo -e "${CYAN}[4/7] Setup Clasp & Login Google...${NC}"

cd "$PROJECT_DIR"

# Cek apakah sudah login clasp
clasp status &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "  ${YELLOW}   Membuka browser untuk login Google...${NC}"
    clasp login
    if [ $? -ne 0 ]; then
        echo -e "  ${RED}❌ Gagal login clasp. Jalankan manual: clasp login${NC}"
        exit 1
    fi
    echo -e "  ${GREEN}✅ Login berhasil${NC}"
else
    echo -e "  ${GREEN}✅ Sudah login clasp${NC}"
fi

echo ""

# ==========================================
# BUAT APPS SCRIPT PROJECT
# ==========================================
echo -e "${CYAN}[5/7] Membuat Project Apps Script...${NC}"

APP_TITLE=$(echo "$PROJECT_NAME" | sed 's/-/ /g; s/_/ /g; s/\b\(.\)/\u\1/g')

clasp create --title "$APP_TITLE" --type sheets --rootDir "$PROJECT_DIR" 2>&1
CLASP_EXIT=$?

if [ $CLASP_EXIT -ne 0 ]; then
    echo -e "  ${YELLOW}⚠️  Gagal membuat project otomatis. Buat manual:${NC}"
    echo -e "  ${YELLOW}   1. Buka https://script.google.com${NC}"
    echo -e "  ${YELLOW}   2. Klik 'New project'${NC}"
    echo -e "  ${YELLOW}   3. Copy Script ID dari URL${NC}"
    echo -e "  ${YELLOW}   4. Paste ke ${PROJECT_DIR}/.clasp.json${NC}"
    echo ""
    read -p "  Paste Script ID manual: " MANUAL_SCRIPT_ID
    if [ -n "$MANUAL_SCRIPT_ID" ]; then
        cat > "$PROJECT_DIR/.clasp.json" << EOF
{"scriptId":"${MANUAL_SCRIPT_ID}","rootDir":"${PROJECT_DIR}","parentId":["${MANUAL_SCRIPT_ID}"]}
EOF
        echo -e "  ${GREEN}✅ Script ID tersimpan${NC}"
    fi
else
    echo -e "  ${GREEN}✅ Project '${APP_TITLE}' berhasil dibuat${NC}"
fi

echo ""

# ==========================================
# PUSH KE APPS SCRIPT
# ==========================================
echo -e "${CYAN}[6/7] Push File ke Apps Script...${NC}"

clasp push
if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✅ Semua file berhasil di-push${NC}"
else
    echo -e "  ${RED}❌ Gagal push. Cek .claspignore dan coba: clasp push${NC}"
fi

echo ""

# ==========================================
# INSTRUKSI SELANJUTNYA
# ==========================================
echo -e "${CYAN}[7/7] Selesai! 🎉${NC}"
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  PROJECT BERHASIL DIBUAT${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "  ${YELLOW}Lokasi project:${NC}"
echo -e "  ${PROJECT_DIR}"
echo ""
echo -e "  ${YELLOW}Langkah selanjutnya:${NC}"
echo ""
echo -e "  1. Buka project:"
echo -e "     ${CYAN}cd ${PROJECT_DIR}${NC}"
echo ""
echo -e "  2. Buka Google Sheets:"
echo -e "     ${CYAN}https://sheets.google.com${NC}"
echo -e "     Buat sheet bernama ${YELLOW}Users${NC} dengan header: username, password"
echo -e "     Isi baris 2: admin | admin123"
echo -e "     Copy SPREADSHEET_ID dari URL spreadsheet"
echo ""
echo -e "  3. Buka editor Apps Script:"
echo -e "     ${CYAN}clasp open${NC}"
echo ""
echo -e "  4. Di editor, buka Code.js, jalankan fungsi:"
echo -e "     ${CYAN}setupConfig()${NC}"
echo -e "     Ganti SPREADSHEET_ID dengan ID spreadsheet Anda"
echo -e "     Jalankan ${CYAN}setupConfig()${NC} sekali lagi"
echo ""
echo -e "  5. Generate entitas CRUD (opsional):"
echo -e "     ${CYAN}node ${SIAKAD_DIR}/generate-crud.js Jurusan --fields nama:text,kode:text${NC}"
echo -e "     ${CYAN}node ${SIAKAD_DIR}/generate-crud.js Siswa --fields nama:text,kelas:radio:XI,XII,jurusan:dropdown:RPL,TKJ,AKL${NC}"
echo ""
echo -e "  6. Push ulang & deploy:"
echo -e "     ${CYAN}clasp push${NC}"
echo ""
echo -e "  7. Deploy Web App:"
echo -e "     Di editor → Deploy → New deployment → Web app → Deploy"
echo -e "     Copy URL dan buka di browser"
echo ""
echo -e "  8. Login:"
echo -e "     Username: ${YELLOW}admin${NC}"
echo -e "     Password: ${YELLOW}admin123${NC}"
echo ""
echo -e "${MAGENTA}============================================${NC}"
echo -e "${MAGENTA}  SELAMAT MENCOBA! 🚀${NC}"
echo -e "${MAGENTA}============================================${NC}"
echo ""

