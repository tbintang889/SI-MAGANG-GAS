// ==========================================
// LAPORAN TUGAS SERVER
// ==========================================

/**
 * Ambil data laporan tugas dengan filter dinamis
 * filter: { projek_id, siswa_id, status }
 */
function getLaporanTugas(filter) {
  var joined = getTugasJoined();
  if (!joined || joined.length === 0) {
    return { data: [], ringkasan: { total: 0, totalBobot: 0, rataNilai: 0, totalNilaiBobot: 0 } };
  }

  // Terapkan filter
  if (filter) {
    if (filter.projek_id) {
      joined = joined.filter(function(t) { return t.projek_id === filter.projek_id; });
    }
    if (filter.siswa_id) {
      joined = joined.filter(function(t) { return t.siswa_id === filter.siswa_id; });
    }
    if (filter.status) {
      joined = joined.filter(function(t) { return t.status === filter.status; });
    }
  }

  var bobotFaktor = { ringan: 1, sedang: 2, berat: 3 };

  // Hitung ringkasan
  var totalTugas = joined.length;
  var totalBobot = 0;
  var totalNilaiBobot = 0;
  var totalNilai = 0;
  var countNilai = 0;

  var dataRows = joined.map(function(t) {
    var faktor = bobotFaktor[t.bobot] || 1;
    var nilai = t.status === 'done' && t.nilai ? Number(t.nilai) : 0;
    var nilaiBobot = nilai * faktor;

    totalBobot += faktor;
    if (nilai > 0) {
      totalNilaiBobot += nilaiBobot;
      totalNilai += nilai;
      countNilai++;
    }

    return {
      siswa: t.siswa_nama,
      projek: t.projek_nama,
      tugas: t.tugas,
      bobot: t.bobot,
      status: t.status,
      nilai: nilai > 0 ? nilai : '-',
      nilaiBobot: nilai > 0 ? nilaiBobot : '-'
    };
  });

  var rataNilai = countNilai > 0 ? Math.round((totalNilai / countNilai) * 100) / 100 : 0;

  // Siapkan opsi filter
  var allJoined = getTugasJoined();
  var projekSet = {};
  var siswaSet = {};
  allJoined.forEach(function(t) {
    projekSet[t.projek_id] = t.projek_nama;
    siswaSet[t.siswa_id] = t.siswa_nama;
  });

  var filterOptions = {
    projek: Object.keys(projekSet).map(function(id) { return { id: id, nama: projekSet[id] }; }),
    siswa: Object.keys(siswaSet).map(function(id) { return { id: id, nama: siswaSet[id] }; })
  };

  return {
    data: dataRows,
    ringkasan: {
      total: totalTugas,
      totalBobot: totalBobot,
      rataNilai: rataNilai,
      totalNilaiBobot: totalNilaiBobot
    },
    filterOptions: filterOptions
  };
}

