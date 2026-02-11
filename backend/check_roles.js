const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hire-xo';

const userSchema = new mongoose.Schema({
    role: { type: String, required: true }
}, { strict: false });

const User = mongoose.model('User', userSchema);

const checkRoles = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const roles = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        console.log('User Role Distribution:');
        roles.forEach(r => {
            console.log(`${r._id}: ${r.count}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkRoles();
