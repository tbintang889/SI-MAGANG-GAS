// ==========================================
// DASHBOARD SERVER — Fungsi Modular
// ==========================================
// Setiap fungsi component bisa dipanggil sendiri-sendiri
// atau digabung via getDashboardSummary()
// ==========================================

// ==========================================
// COMPONENT: KPI Cards
// ==========================================
function getKpiData() {
  var sheetSiswa = getSheet("Siswa");
  var sheetJurusan = getSheet("Jurusan");
  var sheetPembimbing = getSheet("Pembimbing");
  var sheetSekolah = getSheet("Sekolah");

  return {
    totalSiswa: sheetSiswa ? sheetSiswa.getLastRow() - 1 : 0,
    totalJurusan: sheetJurusan ? sheetJurusan.getLastRow() - 1 : 0,
    totalPembimbing: sheetPembimbing ? sheetPembimbing.getLastRow() - 1 : 0,
    totalSekolah: sheetSekolah ? sheetSekolah.getLastRow() - 1 : 0
  };
}

// ==========================================
// COMPONENT: Doughnut Chart — Kelompok data per kolom
// ==========================================
function getDoughnutData(sheetName, kolomIndex) {
  // Contoh: getDoughnutData("Siswa", 3) → grup per Jurusan
  var sheet = getSheet(sheetName);
  if (!sheet) return {};

  var data = sheet.getDataRange().getValues();
  var result = {};
  for (var i = 1; i < data.length; i++) {
    var key = String(data[i][kolomIndex] || '').trim();
    if (key) {
      result[key] = (result[key] || 0) + 1;
    }
  }
  return result;
}

// ==========================================
// COMPONENT: Bar Chart — Kelompok data per kolom
// ==========================================
function getBarData(sheetName, kolomIndex) {
  // Contoh: getBarData("Siswa", 4) → [{label:"SMKN 1", value:8}, ...]
  var raw = getDoughnutData(sheetName, kolomIndex);
  var result = [];
  for (var key in raw) {
    result.push({ label: key, value: raw[key] });
  }
  return result;
}

// ==========================================
// COMPONENT: Recent Data — Ambil N baris terakhir
// ==========================================
function getRecentData(sheetName, kolomMapping, jumlah) {
  // Contoh:
  // getRecentData("Siswa", { kolom1:1, kolom2:2, kolom3:3 }, 5)
  // → [{kolom1:"Nama", kolom2:"Kelas", kolom3:"Jurusan"}, ...]
  var sheet = getSheet(sheetName);
  if (!sheet) return [];

  var allData = sheet.getDataRange().getValues();
  var limit = jumlah || 5;
  var start = Math.max(1, allData.length - limit);
  var result = [];

  for (var i = start; i < allData.length; i++) {
    var row = {};
    for (var key in kolomMapping) {
      row[key] = String(allData[i][kolomMapping[key]] || '');
    }
    result.push(row);
  }
  return result;
}

// ==========================================
// COMPONENT: Ringkasan (gabungan semua)
// ==========================================
function getDashboardSummary() {
  var kpi = getKpiData();
  var sheetProjek = getSheet("Projek");
  var sheetTugas = getSheet("Tugas");
  var totalProjek = sheetProjek ? sheetProjek.getLastRow() - 1 : 0;
  var totalTugas = sheetTugas ? sheetTugas.getLastRow() - 1 : 0;

  // Rata-rata nilai dari tugas yang done
  var rataNilai = 0;
  if (sheetTugas && totalTugas > 0) {
    var dataTugas = sheetTugas.getDataRange().getValues();
    var sumNilai = 0;
    var countNilai = 0;
    for (var i = 1; i < dataTugas.length; i++) {
      var status = String(dataTugas[i][5] || '').trim();
      var nilai = Number(dataTugas[i][6] || 0);
      if (status === 'done' && nilai > 0) {
        sumNilai += nilai;
        countNilai++;
      }
    }
    rataNilai = countNilai > 0 ? Math.round((sumNilai / countNilai) * 100) / 100 : 0;
  }

  return {
    kpi: {
      total1: kpi.totalSiswa,
      total2: totalProjek,
      total3: totalTugas,
      avg: rataNilai
    },
    chart1Data: getProgressStatus(),      // Progress status doughnut
    chart2Data: getTop5Siswa(),           // Top 5 siswa bar
    recentData: getTugasTerbaru(5)        // 5 tugas terbaru (with join)
  };
}

