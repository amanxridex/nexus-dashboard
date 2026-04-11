const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const linkHtml = `            <a href="properties.html" class="nav-item">
                <i class="fas fa-building"></i>
                <span>Properties</span>
            </a>
`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Only add if not already there
    if (!content.includes('properties.html')) {
        // Find the index of the Fests link in the sidebar-nav
        const searchStr = '<a href="fests.html" class="nav-item">';
        const index = content.indexOf(searchStr);
        
        if (index !== -1) {
            content = content.substring(0, index) + linkHtml + content.substring(index);
            fs.writeFileSync(file, content);
            console.log('Added to ' + file);
        } else {
            console.log('Fests link not found in ' + file);
        }
    }
});
