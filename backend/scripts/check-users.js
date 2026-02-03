const mongoose = require('mongoose');
require('dotenv').config();

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hire-xo');
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log('--- USERS ---');
        users.forEach(u => console.log(`Email: ${u.email}, Role: ${u.role}, Name: ${u.name}`));
        console.log('-------------');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listUsers();
