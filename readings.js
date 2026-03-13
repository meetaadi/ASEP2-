// ─── Wait for page to fully load ───
window.addEventListener('load', () => {

    // ─── Chart Setup ───
    const ctx = document.getElementById('photodiodeChart').getContext('2d');
    const dataPoints = [610, 640, 700, 680, 724, 710, 724];

    window.photodiodeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', '', ''],
            datasets: [{
                data: dataPoints,
                borderColor: '#2b9eeb',
                borderWidth: 2.5,
                pointRadius: 0,
                tension: 0.4,
                fill: true,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx: c, chartArea } = chart;
                    if (!chartArea) return 'transparent';
                    const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(43, 158, 235, 0.25)');
                    gradient.addColorStop(1, 'rgba(43, 158, 235, 0.0)');
                    return gradient;
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
                x: { display: false },
                y: {
                    display: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { font: { size: 11 }, color: '#a0aec0' },
                    border: { display: false }
                }
            }
        }
    });

    // ─── Status Update Function ───
    // Called with a number value to update the display and badge
    window.updateStatus = function(value) {
        document.getElementById('pdValue').textContent = value;
        document.getElementById('pdValue').style.fontSize = '72px';
document.getElementById('pdValue').style.color = '#0d1117';

        const badge = document.getElementById('statusBadge');
        const statusText = document.getElementById('statusText');
        const statusSub = document.getElementById('statusSub');
        const icon = badge.querySelector('.status-icon');

        if (value < 400) {
            badge.className = 'status-badge warning';
            icon.textContent = '✕';
            statusText.textContent = 'High Microplastic Count!';
            statusSub.textContent = 'Water is not safe for consumption';
        } else if (value < 600) {
            badge.className = 'status-badge warning';
            icon.textContent = '✕';
            statusText.textContent = 'Not Consummable!';
            statusSub.textContent = 'Water quality below safe threshold';
        } else {
            badge.className = 'status-badge optimal';
            icon.textContent = '✓';
            statusText.textContent = 'Optimal & Pure';
            statusSub.textContent = 'Water is safe for consumption';
        }
    };

    // ─── Default static value (remove this line when Arduino is connected) ───
    updateStatus(724);

});