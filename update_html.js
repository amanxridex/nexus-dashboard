const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('src=\"js/config.js\"')) {
        let newContent = content.replace(/(<script src=\"js\/[a-zA-Z0-9_-]+\.js\"><\/script>)/, '<script src=\"js/config.js\"></script>\n    ');
        fs.writeFileSync(file, newContent);
        console.log('Update: ' + file);
    }
});
