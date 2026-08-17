/**
 * EcoSort - Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user) return;

    // Populate Dashboard Data
    const welcomeMsg = document.getElementById('welcomeMsg');
    const currentLevelDisplay = document.getElementById('currentLevelDisplay');
    const valPoints = document.getElementById('valPoints');
    const valSorted = document.getElementById('valSorted');
    const valScore = document.getElementById('valScore');
    const valRank = document.getElementById('valRank');
    const valStreak = document.getElementById('valStreak');

    if (welcomeMsg) welcomeMsg.textContent = `Welcome back, ${user.fullName.split(' ')[0]}!`;
    if (currentLevelDisplay) currentLevelDisplay.textContent = user.level;
    
    // Animate counters (simple animation)
    animateValue(valPoints, 0, user.ecoPoints, 1000);
    animateValue(valSorted, 0, user.wasteSorted, 1000);
    
    if (valScore) valScore.textContent = `${user.ecoScore}%`;
    if (valRank) valRank.textContent = `#${user.currentRank || '-'}`;
    if (valStreak) valStreak.textContent = `${user.ecoStreak} Days`;

    // Dynamic Progress Bar based on points (e.g. 10000 points for max level)
    const levelProgress = document.getElementById('levelProgress');
    if (levelProgress) {
        const maxPointsForLevel = 10000; 
        const percentage = Math.min((user.ecoPoints / maxPointsForLevel) * 100, 100);
        
        // Delay slightly for animation effect
        setTimeout(() => {
            levelProgress.style.width = `${percentage}%`;
        }, 300);
    }
    
    // Render Chart if element exists
    const ctx = document.getElementById('weeklyActivityChart');
    if (ctx) {
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; 
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Recyclable',
                        data: [12, 19, 5, 8, 4, 15, 9],
                        backgroundColor: '#4facfe',
                        borderRadius: 4
                    },
                    {
                        label: 'Organic',
                        data: [4, 7, 2, 9, 12, 3, 6],
                        backgroundColor: '#58d68d',
                        borderRadius: 4
                    },
                    {
                        label: 'Hazardous',
                        data: [0, 0, 1, 0, 0, 2, 0],
                        backgroundColor: '#ff6b6b',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    x: { stacked: true, grid: { display: false } },
                    y: { stacked: true, border: { display: false } }
                }
            }
        });
    }

    // Dashboard Reminder Feature Initialization
    initReminders();
});

// Reminder Feature Logic
function initReminders() {
    const toggle = document.getElementById('reminderToggle');
    const toggleKnob = document.querySelector('.knob');
    const toggleSlider = document.querySelector('.slider');
    const statusText = document.getElementById('reminderStatusText');
    const remContent = document.querySelector('.reminder-content');
    
    if(!toggle) return;

    toggle.addEventListener('change', (e) => {
        if(e.target.checked) {
            toggleKnob.style.transform = 'translateX(20px)';
            toggleSlider.style.backgroundColor = 'var(--primary-color)';
            statusText.textContent = '🔔 Enabled';
            remContent.style.opacity = '1';
        } else {
            toggleKnob.style.transform = 'translateX(0)';
            toggleSlider.style.backgroundColor = '#ccc';
            statusText.textContent = '🔕 Disabled';
            remContent.style.opacity = '0.5';
        }
    });
}


// Helper for animating numbers
function animateValue(obj, start, end, duration) {
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
