const mongoose = require('mongoose');
require('dotenv').config();

async function checkRoles() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const User = mongoose.model('User', new mongoose.Schema({ role: String }));
        const roles = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        console.log('Role Distribution:');
        roles.forEach(r => console.log(`${r._id}: ${r.count}`));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkRoles();
