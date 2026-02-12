
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const migrateRoles = async () => {
    try {
        const uri = process.env.MONGO_URI; // Fixed variable name
        if (!uri) {
            throw new Error('MONGO_URI not found in .env');
        }

        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // Define simple schema to avoid TS and validation issues
        const UserSchema = new mongoose.Schema({
            role: String
        }, { strict: false });

        const User = mongoose.model('User', UserSchema);

        // Migrate job-seeker -> employee
        const result1 = await User.updateMany(
            { role: 'job-seeker' },
            { $set: { role: 'employee' } }
        );
        console.log(`Migrated ${result1.modifiedCount} job-seekers to employees`);

        // Migrate recruiter -> employer
        const result2 = await User.updateMany(
            { role: 'recruiter' },
            { $set: { role: 'employer' } }
        );
        console.log(`Migrated ${result2.modifiedCount} recruiters to employers`);

        console.log('Migration complete');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateRoles();
