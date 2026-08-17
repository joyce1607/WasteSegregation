/**
 * EcoSort - Leaderboard Logic
 */

const DEMO_LEADERBOARD = [
    { name: 'Rahul Sharma', dept: 'Central', points: 12850 },
    { name: 'Priya Patel', dept: 'North', points: 11420 },
    { name: 'Arjun Singh', dept: 'South', points: 10980 },
    { name: 'Sneha Reddy', dept: 'East', points: 9870 },
    { name: 'Kiran Desai', dept: 'West', points: 9200 },
    { name: 'Anjali Gupta', dept: 'Central', points: 8900 }
];

const DEPT_LEADERBOARD = [
    { name: 'Central District', points: 82450 },
    { name: 'North District', points: 76210 },
    { name: 'South District', points: 68920 },
    { name: 'East District', points: 54120 },
    { name: 'West District', points: 42300 }
];

document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    if (!user) return;

    renderLeaderboard(user);
    renderDepartments();
});

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('tabIndividual').style.display = tabId === 'individual' ? 'block' : 'none';
    document.getElementById('tabDepartment').style.display = tabId === 'department' ? 'block' : 'none';
}

function renderLeaderboard(currentUser) {
    const tbody = document.getElementById('lbBody');
    tbody.innerHTML = '';
    
    // Combine demo data with current user
    let allUsers = [...DEMO_LEADERBOARD];
    
    // Check if user is already in demo data (unlikely, but just in case)
    const userIndex = allUsers.findIndex(u => u.name === currentUser.fullName);
    if(userIndex === -1) {
        allUsers.push({
            name: currentUser.fullName,
            dept: currentUser.area || 'Unknown',
            points: currentUser.ecoPoints,
            isCurrentUser: true
        });
    }

    // Sort by points descending
    allUsers.sort((a, b) => b.points - a.points);

    allUsers.forEach((user, index) => {
        const rank = index + 1;
        let rankHTML = rank;
        
        if (rank === 1) rankHTML = '<i class="fa-solid fa-medal rank-1"></i>';
        else if (rank === 2) rankHTML = '<i class="fa-solid fa-medal rank-2"></i>';
        else if (rank === 3) rankHTML = '<i class="fa-solid fa-medal rank-3"></i>';
        
        const isCurrent = user.isCurrentUser;
        
        if (isCurrent) {
            document.getElementById('myRankHighlight').textContent = `#${rank}`;
            // Update user object rank in local storage for consistency
            const storedUser = JSON.parse(localStorage.getItem('ecosort_current_user'));
            storedUser.currentRank = rank;
            localStorage.setItem('ecosort_current_user', JSON.stringify(storedUser));
        }

        const tr = document.createElement('tr');
        if (isCurrent) tr.className = 'highlight-row';
        
        tr.innerHTML = `
            <td class="rank-col">${rankHTML}</td>
            <td>
                <div class="user-cell">
                    <div class="user-avatar-small">${user.name.charAt(0)}</div>
                    <div style="font-weight: 500;">${user.name} ${isCurrent ? '(You)' : ''}</div>
                </div>
            </td>
            <td class="text-muted">${user.dept}</td>
            <td class="pts-col">${user.points.toLocaleString()}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

function renderDepartments() {
    const container = document.getElementById('deptList');
    container.innerHTML = '';
    
    DEPT_LEADERBOARD.forEach((dept, index) => {
        const rank = index + 1;
        container.innerHTML += `
            <div class="dept-card">
                <div class="flex items-center">
                    <div class="dept-rank">#${rank}</div>
                    <div class="dept-info">
                        <h3>${dept.name}</h3>
                        <div class="text-muted" style="font-size: 0.9rem;">Neighborhood Area</div>
                    </div>
                </div>
                <div class="dept-score">${dept.points.toLocaleString()} pts</div>
            </div>
        `;
    });
}
