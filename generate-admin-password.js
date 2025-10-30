const crypto = require('crypto');

// Set your admin password here
const password = 'orbitaltemple2025';

// Generate SHA-256 hash
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('Password:', password);
console.log('SHA-256 Hash:', hash);
console.log('\nUpdate the ADMIN_PASSWORD_HASH in src/pages/admin.astro with this hash.');
