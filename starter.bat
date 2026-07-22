@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ==========================================
:: SIAKAD STARTER SCRIPT (Windows CMD)
:: ==========================================
:: Script ini membantu setup project baru
:: dari SIAKAD Starter Template
:: ==========================================

title SIAKAD Starter - Setup Project Baru

echo.
echo ============================================
echo   🚀 SIAKAD STARTER TEMPLATE
echo   Google Apps Script + TailwindCSS + Chart.js
echo ============================================
echo.

:: ==========================================
:: CEK PRASYARAT
:: ==========================================
echo [1/7] Memeriksa Prasyarat...

:: Cek Node.js
where node >nul 2>nul
if %errorlevel%==0 (
    for /f "tokens=1-3" %%i in ('node -v') do set NODE_VER=%%i
    echo   [OK] Node.js %NODE_VER%
) else (
    echo   [ERROR] Node.js tidak ditemukan.
    echo   Download dari: https://nodejs.org/
    echo   Setelah install, jalankan ulang script ini.
    pause
    exit /b 1
)

:: Cek clasp
where clasp >nul 2>nul
if %errorlevel%==0 (
    echo   [OK] Clasp terinstall
) else (
    echo   [INFO] Clasp belum terinstall. Menginstall...
    npm install -g @google/clasp
    if !errorlevel!==0 (
        echo   [OK] Clasp berhasil diinstall
    ) else (
        echo   [ERROR] Gagal menginstall clasp.
        echo   Coba manual: npm install -g @google/clasp
        pause
        exit /b 1
    )
)

echo.

:: ==========================================
:: INPUT NAMA PROJECT
:: ==========================================
echo [2/7] Konfigurasi Project Baru
echo.
echo Folder template saat ini: %cd%

set /p PROJECT_NAME="Masukkan nama project baru (contoh: aplikasi-saya): "

if "%PROJECT_NAME%"=="" (
    echo   [ERROR] Nama project tidak boleh kosong.
    pause
    exit /b 1
)

:: Tentukan folder tujuan (parent folder)
set "PARENT_DIR=.."
set "PROJECT_DIR=%PARENT_DIR%\%PROJECT_NAME%"

if exist "%PROJECT_DIR%" (
    echo   [WARNING] Folder '%PROJECT_NAME%' sudah ada di %cd%\..
    set /p OVERWRITE="Timpa folder yang ada? (y/n): "
    if /i not "!OVERWRITE!"=="y" (
        echo   [ERROR] Dibatalkan.
        pause
        exit /b 1
    )
    rmdir /s /q "%PROJECT_DIR%"
)

echo   [OK] Project: %PROJECT_NAME%
echo   [OK] Lokasi: %PROJECT_DIR%
echo.

:: ==========================================
:: COPY STARTER FILES
:: ==========================================
echo [3/7] Menyalin File Starter...

:: Buat folder project
mkdir "%PROJECT_DIR%" 2>nul

:: Copy file server-side
copy "Code.js" "%PROJECT_DIR%\" >nul
copy "_helper.js" "%PROJECT_DIR%\" >nul
copy "dashboard.js" "%PROJECT_DIR%\" >nul
copy "laporan.js" "%PROJECT_DIR%\" >nul
copy "appsscript.json" "%PROJECT_DIR%\" >nul
copy ".claspignore" "%PROJECT_DIR%\" >nul
copy ".gitignore" "%PROJECT_DIR%\" >nul
copy "README.md" "%PROJECT_DIR%\" >nul

:: Copy folder views
xcopy "views" "%PROJECT_DIR%\views\" /E /I /Q >nul

echo   [OK] File server (Code.js, _helper.js, dll)
echo   [OK] Folder views (layout, auth, modules, scripts)
echo   [OK] File konfigurasi (appsscript.json, .claspignore)
echo.

:: ==========================================
:: SETUP CLASP
:: ==========================================
echo [4/7] Setup Clasp ^& Login Google...

cd /d "%PROJECT_DIR%"

:: Cek login clasp
clasp status >nul 2>nul
if %errorlevel% neq 0 (
    echo   Membuka browser untuk login Google...
    clasp login
    if %errorlevel% neq 0 (
        echo   [ERROR] Gagal login clasp. Jalankan manual: clasp login
        pause
        exit /b 1
    )
    echo   [OK] Login berhasil
) else (
    echo   [OK] Sudah login clasp
)

echo.

:: ==========================================
:: BUAT APPS SCRIPT PROJECT
:: ==========================================
echo [5/7] Membuat Project Apps Script...

:: Konversi nama project jadi title case
set "APP_TITLE=%PROJECT_NAME:-= %"
set "APP_TITLE=%APP_TITLE:_= %"

clasp create --title "%APP_TITLE%" --type sheets 2>&1
if %errorlevel% neq 0 (
    echo   [WARNING] Gagal membuat project otomatis.
    echo.
    echo   Buat manual:
    echo   1. Buka https://script.google.com
    echo   2. Klik 'New project'
    echo   3. Copy Script ID dari URL
    echo   4. Paste di sini
    echo.
    set /p MANUAL_SCRIPT_ID="Paste Script ID manual: "
    if not "!MANUAL_SCRIPT_ID!"=="" (
        (
            echo.{"scriptId":"!MANUAL_SCRIPT_ID!","rootDir":"%PROJECT_DIR%"}
        ) > ".clasp.json"
        echo   [OK] Script ID tersimpan
    )
) else (
    echo   [OK] Project '%APP_TITLE%' berhasil dibuat
)

echo.

:: ==========================================
:: PUSH KE APPS SCRIPT
:: ==========================================
echo [6/7] Push File ke Apps Script...

clasp push
if %errorlevel%==0 (
    echo   [OK] Semua file berhasil di-push
) else (
    echo   [ERROR] Gagal push. Cek .claspignore dan coba: clasp push
)

echo.

:: ==========================================
:: INSTRUKSI SELANJUTNYA
:: ==========================================
echo [7/7] Selesai! 🎉
echo.
echo ============================================
echo   PROJECT BERHASIL DIBUAT
echo ============================================
echo.
echo Lokasi project:
echo   %PROJECT_DIR%
echo.
echo Langkah selanjutnya:
echo.
echo   1. Buka project:
echo      cd /d "%PROJECT_DIR%"
echo.
echo   2. Buka Google Sheets:
echo      https://sheets.google.com
echo      Buat sheet bernama Users dengan header: username, password
echo      Isi baris 2: admin ^| admin123
echo      Copy SPREADSHEET_ID dari URL spreadsheet
echo.
echo   3. Buka editor Apps Script:
echo      clasp open
echo.
echo   4. Di editor, buka Code.js, jalankan fungsi:
echo      setupConfig()
echo      Ganti SPREADSHEET_ID dengan ID spreadsheet Anda
echo      Jalankan setupConfig() sekali lagi
echo.
echo   5. Generate entitas CRUD (opsional):
echo      node "%cd%\generate-crud.js" Jurusan --fields nama:text,kode:text
echo      node "%cd%\generate-crud.js" Siswa --fields nama:text,kelas:radio:XI,XII,jurusan:dropdown:RPL,TKJ,AKL
echo.
echo   6. Push ulang ^& deploy:
echo      clasp push
echo.
echo   7. Deploy Web App:
echo      Di editor ^> Deploy ^> New deployment ^> Web app ^> Deploy
echo      Copy URL dan buka di browser
echo.
echo   8. Login:
echo      Username: admin
echo      Password: admin123
echo.
echo ============================================
echo   SELAMAT MENCOBA! 🚀
echo ============================================
echo.

pause

