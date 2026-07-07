// Chart Configuration
const chartConfig = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: {
        color: '#ffffff',
        font: { size: 12 },
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#a0aec0' },
      grid: { color: 'rgba(0, 212, 255, 0.1)' },
    },
    y: {
      ticks: { color: '#a0aec0' },
      grid: { color: 'rgba(0, 212, 255, 0.1)' },
    },
  },
};

// Initialize Charts
document.addEventListener('DOMContentLoaded', () => {
  initializeCharts();
});

function initializeCharts() {
  // Performance Chart
  const performanceCtx = document.getElementById('performanceChart');
  if (performanceCtx) {
    new Chart(performanceCtx, {
      type: 'line',
      data: {
        labels: ['1 שעה', '2 שעות', '3 שעות', '4 שעות', '5 שעות'],
        datasets: [
          {
            label: 'ביצועי AI',
            data: [65, 72, 78, 85, 90],
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: chartConfig,
    });
  }

  // Threats Chart
  const threatsCtx = document.getElementById('threatsChart');
  if (threatsCtx) {
    new Chart(threatsCtx, {
      type: 'doughnut',
      data: {
        labels: ['בטוח', 'נמוך', 'בינוני', 'גבוה', 'קריטי'],
        datasets: [
          {
            data: [40, 20, 15, 15, 10],
            backgroundColor: [
              '#10b981',
              '#fbbf24',
              '#f97316',
              '#ef4444',
              '#7c2d12',
            ],
          },
        ],
      },
      options: chartConfig,
    });
  }

  // Battles Chart
  const battlesCtx = document.getElementById('battlesChart');
  if (battlesCtx) {
    new Chart(battlesCtx, {
      type: 'bar',
      data: {
        labels: ['שבוע 1', 'שבוע 2', 'שבוע 3', 'שבוע 4'],
        datasets: [
          {
            label: 'ניצחונות',
            data: [5, 7, 6, 8],
            backgroundColor: '#10b981',
          },
          {
            label: 'הפסדים',
            data: [2, 1, 2, 1],
            backgroundColor: '#ef4444',
          },
        ],
      },
      options: chartConfig,
    });
  }

  // Achievements Chart
  const achievementsCtx = document.getElementById('achievementsChart');
  if (achievementsCtx) {
    new Chart(achievementsCtx, {
      type: 'radar',
      data: {
        labels: ['מהירות', 'דיוק', 'התגנבות', 'כוח', 'חוסן'],
        datasets: [
          {
            label: 'הישגים',
            data: [85, 75, 90, 70, 80],
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0, 212, 255, 0.2)',
          },
        ],
      },
      options: chartConfig,
    });
  }
}
