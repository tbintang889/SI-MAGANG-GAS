// ==========================================
// DASHBOARD SERVER - Sesuaikan dengan data Anda
// ==========================================

/**
 * Ambil data summary untuk dashboard
 */
function getDashboardSummary() {
  // TODO: Sesuaikan query dengan sheet Anda
  return {
    kpi: {
      total1: 0,
      total2: 0,
      total3: 0,
      avg: 0
    },
    chart1Data: {},   // Untuk doughnut chart: { label: count, ... }
    chart2Data: [],   // Untuk bar chart: [{ label: '...', value: 0 }, ...]
    recentData: []    // Data terbaru: [{ kolom1: '...', kolom2: '...', kolom3: '...' }]
  };
}

