const fs = require('fs');

const map = {
    'index.html': 'dashboard.js',
    'users.html': 'users.js',
    'hosts.html': 'hosts.js',
    'fests.html': 'fests.js',
    'colleges.html': 'colleges.js',
    'bookings.html': 'bookings.js',
    'payments.html': 'payments.js',
    'analytics.html': 'analytics.js',
    'settings.html': 'settings.js'
};

for (const [file, script] of Object.entries(map)) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        if (!content.includes('src="js/' + script + '"') && !content.includes("src='js/" + script + "'")) {
            content = content.replace(
                '<script src="js/config.js"></script>', 
                '<script src="js/config.js"></script>\n    <script src="js/' + script + '"></script>'
            );
            fs.writeFileSync(file, content);
            console.log('Restored JS in ' + file);
        }
    }
}
