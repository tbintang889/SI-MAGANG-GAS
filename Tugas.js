// File: Tugas.js
// Modul Transaksi Tugas

/**
 * Ambil seluruh data tugas dari sheet
 */
function getTugas() {
  var sheet = getSheet("Tugas");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift();
  return data;
}

/**
 * Ambil opsi siswa untuk dropdown
 */
function getOptionsSiswa() {
  var sheet = getSheet("Siswa");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length > 0) data.shift();
  return data.map(function(r) {
    return { id: r[0], nama: r[1] };
  });
}

/**
 * Tambah data tugas baru
 */
function createTugas(obj) {
  try {
    if (!obj || !String(obj.tugas || "").trim()) {
      return { success: false, message: "Deskripsi tugas tidak boleh kosong." };
    }
    
    // Validasi: jika status = done, nilai wajib
    if (obj.status === 'done' && (!obj.nilai || isNaN(Number(obj.nilai)))) {
      return { success: false, message: "Nilai wajib diisi jika status Done." };
    }

    var sheet = ensureSheet("Tugas", ['ID', 'SiswaID', 'ProjekID', 'Tugas', 'Bobot', 'Status', 'Nilai']);
    var id = generateId("TGS");
    sheet.appendRow([
      id,
      String(obj.siswa_id || "").trim(),
      String(obj.projek_id || "").trim(),
      String(obj.tugas || "").trim(),
      String(obj.bobot || "ringan").trim(),
      String(obj.status || "pending").trim(),
      String(obj.nilai || "").trim()
    ]);
    return { success: true, message: "Data Tugas berhasil ditambahkan!" };
  } catch (error) {
    return { success: false, message: "Gagal menambah tugas: " + error.message };
  }
}

/**
 * Update data tugas
 */
function updateTugas(obj) {
  try {
    if (!obj || !String(obj.id || "").trim()) {
      return { success: false, message: "ID tugas tidak valid." };
    }

    // Validasi: jika status = done, nilai wajib
    if (obj.status === 'done' && (!obj.nilai || isNaN(Number(obj.nilai)))) {
      return { success: false, message: "Nilai wajib diisi jika status Done." };
    }

    var sheet = ensureSheet("Tugas", ['ID', 'SiswaID', 'ProjekID', 'Tugas', 'Bobot', 'Status', 'Nilai']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || "").toString() === String(obj.id || "").toString()) {
        var rowIndex = i + 1;
        sheet.getRange(rowIndex, 2).setValue(String(obj.siswa_id || "").trim());
        sheet.getRange(rowIndex, 3).setValue(String(obj.projek_id || "").trim());
        sheet.getRange(rowIndex, 4).setValue(String(obj.tugas || "").trim());
        sheet.getRange(rowIndex, 5).setValue(String(obj.bobot || "ringan").trim());
        sheet.getRange(rowIndex, 6).setValue(String(obj.status || "pending").trim());
        sheet.getRange(rowIndex, 7).setValue(String(obj.nilai || "").trim());
        return { success: true, message: "Data Tugas berhasil diperbarui!" };
      }
    }
    return { success: false, message: "Tugas tidak ditemukan." };
  } catch (error) {
    return { success: false, message: "Gagal memperbarui tugas: " + error.message };
  }
}

/**
 * Hapus data tugas
 */
function deleteTugas(id) {
  try {
    var sheet = ensureSheet("Tugas", ['ID', 'SiswaID', 'ProjekID', 'Tugas', 'Bobot', 'Status', 'Nilai']);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || "").toString() === String(id || "").toString()) {
        sheet.deleteRow(i + 1);
        return { success: true, message: "Data Tugas berhasil dihapus!" };
      }
    }
    return { success: false, message: "Tugas tidak ditemukan." };
  } catch (error) {
    return { success: false, message: "Gagal menghapus tugas: " + error.message };
  }
}

// ==========================================
// QUERY UNTUK DASHBOARD & LAPORAN
// ==========================================

/**
 * Helper: join data tugas dengan nama siswa & nama projek
 * return: [{ id, siswa_nama, projek_nama, tugas, bobot, status, nilai }, ...]
 */
function getTugasJoined() {
  var sheetTugas = getSheet("Tugas");
  if (!sheetTugas) return [];
  var tugasData = sheetTugas.getDataRange().getValues();
  if (tugasData.length > 0) tugasData.shift();

  // Ambil data siswa & projek untuk lookup
  var sheetSiswa = getSheet("Siswa");
  var siswaMap = {};
  if (sheetSiswa) {
    var sData = sheetSiswa.getDataRange().getValues();
    for (var i = 1; i < sData.length; i++) {
      siswaMap[sData[i][0]] = sData[i][1]; // ID → Nama
    }
  }

  var sheetProjek = getSheet("Projek");
  var projekMap = {};
  if (sheetProjek) {
    var pData = sheetProjek.getDataRange().getValues();
    for (var j = 1; j < pData.length; j++) {
      projekMap[pData[j][0]] = pData[j][1]; // ID → Nama
    }
  }

  var result = [];
  for (var k = 0; k < tugasData.length; k++) {
    var r = tugasData[k];
    result.push({
      id: r[0],
      siswa_id: r[1],
      siswa_nama: siswaMap[r[1]] || '(dihapus)',
      projek_id: r[2],
      projek_nama: projekMap[r[2]] || '(dihapus)',
      tugas: r[3],
      bobot: r[4],
      status: r[5],
      nilai: r[6]
    });
  }
  return result;
}

/**
 * Ambil data progress status untuk doughnut chart
 */
function getProgressStatus() {
  var joined = getTugasJoined();
  var counts = { pending: 0, onprogress: 0, suspend: 0, done: 0 };
  joined.forEach(function(t) {
    var s = t.status || 'pending';
    if (counts[s] !== undefined) counts[s]++;
    else counts[s] = 1;
  });
  return counts;
}

/**
 * Ambil top 5 siswa dengan rata-rata nilai tertinggi (hitung bobot)
 */
function getTop5Siswa() {
  var joined = getTugasJoined();
  var bobotFaktor = { ringan: 1, sedang: 2, berat: 3 };

  // Kumpulkan per siswa: total(tugas selesai)
  var siswaStats = {};
  joined.forEach(function(t) {
    // Hanya tugas dengan status done yang dihitung nilainya
    if (t.status !== 'done' || !t.nilai || isNaN(Number(t.nilai))) return;

    var siswaId = t.siswa_id;
    if (!siswaStats[siswaId]) {
      siswaStats[siswaId] = {
        nama: t.siswa_nama,
        totalNilaiBobot: 0,
        totalBobot: 0
      };
    }
    var faktor = bobotFaktor[t.bobot] || 1;
    siswaStats[siswaId].totalNilaiBobot += Number(t.nilai) * faktor;
    siswaStats[siswaId].totalBobot += faktor;
  });

  // Hitung rata-rata tertimbang & urutkan
  var arr = [];
  for (var id in siswaStats) {
    var s = siswaStats[id];
    arr.push({
      label: s.nama,
      value: s.totalBobot > 0 ? Math.round((s.totalNilaiBobot / s.totalBobot) * 100) / 100 : 0
    });
  }

  arr.sort(function(a, b) { return b.value - a.value; });
  return arr.slice(0, 5);
}

/**
 * Ambil data tugas terbaru (untuk tabel recent dashboard)
 * return: [{ siswa_nama, projek_nama, tugas, status, nilai }, ...]
 */
function getTugasTerbaru(jumlah) {
  var joined = getTugasJoined();
  var limit = jumlah || 5;
  var result = [];
  var start = Math.max(0, joined.length - limit);
  for (var i = start; i < joined.length; i++) {
    var t = joined[i];
    result.push({
      kolom1: t.siswa_nama,
      kolom2: t.projek_nama,
      kolom3: t.tugas,
      kolom4: t.status,
      kolom5: t.status === 'done' ? t.nilai : '-'
    });
  }
  return result;
}

