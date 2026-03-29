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
        
        // Ensure both config.js and script.js exist exactly as needed before </body>
        // Remove existing ones to clean up
        content = content.replace(/<script src="js\/config\.js"><\/script>\r?\n?/g, '');
        content = content.replace(new RegExp('<script src="js\/' + script + '"><\/script>\\r?\\n?', 'g'), '');
        
        // Add them fresh right before </body>
        content = content.replace('</body>', '    <script src="js/config.js"></script>\n    <script src="js/' + script + '"></script>\n</body>');
        fs.writeFileSync(file, content);
        console.log('Fixed ' + file);
    }
}
