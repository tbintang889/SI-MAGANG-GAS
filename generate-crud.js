/**
 * ==========================================
 * 🚀 SIAKAD CRUD GENERATOR CLI
 * ==========================================
 * 
 * Penggunaan:
 *   node generate-crud.js <entityName> [options]
 * 
 * Contoh:
 *   node generate-crud.js Jurusan
 *   node generate-crud.js Kelas --fields nama:text,tingkat:dropdown:10,11,12
 *   node generate-crud.js Ruangan --prefix RG --icon 🏠 --title "Manajemen Ruangan"
 * 
 * Options:
 *   --fields   Daftar field format: nama:type:options (pisah dengan koma)
 *              type: text, number, email, textarea, radio, dropdown
 *              options: untuk radio/dropdown, pisah dengan koma (setelah ':')
 *              Contoh: --fields nama:text,kelas:radio:XI,XII,jurusan:dropdown:RPL,PPLG,TKJ
 *   --prefix   Prefix ID (default: huruf pertama entity + UR, misal JUR)
 *   --icon     Icon untuk sidebar (default: 📋)
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
  🚀 SIAKAD CRUD GENERATOR

  Usage:
    node generate-crud.js <entityName> [options]

  Examples:
    node generate-crud.js Jurusan
    node generate-crud.js Kelas --fields nama:text,tingkat:dropdown:10,11,12
    node generate-crud.js Ruangan --prefix RG --icon 🏠 --title "Manajemen Ruangan"

  Options:
    --fields   Field definitions (format: name:type:opt1,opt2)
              Supported types: text, number, email, textarea, radio, dropdown
              Default: nama:text,kode:text
    --prefix   ID prefix (default: first letters of entity + UR)
    --icon     Sidebar icon (default: 📋)
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
  title: `Manajemen Data ${entityCapital}`,
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
    { name: 'nama', type: 'text', placeholder: `Nama ${entityCapital}`, options: null },
    { name: 'kode', type: 'text', placeholder: `Kode ${entityCapital}`, options: null },
  ];
}

// ==========================================
// 2. PARSE FIELD DEFINITIONS
// ==========================================
function parseFields(fieldsStr) {
  return fieldsStr.split(',').map(fieldDef => {
    const parts = fieldDef.split(':');
    const name = parts[0];
    const type = parts[1] || 'text';
    
    let options = null;
    let placeholder = name.charAt(0).toUpperCase() + name.slice(1);
    
    if (type === 'dropdown' || type === 'radio') {
      if (parts[2]) {
        options = parts.slice(2).join(',').split(',');
      } else {
        options = ['-- Pilih --'];
      }
    } else if (type === 'number') {
      placeholder = `Masukkan ${name}`;
    } else if (type === 'email') {
      placeholder = `email@example.com`;
    } else if (type === 'textarea') {
      placeholder = `Masukkan ${name}`;
    }
    
    return { name, type, placeholder, options };
  });
}

// ==========================================
// 3. GENERATE FILE CONTENTS
// ==========================================

// --- SERVER-SIDE FILE (e.g. Jurusan.js) ---
function generateServerFile() {
  const fields = options.fields;
  
  const headers = ['ID', ...fields.map(f => {
    const label = f.name.charAt(0).toUpperCase() + f.name.slice(1);
    return label;
  })];
  
  const colMappings = fields.map((f, i) => {
    const colIndex = i + 2;
    const fieldName = f.name;
    return `sheet.getRange(rowIndex, ${colIndex}).setValue(String(obj.${fieldName} || '').trim());`;
  }).join('\n        ');
  
  const validations = fields.map(f => {
    if (f.name === 'nama') {
      return `if (!obj || !String(obj.nama || '').trim()) {\n      return { success: false, message: 'Nama ${entityLower} tidak boleh kosong.' };\n    }`;
    }
    return null;
  }).filter(Boolean).join('\n    ');
  
  const appendValues = ['id', ...fields.map(f => `String(obj.${f.name} || '').trim()`)];

  return `// File: ${entityCapital}.js
// Auto-generated by SIAKAD CRUD Generator
// Generated at: ${new Date().toISOString()}

/**
 * Ambil seluruh data ${entityLower} dari sheet
 */
function get${entityCapital}() {
  var sheet = getSheet('${entityCapital}');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift();
  return data;
}

/**
 * Tambah data ${entityLower} baru
 */
function create${entityCapital}(obj) {
  try {
    ${validations}
    var sheet = ensureSheet('${entityCapital}', [${headers.map(h => `'${h}'`).join(', ')}]);
    var id = generateId('${options.prefix}');
    sheet.appendRow([${appendValues.join(', ')}]);
    return { success: true, message: 'Data ${entityCapital} berhasil ditambahkan!' };
  } catch (error) {
    return { success: false, message: 'Gagal menambah ${entityLower}: ' + error.message };
  }
}

/**
 * Update data ${entityLower}
 */
function update${entityCapital}(obj) {
  try {
    if (!obj || !String(obj.id || '').trim()) {
      return { success: false, message: 'ID ${entityLower} tidak valid.' };
    }
    var sheet = ensureSheet('${entityCapital}', [${headers.map(h => `'${h}'`).join(', ')}]);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').toString() === String(obj.id || '').toString()) {
        var rowIndex = i + 1;
        ${colMappings}
        return { success: true, message: 'Data ${entityCapital} berhasil diperbarui!' };
      }
    }
    return { success: false, message: '${entityCapital} tidak ditemukan.' };
  } catch (error) {
    return { success: false, message: 'Gagal memperbarui ${entityLower}: ' + error.message };
  }
}

/**
 * Hapus data ${entityLower}
 */
function delete${entityCapital}(id) {
  try {
    var sheet = ensureSheet('${entityCapital}', [${headers.map(h => `'${h}'`).join(', ')}]);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').toString() === String(id || '').toString()) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Data ${entityCapital} berhasil dihapus!' };
      }
    }
    return { success: false, message: '${entityCapital} tidak ditemukan.' };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus ${entityLower}: ' + error.message };
  }
}
`;
}

// --- VIEW FILE (e.g. views/modules/JurusanView.html) ---
function generateViewFile() {
  const cols = options.fields;
  
  let theadHtml = '';
  theadHtml += '          <th class="py-3 px-4">ID</th>\n';
  cols.forEach(c => {
    const label = c.name.charAt(0).toUpperCase() + c.name.slice(1);
    theadHtml += `          <th class="py-3 px-4">${label}</th>\n`;
  });
  theadHtml += '          <th class="py-3 px-4 text-center">Aksi</th>';

  return `<!-- ========================================== -->
<!-- MODUL: ${entityCapital.toUpperCase()} (auto-generated) -->
<!-- ========================================== -->
<div id="modul${entityCapital}" class="hidden fade-in">
  <!-- Form ${entityCapital} (akan di-render otomatis oleh renderForm()) -->
  <div class="bg-white p-6 rounded-xl shadow-sm border mb-6" id="form${entityCapital}">
  
  </div>
  <!-- Tabel ${entityCapital} -->
  <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
    <table class="w-full text-left">
      <thead class="bg-slate-50 border-b">
        <tr>
${theadHtml}
        </tr>
      </thead>
      <tbody id="tabel${entityCapital}" class="divide-y divide-slate-100"></tbody>
    </table>
  </div>
</div>
`;
}

// --- CRUD CONFIG ENTRY ---
function generateCrudConfigEntry() {
  const cols = options.fields;
  
  let formFields = '';
  formFields += `        id:   { el: '${entityKey}_id', type: 'hidden' },\n`;
  cols.forEach(c => {
    const elId = `${entityKey}_${c.name}`;
    if (c.type === 'radio') {
      const opts = c.options ? c.options.map(o => `'${o}'`).join(', ') : "[]";
      formFields += `        ${c.name}: { el: '${elId}', type: 'radio', options: [${opts}] },\n`;
    } else if (c.type === 'dropdown') {
      const opts = c.options ? c.options.map(o => `'${o}'`).join(', ') : "['-- Pilih --']";
      formFields += `        ${c.name}: { el: '${elId}', type: 'dropdown', options: [${opts}] },\n`;
    } else if (c.type === 'textarea') {
      formFields += `        ${c.name}: { el: '${elId}', type: 'textarea', placeholder: '${c.placeholder}' },\n`;
    } else {
      formFields += `        ${c.name}: { el: '${elId}', type: '${c.type}', placeholder: '${c.placeholder}' },\n`;
    }
  });
  formFields = formFields.replace(/,\n$/, '\n');
  
  let tableCols = '';
  tableCols += `        { label: 'ID', key: 0 },\n`;
  cols.forEach((c, i) => {
    const label = c.name.charAt(0).toUpperCase() + c.name.slice(1);
    tableCols += `        { label: '${label}', key: ${i + 1} },\n`;
  });
  tableCols = tableCols.replace(/,\n$/, '\n');

  return `  ${entityKey}: {
    formWrapperId: 'form${entityCapital}',
    tableId: 'tabel${entityCapital}',
    titleFormId: 'titleForm${entityCapital}',
    form: {
${formFields}
    },
    btnSaveId: 'btnSimpan${entityCapital}',
    btnCancelId: 'btnBatal${entityCapital}',
    loader: ['get${entityCapital}'],
    create: 'create${entityCapital}',
    update: 'update${entityCapital}',
    delete: 'delete${entityCapital}',
    tableColumns: [
${tableCols}
    ]
  }`;
}

// --- WRAPPER FUNCTIONS ---
function generateWrapperFunctions() {
  return `function loadData${entityCapital}() { loadData('${entityKey}'); }
function simpan${entityCapital}() { simpanData('${entityKey}'); }
function edit${entityCapital}() { editData('${entityKey}'); }
function resetForm${entityCapital}() { resetForm('${entityKey}'); }
function hapus${entityCapital}() { hapusData('${entityKey}'); }
renderForm('${entityKey}');
`;
}

// --- MENU REGISTRY ENTRY ---
function generateMenuRegistryEntry() {
  return `  ${entityKey}: {
    title: "${options.title}",
    loader: () => typeof loadData${entityCapital} === 'function' && loadData${entityCapital}()
  }`;
}

// --- SIDEBAR BUTTON ---
function generateSidebarButton() {
  return `    <button onclick="pindahMenu('${entityKey}')" id="menu${entityCapital}Btn" class="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800">${options.icon} ${options.title.replace('Manajemen Data ', '')}</button>`;
}

// --- INCLUDE LINE ---
function generateIncludeLine() {
  return `        <?!= include('${entityCapital}View'); ?>`;
}

// --- CODE.JS PATH MAPPING ---
function generateCodeJsMapping() {
  return `    '${entityCapital}View': 'views/modules/${entityCapital}View',`;
}

// ==========================================
// 4. FILE PATHS
// ==========================================
const ROOT = 'd:/GAS/siakad';
const paths = {
  server: path.join(ROOT, `${entityCapital}.js`),
  view: path.join(ROOT, `views/modules/${entityCapital}View.html`),
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
  const existing = [];
  if (fs.existsSync(paths.server)) existing.push(paths.server);
  if (fs.existsSync(paths.view)) existing.push(paths.view);
  if (existing.length > 0 && !options.force) {
    console.log(`\n⚠️  File berikut sudah ada:`);
    existing.forEach(f => console.log(`   - ${f}`));
    console.log(`\nGunakan --force untuk menimpa file yang ada.`);
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
    console.error(`❌ Gagal membaca ${filePath}: ${err.message}`);
    return null;
  }
}

function updateCrudConfig(content) {
  const entry = generateCrudConfigEntry();
  const match = content.match(/(\s*}\s*);\s*\n\s*function renderForm/);
  if (!match) {
    console.error('❌ Tidak dapat menemukan akhir crudConfig di JavascriptCrud.html');
    return null;
  }
  const insertPos = match.index;
  return content.slice(0, insertPos) + `,\n${entry}\n` + content.slice(insertPos);
}

function addWrapperFunctions(content) {
  const funcs = generateWrapperFunctions();
  const match = content.lastIndexOf('</script>');
  if (match === -1) {
    console.error('❌ Tidak dapat menemukan </script> di JavascriptCrud.html');
    return null;
  }
  return content.slice(0, match) + `\n${funcs}\n` + content.slice(match);
}

function updateMenuRegistry(content) {
  const entry = generateMenuRegistryEntry();
  const match = content.match(/(\s*}\s*)\s*;\s*\n\s*function registerMenu/);
  if (!match) {
    console.error('❌ Tidak dapat menemukan akhir menuRegistry di JavascriptCore.html');
    return null;
  }
  const insertPos = match.index;
  return content.slice(0, insertPos) + `,\n${entry}\n` + content.slice(insertPos);
}

function addSidebarButton(content) {
  const btn = generateSidebarButton();
  const match = content.lastIndexOf('</nav>');
  if (match === -1) {
    console.error('❌ Tidak dapat menemukan </nav> di Aside.html');
    return null;
  }
  return content.slice(0, match) + `\n${btn}` + content.slice(match);
}

function addIncludeLine(content) {
  const line = generateIncludeLine();
  const modulIncludes = content.match(/<?!= include\('[A-Za-z]+View'\); ?>/g);
  if (!modulIncludes) {
    const match = content.match(/(\s*)(<\/div>\s*\n\s*<\/main>)/);
    if (!match) {
      console.error('❌ Tidak dapat menemukan posisi include di Index.html');
      return null;
    }
    return content.slice(0, match.index) + `${line}\n` + content.slice(match.index);
  }
  const lastInclude = modulIncludes[modulIncludes.length - 1];
  const lastPos = content.lastIndexOf(lastInclude) + lastInclude.length;
  return content.slice(0, lastPos) + `\n${line}` + content.slice(lastPos);
}

function addCodeJsMapping(content) {
  const mapping = generateCodeJsMapping();
  const match = content.match(/(\s*'JavascriptDashboard': 'views\/scripts\/modules\/dashboard\/JavascriptDashboard')(\s*)/);
  if (!match) {
    console.error('❌ Tidak dapat menemukan mapping terakhir di Code.js');
    return null;
  }
  const insertPos = match.index + match[1].length;
  return content.slice(0, insertPos) + `,\n${mapping}` + content.slice(insertPos);
}

// ==========================================
// 7. EXECUTE
// ==========================================

console.log(`
╔══════════════════════════════════════╗
║  🚀 SIAKAD CRUD GENERATOR           ║
╠══════════════════════════════════════╣
║  Entity : ${entityCapital.padEnd(28)}║
║  Key    : ${entityKey.padEnd(28)}║
║  Prefix : ${options.prefix.padEnd(28)}║
║  Fields : ${options.fields.length} field(s)${' '.repeat(18 - String(options.fields.length).length)}║
╚══════════════════════════════════════╝
`);

if (!checkExistingFiles()) {
  process.exit(1);
}

if (options.dryRun) {
  console.log(`🔍 DRY RUN MODE - Tidak ada perubahan yang dibuat\n`);
  console.log(`Akan membuat file:`);
  console.log(`  ✅ ${paths.server}`);
  console.log(`  ✅ ${paths.view}`);
  console.log(`Akan mengupdate file:`);
  console.log(`  🔧 ${paths.crudHtml} (crudConfig + wrapper functions)`);
  console.log(`  🔧 ${paths.javascriptCore} (menuRegistry)`);
  console.log(`  🔧 ${paths.asideHtml} (sidebar button)`);
  console.log(`  🔧 ${paths.indexHtml} (include view)`);
  console.log(`  🔧 ${paths.codeJs} (path mapping)`);
  process.exit(0);
}

let errors = [];

// 1. Server file
try {
  fs.writeFileSync(paths.server, generateServerFile(), 'utf-8');
  console.log(`  ✅ Created: ${paths.server}`);
} catch (err) {
  errors.push(`Gagal membuat ${paths.server}: ${err.message}`);
  console.error(`  ❌ ${errors[errors.length-1]}`);
}

// 2. View file
try {
  fs.writeFileSync(paths.view, generateViewFile(), 'utf-8');
  console.log(`  ✅ Created: ${paths.view}`);
} catch (err) {
  errors.push(`Gagal membuat ${paths.view}: ${err.message}`);
  console.error(`  ❌ ${errors[errors.length-1]}`);
}

// 3. JavascriptCrud.html
let crudContent = readFileSafe(paths.crudHtml);
if (crudContent) {
  let updated = updateCrudConfig(crudContent);
  if (updated) {
    updated = addWrapperFunctions(updated);
    if (updated) {
      try {
        fs.writeFileSync(paths.crudHtml, updated, 'utf-8');
        console.log(`  ✅ Updated: ${paths.crudHtml} (crudConfig + wrapper functions)`);
      } catch (err) {
        errors.push(`Gagal menulis ${paths.crudHtml}: ${err.message}`);
        console.error(`  ❌ ${errors[errors.length-1]}`);
      }
    } else {
      errors.push(`Gagal menambahkan wrapper functions`);
    }
  } else {
    errors.push(`Gagal menambahkan crudConfig entry`);
  }
} else {
  errors.push(`Gagal membaca ${paths.crudHtml}`);
}

// 4. JavascriptCore.html (menuRegistry)
let coreContent = readFileSafe(paths.javascriptCore);
if (coreContent) {
  const updated = updateMenuRegistry(coreContent);
  if (updated) {
    try {
      fs.writeFileSync(paths.javascriptCore, updated, 'utf-8');
      console.log(`  ✅ Updated: ${paths.javascriptCore} (menuRegistry)`);
    } catch (err) {
      errors.push(`Gagal menulis ${paths.javascriptCore}: ${err.message}`);
      console.error(`  ❌ ${errors[errors.length-1]}`);
    }
  } else {
    errors.push(`Gagal menambahkan menuRegistry entry`);
  }
} else {
  errors.push(`Gagal membaca ${paths.javascriptCore}`);
}

// 5. Aside.html
let asideContent = readFileSafe(paths.asideHtml);
if (asideContent) {
  const updated = addSidebarButton(asideContent);
  if (updated) {
    try {
      fs.writeFileSync(paths.asideHtml, updated, 'utf-8');
      console.log(`  ✅ Updated: ${paths.asideHtml} (sidebar button)`);
    } catch (err) {
      errors.push(`Gagal menulis ${paths.asideHtml}: ${err.message}`);
      console.error(`  ❌ ${errors[errors.length-1]}`);
    }
  } else {
    errors.push(`Gagal menambahkan sidebar button`);
  }
} else {
  errors.push(`Gagal membaca ${paths.asideHtml}`);
}

// 6. Index.html
let indexContent = readFileSafe(paths.indexHtml);
if (indexContent) {
  const updated = addIncludeLine(indexContent);
  if (updated) {
    try {
      fs.writeFileSync(paths.indexHtml, updated, 'utf-8');
      console.log(`  ✅ Updated: ${paths.indexHtml} (include view)`);
    } catch (err) {
      errors.push(`Gagal menulis ${paths.indexHtml}: ${err.message}`);
      console.error(`  ❌ ${errors[errors.length-1]}`);
    }
  } else {
    errors.push(`Gagal menambahkan include line`);
  }
} else {
  errors.push(`Gagal membaca ${paths.indexHtml}`);
}

// 7. Code.js
let codeContent = readFileSafe(paths.codeJs);
if (codeContent) {
  const updated = addCodeJsMapping(codeContent);
  if (updated) {
    try {
      fs.writeFileSync(paths.codeJs, updated, 'utf-8');
      console.log(`  ✅ Updated: ${paths.codeJs} (path mapping)`);
    } catch (err) {
      errors.push(`Gagal menulis ${paths.codeJs}: ${err.message}`);
      console.error(`  ❌ ${errors[errors.length-1]}`);
    }
  } else {
    errors.push(`Gagal menambahkan path mapping`);
  }
} else {
  errors.push(`Gagal membaca ${paths.codeJs}`);
}

// ==========================================
// 8. SUMMARY
// ==========================================
console.log(`
╔══════════════════════════════════════╗
║  📋 GENERATION SUMMARY              ║
╠══════════════════════════════════════╣`);

if (errors.length === 0) {
  console.log(`║  ✅ Semua file berhasil dibuat!     ║`);
} else {
  console.log(`║  ⚠️  ${errors.length} error(s) terjadi          ║`);
}
console.log(`╚══════════════════════════════════════╝
`);

if (errors.length > 0) {
  console.log(`❌ Errors:`);
  errors.forEach(e => console.log(`   - ${e}`));
}

console.log(`
📋 Langkah selanjutnya:
   1. Jalankan: clasp push
   2. Buka: clasp open
   3. Jalankan fungsi setupConfig() jika belum
   4. Pastikan sheet "${entityCapital}" ada di spreadsheet
   5. Deploy ulang web app
`);
}



