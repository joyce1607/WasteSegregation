/**
 * EcoSort - Impact Analytics using Chart.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user) return;

    // Simulate Impact Metrics
    // 1 item ~= 0.1 kg on average for demo
    const estimatedKg = (user.wasteSorted * 0.1).toFixed(1);
    // 1 kg diverted ~= 2.5 kg CO2 saved (demo formula)
    const co2Saved = (estimatedKg * 2.5).toFixed(1);

    document.getElementById('valDiverted').textContent = `${estimatedKg} kg`;
    document.getElementById('valCO2').textContent = `${co2Saved} kg`;

    initCharts(user);
});

function initCharts(user) {
    // 1. Category Chart (Doughnut)
    const ctxCategory = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctxCategory, {
        type: 'doughnut',
        data: {
            labels: ['Recyclable', 'Organic', 'Hazardous', 'General'],
            datasets: [{
                data: [45, 30, 5, 20], // Demo distribution
                backgroundColor: [
                    '#2196f3', // Blue - Recyclable
                    '#4caf50', // Green - Organic
                    '#f44336', // Red - Hazardous
                    '#9e9e9e'  // Grey - General
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' }
            },
            cutout: '70%'
        }
    });

    // 2. Trend Chart (Line)
    const ctxTrend = document.getElementById('trendChart').getContext('2d');
    new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Items Sorted',
                data: [12, 19, 15, 25, 22, 30, 28],
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // 3. AI Accuracy (Bar)
    const ctxAi = document.getElementById('aiChart').getContext('2d');
    new Chart(ctxAi, {
        type: 'bar',
        data: {
            labels: ['High Confidence (Auto)', 'User Confirmed', 'Reclassified'],
            datasets: [{
                label: 'Number of Scans',
                data: [user.wasteSorted * 0.8, user.wasteSorted * 0.15, user.wasteSorted * 0.05],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}
