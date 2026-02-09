import request from 'supertest';
import app from './src/app';
import mongoose from 'mongoose';
import { connectDB } from './src/config/database';
import fs from 'fs';
import path from 'path';

async function runTest() {
    try {
        console.log("Connecting to DB...");
        await connectDB();
        console.log("Connected to DB.");

        const dummyLogoPath = path.join(__dirname, 'dummy-logo.png');
        if (!fs.existsSync(dummyLogoPath)) {
            fs.writeFileSync(dummyLogoPath, 'dummy content');
        }

        const username = 'testrecruiter_' + Date.now();
        const email = `testrecruiter_${Date.now()}@example.com`;

        console.log(`Testing signup for ${username} / ${email}...`);

        const response = await request(app)
            .post('/api/auth/signup')
            .field('name', 'Test Recruiter')
            .field('username', username)
            .field('email', email)
            .field('password', 'password123')
            .field('role', 'employer')
            .field('phoneNumber', '1234567890')
            .field('company', 'Test Company Inc.')
            .field('experience', '5')
            .attach('companyLogo', dummyLogoPath);

        if (response.status === 201) {
            console.log('✅ Signup Successful!');
            console.log('User ID:', response.body.user.id);
            console.log('Recruiter Profile:', response.body.user.profile);

            // Verify username and company in profile
            const profile = response.body.user.profile;
            if (profile.getUsername === username || profile.username === username) {
                console.log('✅ Username verified in profile.');
            } else {
                console.log('❌ Username mismatch or missing in profile:', profile.username);
            }
            if (profile.company === 'Test Company Inc.') {
                console.log('✅ Company verified in profile.');
            } else {
                console.log('❌ Company mismatch in profile:', profile.company);
            }

        } else {
            console.error('❌ Signup Failed!');
            console.error('Status:', response.status);
            console.error('Body:', JSON.stringify(response.body, null, 2));
        }

    } catch (error) {
        console.error('Test Error:', error);
    } finally {
        await mongoose.connection.close();
        if (fs.existsSync('dummy-logo.png')) {
            // fs.unlinkSync('dummy-logo.png');
        }
        process.exit(0);
    }
}

runTest();
