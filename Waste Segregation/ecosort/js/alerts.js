/**
 * EcoSort - Smart Alerts Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user) return;
    
    renderAlerts();
});

function renderAlerts() {
    const container = document.getElementById('alertsContainer');
    container.innerHTML = '';
    
    // Simulated personalized alerts based on typical waste patterns
    const alerts = [
        {
            id: 1,
            type: 'priority-high',
            icon: 'fa-battery-full',
            title: 'Hazardous Waste Alert',
            message: 'Battery detected in your recent scans. Do not place batteries in regular or organic waste.',
            recommendation: 'Use an appropriate battery/e-waste collection facility to prevent soil and water contamination.',
            time: '2 hours ago'
        },
        {
            id: 2,
            type: 'priority-medium',
            icon: 'fa-bottle-water',
            title: 'Plastic Waste Alert',
            message: 'You generated 15 plastic bottles this week, which is 20% higher than last week.',
            recommendation: 'Try using a reusable water bottle to reduce single-use plastic consumption.',
            time: 'Yesterday'
        },
        {
            id: 3,
            type: 'priority-info',
            icon: 'fa-file-lines',
            title: 'Paper Waste Analysis',
            message: 'You generated 45 paper items this month.',
            recommendation: 'Consider using digital documents instead of printing when possible to save trees.',
            time: '2 days ago'
        },
        {
            id: 4,
            type: 'priority-info',
            icon: 'fa-apple-whole',
            title: 'Great Composting Habit',
            message: 'You have consistently sorted organic waste for the past 2 weeks.',
            recommendation: 'Your organic waste is being processed into biofertilizer. Keep up the great work!',
            time: 'Last Week'
        }
    ];

    alerts.forEach(alert => {
        container.innerHTML += `
            <div class="alert-card ${alert.type}">
                <div class="alert-icon"><i class="fa-solid ${alert.icon}"></i></div>
                <div class="alert-content" style="flex: 1;">
                    <span class="time-badge">${alert.time}</span>
                    <h3>${alert.title}</h3>
                    <p>${alert.message}</p>
                    <div class="recommendation">
                        <i class="fa-solid fa-lightbulb" style="color: var(--primary-color); margin-right: 0.5rem;"></i>
                        ${alert.recommendation}
                    </div>
                </div>
            </div>
        `;
    });
}
