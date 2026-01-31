// Test to see what JWT_SECRET the server is actually using
require('dotenv').config();

console.log('Environment variables:');
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('MONGO_URI:', process.env.MONGO_URI?.substring(0, 30) + '...');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
