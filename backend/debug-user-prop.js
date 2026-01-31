// Debug request user object
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testUserPropagation() {
    // First signup
    const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Test User',
            email: 'debug.test@test.com',
            password: 'Test123!',
            role: 'recruiter',
            phoneNumber: '1234567890',
            company: 'TestCo',
            experience: 5
        })
    });

    const signupData = await signupRes.json();
    console.log('Signup response:', JSON.stringify(signupData, null, 2));

    const token = signupData.token;
    console.log('\nToken:', token);

    // Try to create a job
    const jobRes = await fetch(`${BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: 'Test Job',
            description: 'Test description',
            company: 'TestCo',
            location: 'Remote',
            salary: '100000',
            type: 'Full-time',
            requirements: ['Test'],
            responsibilities: ['Test'],
            benefits: ['Test'],
            category: 'Engineering'
        })
    });

    const jobData = await jobRes.json();
    console.log('\nJob creation response:', JSON.stringify(jobData, null, 2));
}

testUserPropagation();
