const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const linkHtml = `            <a href="notifications.html" class="nav-item">
                <i class="fas fa-bell"></i>
                <span>Notifications</span>
            </a>
`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Only add if not already there
    if (!content.includes('notifications.html')) {
        // Find the index of the Settings link in the sidebar-nav
        const searchStr = '<a href="settings.html" class="nav-item">';
        const index = content.indexOf(searchStr);
        
        if (index !== -1) {
            content = content.substring(0, index) + linkHtml + content.substring(index);
            fs.writeFileSync(file, content);
            console.log('Added to ' + file);
        } else {
            console.log('Settings link not found in ' + file);
        }
    }
});
