const fs = require('fs');
const content = fs.readFileSync('css/style.css', 'utf-8');
const lines = content.split('\n');
// Trim before the corruption started (around line 807 where .footer-bottom a:hover ends)
const goodLines = lines.slice(0, 807);
fs.writeFileSync('css/style.css', goodLines.join('\n'));
