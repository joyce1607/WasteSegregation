const fs = require('fs');
const path = require('path');

const files = [
    'dashboard.html', 'scanner.html', 'collection.html', 'rewards.html',
    'leaderboard.html', 'challenges.html', 'certificates.html', 'alerts.html',
    'impact.html', 'partners.html', 'profile.html'
];
const dir = path.join(__dirname);

files.forEach(f => {
    const fullPath = path.join(dir, f);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/<div class="app-container">\\n/g, '<div class="app-container">\n');
    fs.writeFileSync(fullPath, content);
});
console.log("Fixed \\n rendering artifacts");
