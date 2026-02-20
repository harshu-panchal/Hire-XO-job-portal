import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { connectDB } from '../config/database';
import User from '../models/user.model';

const SEEDED_EMAILS = [
    'employee@example.com',
    'employer@example.com',
    'investor.give@example.com',
    'investor.get@example.com',
    'tender.give@example.com',
    'tender.get@example.com',
    'equipment.give@example.com',
    'equipment.get@example.com',
    'machinery.give@example.com',
    'machinery.get@example.com',
    'pmc.give@example.com',
    'pmc.get@example.com',
    'csm.give@example.com',
    'csm.get@example.com',
    'logistics.give@example.com',
    'logistics.get@example.com',
    'vehicle.give@example.com',
    'vehicle.get@example.com'
];

const listUsers = async () => {
    try {
        await connectDB();
        console.log('Connected to Database');

        const users = await User.find({ email: { $in: SEEDED_EMAILS } });

        console.log(`Found ${users.length} seeded users:`);
        users.forEach(user => {
            console.log(`- ${user.email} (${user.role})`);
        });

        if (users.length === SEEDED_EMAILS.length) {
            console.log('SUCCESS: All seeded users found.');
        } else {
            console.log(`WARNING: Only found ${users.length} out of ${SEEDED_EMAILS.length} seeded users.`);
            const foundEmails = users.map(u => u.email);
            const missing = SEEDED_EMAILS.filter(e => !foundEmails.includes(e));
            console.log('Missing:', missing);
        }

        process.exit(0);
    } catch (error) {
        console.error('List users failed:', error);
        process.exit(1);
    }
};

listUsers();
