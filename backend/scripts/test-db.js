const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log('Testing connection to:', uri ? 'URI Found' : 'URI Missing');

if (!uri) {
    console.error('No MONGO_URI in .env');
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    });
