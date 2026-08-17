/**
 * EcoSort - Rewards and Badges Logic
 */

const BADGES_DATA = [
    { id: 'b1', name: 'First Recycling', icon: 'fa-seedling', class: 'badge-beginner', desc: 'Sort your first item correctly.', reqType: 'items', reqValue: 1 },
    { id: 'b2', name: '50 Items Sorted', icon: 'fa-recycle', class: 'badge-hero', desc: 'Successfully sort 50 items.', reqType: 'items', reqValue: 50 },
    { id: 'b3', name: '100 Items Sorted', icon: 'fa-dumpster', class: 'badge-hero', desc: 'Successfully sort 100 items.', reqType: 'items', reqValue: 100 },
    { id: 'b4', name: 'Energy Saver', icon: 'fa-bolt', class: 'badge-energy', desc: 'Send 10 items to Waste-to-Energy.', reqType: 'points', reqValue: 2000 },
    { id: 'b5', name: 'Hazardous Hero', icon: 'fa-battery-full', class: 'badge-hero', desc: 'Safely dispose of 5 hazardous items.', reqType: 'points', reqValue: 3000 },
    { id: 'b6', name: '7-Day Streak', icon: 'fa-fire', class: 'badge-streak', desc: 'Sort waste correctly 7 days in a row.', reqType: 'streak', reqValue: 7 },
    { id: 'b7', name: '30-Day Streak', icon: 'fa-fire-flame-curved', class: 'badge-streak', desc: 'Sort waste correctly 30 days in a row.', reqType: 'streak', reqValue: 30 },
    { id: 'b8', name: 'Green Champion', icon: 'fa-globe', class: 'badge-champion', desc: 'Reach Green Champion status (10,000 pts).', reqType: 'points', reqValue: 10000 },
    { id: 'b9', name: 'Yearly Champion', icon: 'fa-trophy', class: 'badge-champion', desc: 'Top 1 on the yearly leaderboard.', reqType: 'points', reqValue: 50000 }
];

document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user) return;

    // Update Progress
    const totalPoints = document.getElementById('totalPoints');
    if (totalPoints) totalPoints.textContent = user.ecoPoints.toLocaleString();

    updateLevelProgress(user);
    renderBadges(user);
});

function updateLevelProgress(user) {
    // Demo logic for levels
    const levels = [
        { name: '🌱 Eco Beginner', max: 5000 },
        { name: '♻️ Recycling Hero', max: 10000 },
        { name: '🌍 Green Champion', max: 25000 },
        { name: '🏆 Sustainability Master', max: 50000 }
    ];

    let currentLvl = levels[0];
    let nextLvl = levels[1];

    for (let i = 0; i < levels.length; i++) {
        if (user.ecoPoints < levels[i].max) {
            currentLvl = levels[i === 0 ? 0 : i - 1];
            nextLvl = levels[i];
            break;
        }
        if (i === levels.length - 1) {
            currentLvl = levels[i];
            nextLvl = levels[i];
        }
    }

    if(user.ecoPoints < 5000) currentLvl = levels[0];

    document.getElementById('currentRankDisplay').textContent = currentLvl.name;
    document.getElementById('nextRankDisplay').textContent = nextLvl.name;

    const basePoints = currentLvl === nextLvl ? 0 : (levels.find(l => l.name === currentLvl.name)?.max || 0);
    // If beginner, base is 0
    const actualBase = user.ecoPoints < 5000 ? 0 : basePoints;

    const progress = Math.min(((user.ecoPoints - actualBase) / (nextLvl.max - actualBase)) * 100, 100);
    
    setTimeout(() => {
        document.getElementById('rankProgressBar').style.width = `${progress}%`;
    }, 200);

    const ptsToNext = nextLvl.max - user.ecoPoints;
    const ptsText = ptsToNext > 0 ? `${ptsToNext.toLocaleString()} points to next rank` : 'Maximum rank achieved!';
    document.getElementById('pointsToNext').textContent = ptsText;
}

function renderBadges(user) {
    const unlockedContainer = document.getElementById('unlockedBadges');
    const lockedContainer = document.getElementById('lockedBadges');

    unlockedContainer.innerHTML = '';
    lockedContainer.innerHTML = '';

    let unlockedCount = 0;

    BADGES_DATA.forEach(badge => {
        const isUnlocked = checkUnlock(badge, user);
        
        const badgeHTML = `
            <div class="badge-card ${!isUnlocked ? 'locked' : ''}">
                <div class="badge-icon">
                    <i class="fa-solid ${badge.icon} ${badge.class}"></i>
                    ${!isUnlocked ? '<div class="lock-icon"><i class="fa-solid fa-lock"></i></div>' : ''}
                </div>
                <div class="badge-title">${badge.name}</div>
                <div class="badge-desc">${badge.desc}</div>
                ${!isUnlocked ? `<div class="progress-indicator">${getLockProgress(badge, user)}</div>` : ''}
            </div>
        `;

        if (isUnlocked) {
            unlockedContainer.innerHTML += badgeHTML;
            unlockedCount++;
        } else {
            lockedContainer.innerHTML += badgeHTML;
        }
    });

    if (unlockedCount === 0) {
        unlockedContainer.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">No badges unlocked yet. Keep sorting to earn rewards!</p>';
    }
}

function checkUnlock(badge, user) {
    if (badge.reqType === 'items') return user.wasteSorted >= badge.reqValue;
    if (badge.reqType === 'points') return user.ecoPoints >= badge.reqValue;
    if (badge.reqType === 'streak') return user.ecoStreak >= badge.reqValue;
    return false;
}

function getLockProgress(badge, user) {
    let current = 0;
    if (badge.reqType === 'items') current = user.wasteSorted;
    if (badge.reqType === 'points') current = user.ecoPoints;
    if (badge.reqType === 'streak') current = user.ecoStreak;
    
    const max = badge.reqValue;
    return `${current} / ${max}`;
}
