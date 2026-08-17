const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace `<button class="icon-btn"><i class="fa-regular fa-bell"></i></button>`
    content = content.replace(/<button class="icon-btn"><i class="fa-regular fa-bell"><\/i><\/button>/g, '<a href="alerts.html" class="icon-btn"><i class="fa-regular fa-bell"></i></a>');
    
    // In dashboard.html:
    if (file === 'dashboard.html') {
        content = content.replace('<div class="bell-icon">', '<a href="alerts.html" class="bell-icon" style="color: inherit; text-decoration: none; display: flex; align-items: center; justify-content: center;">');
        content = content.replace('<span class="bell-badge">3</span>\n                </div>', '<span class="bell-badge">3</span>\n                </a>');
        content = content.replace('href="#" class="orbit-node node-5" id="reminderMenuBtn"', 'href="alerts.html" class="orbit-node node-5" id="reminderMenuBtn"');
    }

    fs.writeFileSync(file, content, 'utf8');
}
console.log('Done!');
