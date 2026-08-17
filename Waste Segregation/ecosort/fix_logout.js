const fs = require('fs');
const glob = require('fs').readdirSync('.');

const target = '<a href="#" onclick="logout(); return false;" class="more-item" style="color: var(--danger);"><i class="fa-solid fa-right-from-bracket"></i> <span>Logout</span></a>';
const replacement = '<a href="login.html" onclick="logout();" class="more-item" style="color: var(--danger);"><i class="fa-solid fa-right-from-bracket"></i> <span>Logout</span></a>';

let count = 0;
glob.forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(file, 'utf-8');
        if (content.includes(target)) {
            content = content.split(target).join(replacement);
            fs.writeFileSync(file, content, 'utf-8');
            count++;
        }
    }
});
console.log(`Updated ${count} files`);
