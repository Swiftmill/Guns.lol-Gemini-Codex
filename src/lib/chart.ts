import Chart from 'chart.js/auto';

export function renderViewsChart(canvas: HTMLCanvasElement, views: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => undefined;
  if ((canvas as any)._chartInstance) {
    (canvas as any)._chartInstance.destroy();
  }
  const instance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      datasets: [
        {
          label: 'Vues',
          data: [0, 0, 0, 0, 0, 0, views],
          borderColor: '#7c3aed',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });
  (canvas as any)._chartInstance = instance;
  return () => instance.destroy();
}
