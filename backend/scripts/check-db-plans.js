const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkPlans() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hirexo');
        console.log('Connected to MongoDB');

        const plans = await mongoose.connection.db.collection('subscriptionplans').find({}).toArray();
        console.log('Total plans found:', plans.length);

        const resourcePlans = plans.filter(p => p.type === 'resource');
        console.log('Resource plans found:', resourcePlans.length);

        if (resourcePlans.length > 0) {
            console.log('First resource plan sample:', JSON.stringify(resourcePlans[0], null, 2));
        } else {
            console.log('No resource plans found in database!');
            console.log('All types in DB:', [...new Set(plans.map(p => p.type))]);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error checking plans:', error);
    }
}

checkPlans();
