// Debug JWT token - decode and check
const jwt = require('jsonwebtoken');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2RhMGY0NDFlNDFhMTk5NzdjNzQwZiIsInJvbGUiOiJqb2Itc2Vla2VyIiwiZW1haWwiOiJqb2huLmpvYnNlZWtlckB0ZXN0LmNvbSIsImlhdCI6MTczODMxMTAwNSwiZXhwIjoxNzM4Mzk3NDA1fQ.Yx_aPKvOEqDgOELxLvHKZNOvVKRvvXPRWWXqgJYJGxs";

// Decode without verification
const decoded = jwt.decode(token);
console.log('Decoded token:', JSON.stringify(decoded, null, 2));

// Try to verify with different secrets
const secrets = [
    'secret',
    'your_super_secret_jwt_key_change_this_in_production',
    'your_super_secret_jwt_key',
    'default_secret'
];

console.log('\nTrying different secrets:');
secrets.forEach(secret => {
    try {
        const verified = jwt.verify(token, secret);
        console.log(`✅ SUCCESS with secret: "${secret}"`);
        console.log('   Verified payload:', verified);
    } catch (error) {
        console.log(`❌ FAILED with secret: "${secret}"`);
    }
});
