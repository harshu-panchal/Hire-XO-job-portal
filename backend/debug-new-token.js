// Debug the new token
const jwt = require('jsonwebtoken');
require('dotenv').config();

const newToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2RhMWZiM2RmNmQ1Y2FiNjI2NTM2NyIsInJvbGUiOiJqb2Itc2Vla2VyIiwiZW1haWwiOiJqb2huLmpvYnNlZWtlckB0ZXN0LmNvbSIsImlhdCI6MTczODMxMTU0NywiZXhwIjoxNzM4Mzk3OTQ3fQ.kLGcPCOKfbqJKZYTBpTnVTQHKqKTKJVpNJPLpDkbMPk";

console.log('Decoding new token:');
const decoded = jwt.decode(newToken);
console.log(JSON.stringify(decoded, null, 2));

console.log('\nTrying to verify with JWT_SECRET from .env:');
const secret = process.env.JWT_SECRET || 'secret';
console.log(`Secret: "${secret}"`);

try {
    const verified = jwt.verify(newToken, secret);
    console.log('✅ SUCCESS!');
    console.log('Verified:', verified);
} catch (error) {
    console.log('❌ FAILED:', error.message);
}
