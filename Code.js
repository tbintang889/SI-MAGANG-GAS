// ==========================================
// KONFIGURASI
// ==========================================
function getSpreadsheetId() {
  return PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '';
}

function setupConfig() {
  PropertiesService.getScriptProperties().setProperties({
    SPREADSHEET_ID: 'ISI_ID_SPREADSHEET_DISINI',
    APP_NAME: 'APLIKASI_ANDA'
  });
  return { success: true, message: 'Konfigurasi tersimpan. Ganti SPREADSHEET_ID dengan ID spreadsheet Anda.' };
}

function getConfiguredSpreadsheet() {
  var id = getSpreadsheetId();
  if (!id) throw new Error('SPREADSHEET_ID belum dikonfigurasi. Jalankan setupConfig() dulu.');
  return SpreadsheetApp.openById(id);
}

function getSheet(sheetName) {
  return getConfiguredSpreadsheet().getSheetByName(sheetName);
}

function ensureSheet(sheetName, headers) {
  var sheet = getSheet(sheetName);
  if (!sheet) {
    sheet = getConfiguredSpreadsheet().insertSheet(sheetName);
    if (headers && headers.length > 0) sheet.appendRow(headers);
  }
  return sheet;
}

function generateId(prefix) {
  return prefix + '-' + new Date().getTime();
}

function hashPassword(password) {
  var normalized = String(password || '').trim();
  if (!normalized) return '';
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, normalized);
  return bytes.map(function(b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
}

function isPasswordValid(stored, provided) {
  var s = String(stored || '').trim();
  var p = String(provided || '').trim();
  if (!s || !p) return false;
  if (s.length === 64) return s === hashPassword(p);
  return s === p;
}

function buildResult(success, message) {
  return { success: success, message: message };
}

// ==========================================
// ENTRY POINT
// ==========================================
function resolveTemplatePath(filename) {
  var map = {
    'Head': 'views/layout/Head',
    'Login': 'views/auth/Login',
    'Aside': 'views/layout/Aside',
    'Index': 'views/layout/Index',
    'dashboardView': 'views/modules/dashboardView',
    'Javascript': 'views/scripts/Javascript',
    'JavascriptHelper': 'views/scripts/helper/JavascriptHelper',
    'JavascriptCore': 'views/scripts/core/JavascriptCore',
    'JavascriptLogin': 'views/scripts/modules/login/JavascriptLogin',
    'JavascriptCrud': 'views/scripts/modules/crud/JavascriptCrud',
    'JavascriptDashboard': 'views/scripts/modules/dashboard/JavascriptDashboard',
    'JavascriptLaporan': 'views/scripts/modules/laporan/JavascriptLaporan',
    // >>> Tambahkan mapping view entitas baru di sini <<<
   
  };
  return map[filename] || filename;
}

function doGet() {
  return HtmlService.createTemplateFromFile(resolveTemplatePath('Index'))
    .evaluate()
    .setTitle('Aplikasi Saya')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createTemplateFromFile(resolveTemplatePath(filename)).evaluate().getContent();
}

// ==========================================
// LOGIN
// ==========================================
function checkLogin(username, password) {
  try {
    if (typeof username === 'object' && password === undefined) {
      var creds = username;
      username = creds.username;
      password = creds.password;
    }
    var sheet = ensureSheet('Users', ['username', 'password']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').trim() === String(username || '').trim()) {
        if (isPasswordValid(data[i][1], password)) {
          return buildResult(true, 'Login berhasil!');
        }
      }
    }
    return buildResult(false, 'Username atau Password salah.');
  } catch (e) {
    return buildResult(false, 'Error: ' + e.message);
  }
}

