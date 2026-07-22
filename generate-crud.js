/**
 * ==========================================
 * SIAKAD CRUD GENERATOR CLI
 * ==========================================
 * 
 * Penggunaan:
 *   node generate-crud.js <entityName> [options]
 * 
 * Contoh:
 *   node generate-crud.js Jurusan
 *   node generate-crud.js Kelas --fields nama:text,tingkat:dropdown:10,11,12
 *   node generate-crud.js Ruangan --prefix RG --icon house --title "Manajemen Ruangan"
 * 
 * Options:
 *   --fields   Daftar field format: nama:type:options (pisah dengan koma)
 *              type: text, number, email, textarea, radio, dropdown
 *              options: untuk radio/dropdown, pisah dengan koma (setelah ':')
 *              Contoh: --fields nama:text,kelas:radio:XI,XII,jurusan:dropdown:RPL,PPLG,TKJ
 *   --prefix   Prefix ID (default: huruf pertama entity + UR, misal JUR)
 *   --icon     Icon untuk sidebar (default: clipboard)
 *   --title    Judul menu (default: "Manajemen Data {Entity}")
 *   --force    Overwrite existing files
 *   --dry-run  Show what would be done without making changes
 * 
 * ==========================================
 */

// Guard: prevent execution in non-Node.js environments (e.g. Google Apps Script)
if (typeof require === 'undefined' || typeof module === 'undefined') {
  // Running in GAS or browser; do nothing
} else {
  main();
}

function main() {
const fs = require('fs');
const path = require('path');

// ==========================================
// 1. PARSE ARGUMENTS
// ==========================================
const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
  SIAKAD CRUD GENERATOR

  Usage:
    node generate-crud.js <entityName> [options]

  Examples:
    node generate-crud.js Jurusan
    node generate-crud.js Kelas --fields nama:text,tingkat:dropdown:10,11,12
    node generate-crud.js Ruangan --prefix RG --icon house --title "Manajemen Ruangan"

  Options:
    --fields   Field definitions (format: name:type:opt1,opt2)
              Supported types: text, number, email, textarea, radio, dropdown
              Default: nama:text,kode:text
    --prefix   ID prefix (default: first letters of entity + UR)
    --icon     Sidebar icon (default: clipboard)
    --title    Menu title (default: "Manajemen Data {Entity}")
    --force    Overwrite existing files
    --dry-run  Show what would be done without making changes
  `);
  process.exit(0);
}

const entityName = args[0];
const entityKey = entityName.toLowerCase();
const entityCapital = entityName.charAt(0).toUpperCase() + entityName.slice(1);
const entityLower = entityName.toLowerCase();

// Parse options
const options = {
  fields: null,
  prefix: entityName.charAt(0).toUpperCase() + 'UR',
  icon: '📋',
  title: 'Manajemen Data ' + entityCapital,
  force: false,
  dryRun: false,
};

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--fields' && args[i + 1]) {
    options.fields = parseFields(args[i + 1]);
    i++;
  } else if (args[i] === '--prefix' && args[i + 1]) {
    options.prefix = args[i + 1];
    i++;
  } else if (args[i] === '--icon' && args[i + 1]) {
    options.icon = args[i + 1];
    i++;
  } else if (args[i] === '--title' && args[i + 1]) {
    options.title = args[i + 1];
    i++;
  } else if (args[i] === '--force') {
    options.force = true;
  } else if (args[i] === '--dry-run') {
    options.dryRun = true;
  }
}

// Default fields if not specified
if (!options.fields) {
  options.fields = [
    { name: 'nama', type: 'text', placeholder: 'Nama ' + entityCapital, options: null },
    { name: 'kode', type: 'text', placeholder: 'Kode ' + entityCapital, options: null },
  ];
}

// ==========================================
// 2. PARSE FIELD DEFINITIONS
// ==========================================
function parseFields(fieldsStr) {
  return fieldsStr.split(',').map(function(fieldDef) {
    var parts = fieldDef.split(':');
    var name = parts[0];
    var type = parts[1] || 'text';
    
    var fieldOptions = null;
    var placeholder = name.charAt(0).toUpperCase() + name.slice(1);
    
    if (type === 'dropdown' || type === 'radio') {
      if (parts[2]) {
        fieldOptions = parts.slice(2).join(',').split(',');
      } else {
        fieldOptions = ['-- Pilih --'];
      }
    } else if (type === 'number') {
      placeholder = 'Masukkan ' + name;
    } else if (type === 'email') {
      placeholder = 'email@example.com';
    } else if (type === 'textarea') {
      placeholder = 'Masukkan ' + name;
    }
    
    return { name: name, type: type, placeholder: placeholder, options: fieldOptions };
  });
}

// ==========================================
// 3. GENERATE FILE CONTENTS
// ==========================================

// --- SERVER-SIDE FILE (e.g. Jurusan.js) ---
function generateServerFile() {
  var fields = options.fields;
  
  var headers = ['ID'];
  fields.forEach(function(f) {
    var label = f.name.charAt(0).toUpperCase() + f.name.slice(1);
    headers.push(label);
  });
  
  var colMappings = fields.map(function(f, i) {
    var colIndex = i + 2;
    var fieldName = f.name;
    return 'sheet.getRange(rowIndex, ' + colIndex + ').setValue(String(obj.' + fieldName + ' || "").trim());';
  }).join('\n        ');
  
  var validations = '';
  fields.forEach(function(f) {
    if (f.name === 'nama') {
      validations += 'if (!obj || !String(obj.nama || "").trim()) {\n      return { success: false, message: "Nama ' + entityLower + ' tidak boleh kosong." };\n    }';
    }
  });
  
  var appendParts = ['id'];
  fields.forEach(function(f) {
    appendParts.push('String(obj.' + f.name + ' || "").trim()');
  });
  var appendValues = appendParts.join(', ');

  var headerStrs = [];
  headers.forEach(function(h) {
    headerStrs.push("'" + h + "'");
  });

  return '// File: ' + entityCapital + '.js\n' +
'// Auto-generated by SIAKAD CRUD Generator\n' +
'// Generated at: ' + new Date().toISOString() + '\n' +
'\n' +
'/**\n' +
' * Ambil seluruh data ' + entityLower + ' dari sheet\n' +
' */\n' +
'function get' + entityCapital + '() {\n' +
'  var sheet = getSheet("' + entityCapital + '");\n' +
'  if (!sheet) return [];\n' +
'  var data = sheet.getDataRange().getValues();\n' +
'  if (data.length > 0) data.shift();\n' +
'  return data;\n' +
'}\n' +
'\n' +
'/**\n' +
' * Tambah data ' + entityLower + ' baru\n' +
' */\n' +
'function create' + entityCapital + '(obj) {\n' +
'  try {\n' +
'    ' + validations + '\n' +
'    var sheet = ensureSheet("' + entityCapital + '", [' + headerStrs.join(', ') + ']);\n' +
'    var id = generateId("' + options.prefix + '");\n' +
'    sheet.appendRow([' + appendValues + ']);\n' +
'    return { success: true, message: "Data ' + entityCapital + ' berhasil ditambahkan!" };\n' +
'  } catch (error) {\n' +
'    return { success: false, message: "Gagal menambah ' + entityLower + ': " + error.message };\n' +
'  }\n' +
'}\n' +
'\n' +
'/**\n' +
' * Update data ' + entityLower + '\n' +
' */\n' +
'function update' + entityCapital + '(obj) {\n' +
'  try {\n' +
'    if (!obj || !String(obj.id || "").trim()) {\n' +
'      return { success: false, message: "ID ' + entityLower + ' tidak valid." };\n' +
'    }\n' +
'    var sheet = ensureSheet("' + entityCapital + '", [' + headerStrs.join(', ') + ']);\n' +
'    var data = sheet.getDataRange().getValues();\n' +
'    for (var i = 1; i < data.length; i++) {\n' +
'      if (String(data[i][0] || "").toString() === String(obj.id || "").toString()) {\n' +
'        var rowIndex = i + 1;\n' +
'        ' + colMappings + '\n' +
'        return { success: true, message: "Data ' + entityCapital + ' berhasil diperbarui!" };\n' +
'      }\n' +
'    }\n' +
'    return { success: false, message: "' + entityCapital + ' tidak ditemukan." };\n' +
'  } catch (error) {\n' +
'    return { success: false, message: "Gagal memperbarui ' + entityLower + ': " + error.message };\n' +
'  }\n' +
'}\n' +
'\n' +
'/**\n' +
' * Hapus data ' + entityLower + '\n' +
' */\n' +
'function delete' + entityCapital + '(id) {\n' +
'  try {\n' +
'    var sheet = ensureSheet("' + entityCapital + '", [' + headerStrs.join(', ') + ']);\n' +
'    var data = sheet.getDataRange().getValues();\n' +
'    for (var i = 1; i < data.length; i++) {\n' +
'      if (String(data[i][0] || "").toString() === String(id || "").toString()) {\n' +
'        sheet.deleteRow(i + 1);\n' +
'        return { success: true, message: "Data ' + entityCapital + ' berhasil dihapus!" };\n' +
'      }\n' +
'    }\n' +
'    return { success: false, message: "' + entityCapital + ' tidak ditemukan." };\n' +
'  } catch (error) {\n' +
'    return { success: false, message: "Gagal menghapus ' + entityLower + ': " + error.message };\n' +
'  }\n' +
'}\n';
}

// --- VIEW FILE (e.g. views/modules/JurusanView.html) ---
function generateViewFile() {
  var cols = options.fields;
  
  var theadHtml = '';
  theadHtml += '          <th class="py-3 px-4">ID</th>\n';
  cols.forEach(function(c) {
    var label = c.name.charAt(0).toUpperCase() + c.name.slice(1);
    theadHtml += '          <th class="py-3 px-4">' + label + '</th>\n';
  });
  theadHtml += '          <th class="py-3 px-4 text-center">Aksi</th>';

  return '<!-- ========================================== -->\n' +
'<!-- MODUL: ' + entityCapital.toUpperCase() + ' (auto-generated) -->\n' +
'<!-- ========================================== -->\n' +
'<div id="modul' + entityCapital + '" class="hidden fade-in">\n' +
'  <!-- Form ' + entityCapital + ' (akan di-render otomatis oleh renderForm()) -->\n' +
'  <div class="bg-white p-6 rounded-xl shadow-sm border mb-6" id="form' + entityCapital + '">\n' +
'  \n' +
'  </div>\n' +
'  <!-- Tabel ' + entityCapital + ' -->\n' +
'  <div class="bg-white rounded-xl shadow-sm border overflow-hidden">\n' +
'    <table class="w-full text-left">\n' +
'      <thead class="bg-slate-50 border-b">\n' +
'        <tr>\n' +
theadHtml + '\n' +
'        </tr>\n' +
'      </thead>\n' +
'      <tbody id="tabel' + entityCapital + '" class="divide-y divide-slate-100"></tbody>\n' +
'    </table>\n' +
'  </div>\n' +
'</div>\n';
}

// --- CRUD CONFIG ENTRY ---
function generateCrudConfigEntry() {
  var cols = options.fields;
  
  var formFields = '';
  formFields += '        id:   { el: "' + entityKey + '_id", type: "hidden" },\n';
  cols.forEach(function(c) {
    var elId = entityKey + '_' + c.name;
    var label = c.name.charAt(0).toUpperCase() + c.name.slice(1);
    if (c.type === 'radio') {
      var opts = c.options ? c.options.map(function(o) { return "'" + o + "'"; }).join(', ') : '[]';
      formFields += '        ' + c.name + ': { el: "' + elId + '", type: "radio", label: "' + label + '", options: [' + opts + '] },\n';
    } else if (c.type === 'dropdown') {
      var opts = c.options ? c.options.map(function(o) { return "'" + o + "'"; }).join(', ') : "['-- Pilih --']";
      formFields += '        ' + c.name + ': { el: "' + elId + '", type: "dropdown", label: "' + label + '", options: [' + opts + '] },\n';
    } else if (c.type === 'textarea') {
      formFields += '        ' + c.name + ': { el: "' + elId + '", type: "textarea", label: "' + label + '", placeholder: "' + c.placeholder + '" },\n';
    } else {
      formFields += '        ' + c.name + ': { el: "' + elId + '", type: "' + c.type + '", label: "' + label + '", placeholder: "' + c.placeholder + '" },\n';
    }
  });
  // Remove trailing comma and newline
  formFields = formFields.replace(/,\n$/, '\n');
  
  var tableCols = '';
  tableCols += '        { label: "ID", key: 0 },\n';
  cols.forEach(function(c, i) {
    var label = c.name.charAt(0).toUpperCase() + c.name.slice(1);
    tableCols += '        { label: "' + label + '", key: ' + (i + 1) + ' },\n';
  });
  tableCols = tableCols.replace(/,\n$/, '\n');

  return '  ' + entityKey + ': {\n' +
'    formWrapperId: "form' + entityCapital + '",\n' +
'    tableId: "tabel' + entityCapital + '",\n' +
'    titleFormId: "titleForm' + entityCapital + '",\n' +
'    form: {\n' +
formFields +
'    },\n' +
'    btnSaveId: "btnSimpan' + entityCapital + '",\n' +
'    btnCancelId: "btnBatal' + entityCapital + '",\n' +
'    loader: ["get' + entityCapital + '"],\n' +
'    create: "create' + entityCapital + '",\n' +
'    update: "update' + entityCapital + '",\n' +
'    delete: "delete' + entityCapital + '",\n' +
'    tableColumns: [\n' +
tableCols +
'    ]\n' +
'  }';
}

// --- WRAPPER FUNCTIONS ---
function generateWrapperFunctions() {
  return 'function loadData' + entityCapital + '() { loadData("' + entityKey + '"); }\n' +
'function simpan' + entityCapital + '() { simpanData("' + entityKey + '"); }\n' +
'function edit' + entityCapital + '() { editData("' + entityKey + '"); }\n' +
'function resetForm' + entityCapital + '() { resetForm("' + entityKey + '"); }\n' +
'function hapus' + entityCapital + '() { hapusData("' + entityKey + '"); }\n' +
"renderForm('" + entityKey + "');\n";
}

// --- MENU REGISTRY ENTRY ---
function generateMenuRegistryEntry() {
  return '  ' + entityKey + ': {\n' +
'    title: "' + options.title + '",\n' +
'    loader: () => typeof loadData' + entityCapital + ' === "function" && loadData' + entityCapital + '()\n' +
'  }';
}

// --- SIDEBAR BUTTON ---
function generateSidebarButton() {
  var label = options.title.replace('Manajemen Data ', '');
  return '    <button onclick="pindahMenu(\'' + entityKey + '\')" id="menu' + entityCapital + 'Btn" class="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800">' + options.icon + ' ' + label + '</button>';
}

// --- INCLUDE LINE ---
function generateIncludeLine() {
  return '        <?!= include(\'' + entityCapital + 'View\'); ?>';
}

// --- CODE.JS PATH MAPPING ---
function generateCodeJsMapping() {
  return "    '" + entityCapital + "View': 'views/modules/" + entityCapital + "View',";
}

// ==========================================
// 4. FILE PATHS
// ==========================================
var ROOT = process.cwd();
var paths = {
  server: path.join(ROOT, entityCapital + '.js'),
  view: path.join(ROOT, 'views/modules/' + entityCapital + 'View.html'),
  crudHtml: path.join(ROOT, 'views/scripts/modules/crud/JavascriptCrud.html'),
  javascriptCore: path.join(ROOT, 'views/scripts/core/JavascriptCore.html'),
  asideHtml: path.join(ROOT, 'views/layout/Aside.html'),
  indexHtml: path.join(ROOT, 'views/layout/Index.html'),
  codeJs: path.join(ROOT, 'Code.js'),
};

// ==========================================
// 5. CHECK EXISTING FILES
// ==========================================
function checkExistingFiles() {
  var existing = [];
  if (fs.existsSync(paths.server)) existing.push(paths.server);
  if (fs.existsSync(paths.view)) existing.push(paths.view);
  if (existing.length > 0 && !options.force) {
    console.log('\nWarning: File berikut sudah ada:');
    existing.forEach(function(f) { console.log('   - ' + f); });
    console.log('\nGunakan --force untuk menimpa file yang ada.');
    return false;
  }
  return true;
}

// ==========================================
// 6. READ & UPDATE EXISTING FILES
// ==========================================

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error('Gagal membaca ' + filePath + ': ' + err.message);
    return null;
  }
}

function updateCrudConfig(content) {
  var entry = generateCrudConfigEntry();
  // Use the comment marker as insertion point
  var marker = '// >>> Entitas CRUD akan ditambahkan di sini oleh generate-crud.js <<<';
  var markerIndex = content.indexOf(marker);
  if (markerIndex === -1) {
    console.error('Tidak dapat menemukan marker crudConfig di JavascriptCrud.html');
    return null;
  }
  var insertPos = markerIndex + marker.length;
  // Insert comma AFTER the comment line ends (not on the // line, which would comment it out)
  return content.slice(0, insertPos) + '\n  , \n' + entry + content.slice(insertPos);
}

function addWrapperFunctions(content) {
  var funcs = generateWrapperFunctions();
  var match = content.lastIndexOf('</script>');
  if (match === -1) {
    console.error('Tidak dapat menemukan </script> di JavascriptCrud.html');
    return null;
  }
  return content.slice(0, match) + '\n' + funcs + '\n' + content.slice(match);
}

function updateMenuRegistry(content) {
  var entry = generateMenuRegistryEntry();
  // Use the comment marker as insertion point
  var marker = '// >>> Entitas CRUD baru akan ditambahkan otomatis di sini oleh generator <<<';
  var markerIndex = content.indexOf(marker);
  if (markerIndex === -1) {
    console.error('Tidak dapat menemukan marker menuRegistry di JavascriptCore.html');
    return null;
  }
  var insertPos = markerIndex + marker.length;
  // Insert comma AFTER the comment line ends (not on the // line, which would comment it out)
  return content.slice(0, insertPos) + '\n  , \n' + entry + content.slice(insertPos);
}

function addSidebarButton(content) {
  var btn = generateSidebarButton();
  var match = content.lastIndexOf('</nav>');
  if (match === -1) {
    console.error('Tidak dapat menemukan </nav> di Aside.html');
    return null;
  }
  return content.slice(0, match) + '\n' + btn + content.slice(match);
}

function addIncludeLine(content) {
  var line = generateIncludeLine();
  var modulIncludes = content.match(/<?!= include\('[A-Za-z]+View'\); ?>/g);
  if (!modulIncludes) {
    var match = content.match(/(\s*)(<\/div>\s*\n\s*<\/main>)/);
    if (!match) {
      console.error('Tidak dapat menemukan posisi include di Index.html');
      return null;
    }
    return content.slice(0, match.index) + line + '\n' + content.slice(match.index);
  }
  var lastInclude = modulIncludes[modulIncludes.length - 1];
  var lastPos = content.lastIndexOf(lastInclude) + lastInclude.length;
  return content.slice(0, lastPos) + '\n' + line + content.slice(lastPos);
}

function addCodeJsMapping(content) {
  var mapping = generateCodeJsMapping();
  // Use the comment marker as insertion point
  var marker = '// >>> Tambahkan mapping view entitas baru di sini <<<';
  var markerIndex = content.indexOf(marker);
  if (markerIndex === -1) {
    console.error('Tidak dapat menemukan marker mapping di Code.js');
    return null;
  }
  var insertPos = markerIndex + marker.length;
  return content.slice(0, insertPos) + '\n' + mapping + content.slice(insertPos);
}

// ==========================================
// 7. EXECUTE
// ==========================================

console.log('');
console.log('========================================');
console.log('  SIAKAD CRUD GENERATOR');
console.log('========================================');
console.log('  Entity : ' + entityCapital);
console.log('  Key    : ' + entityKey);
console.log('  Prefix : ' + options.prefix);
console.log('  Fields : ' + options.fields.length + ' field(s)');
console.log('========================================');
console.log('');

if (!checkExistingFiles()) {
  process.exit(1);
}

if (options.dryRun) {
  console.log('DRY RUN MODE - Tidak ada perubahan yang dibuat\n');
  console.log('Akan membuat file:');
  console.log('  + ' + paths.server);
  console.log('  + ' + paths.view);
  console.log('Akan mengupdate file:');
  console.log('  * ' + paths.crudHtml + ' (crudConfig + wrapper functions)');
  console.log('  * ' + paths.javascriptCore + ' (menuRegistry)');
  console.log('  * ' + paths.asideHtml + ' (sidebar button)');
  console.log('  * ' + paths.indexHtml + ' (include view)');
  console.log('  * ' + paths.codeJs + ' (path mapping)');
  process.exit(0);
}

var errors = [];

// 1. Server file
try {
  fs.writeFileSync(paths.server, generateServerFile(), 'utf-8');
  console.log('  + Created: ' + paths.server);
} catch (err) {
  errors.push('Gagal membuat ' + paths.server + ': ' + err.message);
  console.error('  X ' + errors[errors.length-1]);
}

// 2. View file
try {
  fs.writeFileSync(paths.view, generateViewFile(), 'utf-8');
  console.log('  + Created: ' + paths.view);
} catch (err) {
  errors.push('Gagal membuat ' + paths.view + ': ' + err.message);
  console.error('  X ' + errors[errors.length-1]);
}

// 3. JavascriptCrud.html
var crudContent = readFileSafe(paths.crudHtml);
if (crudContent) {
  var updated = updateCrudConfig(crudContent);
  if (updated) {
    updated = addWrapperFunctions(updated);
    if (updated) {
      try {
        fs.writeFileSync(paths.crudHtml, updated, 'utf-8');
        console.log('  * Updated: ' + paths.crudHtml + ' (crudConfig + wrapper functions)');
      } catch (err) {
        errors.push('Gagal menulis ' + paths.crudHtml + ': ' + err.message);
        console.error('  X ' + errors[errors.length-1]);
      }
    } else {
      errors.push('Gagal menambahkan wrapper functions');
    }
  } else {
    errors.push('Gagal menambahkan crudConfig entry');
  }
} else {
  errors.push('Gagal membaca ' + paths.crudHtml);
}

// 4. JavascriptCore.html (menuRegistry)
var coreContent = readFileSafe(paths.javascriptCore);
if (coreContent) {
  var updated = updateMenuRegistry(coreContent);
  if (updated) {
    try {
      fs.writeFileSync(paths.javascriptCore, updated, 'utf-8');
      console.log('  * Updated: ' + paths.javascriptCore + ' (menuRegistry)');
    } catch (err) {
      errors.push('Gagal menulis ' + paths.javascriptCore + ': ' + err.message);
      console.error('  X ' + errors[errors.length-1]);
    }
  } else {
    errors.push('Gagal menambahkan menuRegistry entry');
  }
} else {
  errors.push('Gagal membaca ' + paths.javascriptCore);
}

// 5. Aside.html
var asideContent = readFileSafe(paths.asideHtml);
if (asideContent) {
  var updated = addSidebarButton(asideContent);
  if (updated) {
    try {
      fs.writeFileSync(paths.asideHtml, updated, 'utf-8');
      console.log('  * Updated: ' + paths.asideHtml + ' (sidebar button)');
    } catch (err) {
      errors.push('Gagal menulis ' + paths.asideHtml + ': ' + err.message);
      console.error('  X ' + errors[errors.length-1]);
    }
  } else {
    errors.push('Gagal menambahkan sidebar button');
  }
} else {
  errors.push('Gagal membaca ' + paths.asideHtml);
}

// 6. Index.html
var indexContent = readFileSafe(paths.indexHtml);
if (indexContent) {
  var updated = addIncludeLine(indexContent);
  if (updated) {
    try {
      fs.writeFileSync(paths.indexHtml, updated, 'utf-8');
      console.log('  * Updated: ' + paths.indexHtml + ' (include view)');
    } catch (err) {
      errors.push('Gagal menulis ' + paths.indexHtml + ': ' + err.message);
      console.error('  X ' + errors[errors.length-1]);
    }
  } else {
    errors.push('Gagal menambahkan include line');
  }
} else {
  errors.push('Gagal membaca ' + paths.indexHtml);
}

// 7. Code.js
var codeContent = readFileSafe(paths.codeJs);
if (codeContent) {
  var updated = addCodeJsMapping(codeContent);
  if (updated) {
    try {
      fs.writeFileSync(paths.codeJs, updated, 'utf-8');
      console.log('  * Updated: ' + paths.codeJs + ' (path mapping)');
    } catch (err) {
      errors.push('Gagal menulis ' + paths.codeJs + ': ' + err.message);
      console.error('  X ' + errors[errors.length-1]);
    }
  } else {
    errors.push('Gagal menambahkan path mapping');
  }
} else {
  errors.push('Gagal membaca ' + paths.codeJs);
}

// ==========================================
// 8. SUMMARY
// ==========================================
console.log('');
console.log('========================================');
console.log('  GENERATION SUMMARY');
console.log('========================================');

if (errors.length === 0) {
  console.log('  Semua file berhasil dibuat!');
} else {
  console.log('  ' + errors.length + ' error(s) terjadi');
}
console.log('========================================');
console.log('');

if (errors.length > 0) {
  console.log('Errors:');
  errors.forEach(function(e) { console.log('  - ' + e); });
}

console.log('');
console.log('Langkah selanjutnya:');
console.log('  1. Jalankan: clasp push');
console.log('  2. Buka: clasp open');
console.log('  3. Jalankan fungsi setupConfig() jika belum');
console.log('  4. Pastikan sheet "' + entityCapital + '" ada di spreadsheet');
console.log('  5. Deploy ulang web app');
console.log('');
}

