const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000/api';

async function verifyProfile() {
    console.log('🚀 Starting Profile Verification...');

    // --- Employee Profile Test ---
    await testEmployeeProfile();

    // --- Employer Profile Test ---
    await testEmployerProfile();
}

async function testEmployeeProfile() {
    console.log('\n1️⃣ Testing EMPLOYEE Profile Update...');
    const uniqueId = Date.now();
    const email = `test.emp.profile.${uniqueId}@example.com`;
    const password = 'Password@123';

    // 1. Signup
    try {
        const form = new FormData();
        form.append('name', 'Test Employee');
        form.append('email', email);
        form.append('password', password);
        form.append('role', 'employee');

        await axios.post(`${BASE_URL}/auth/signup`, form, { headers: { ...form.getHeaders() } });

        // 2. Login
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        const token = loginResponse.data.token;
        const userId = loginResponse.data.user.id;

        console.log(`   ✅ Logged in as Employee (${userId})`);

        // 3. Update Profile
        const updateData = {
            phoneNumber: '1234567890',
            education: [{ school: 'Test University', degree: 'B.Tech', period: '2018-2022' }],
            experience: [{ company: 'Tech Corp', role: 'Developer', period: '2022-Present' }],
            skills: ['Node.js', 'React'] // Note: AuthService might not handle 'skills' directly if not in loop, checking...
            // AuthService checks: education, age, experience, interestedCompanies, cv.
            // It does NOT explicitly check 'skills' in the 'if/else' block for job-seeker/employee! 
            // This suggests 'skills' might NOT be updated. I will test this.
        };

        const updateResponse = await axios.put(`${BASE_URL}/auth/profile`, updateData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (updateResponse.status === 200) {
            console.log('   ✅ Profile Update Request Successful');
        }

        // 4. Verify Update via GET /me
        const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const user = meResponse.data.user;
        const profile = user.profile || user; // Depending on flattening

        // Check Phone (User model)
        if (user.phoneNumber === '1234567890') console.log('   ✅ User Field (PhoneNumber) Updated');
        else console.log('   ❌ User Field (PhoneNumber) Failed:', user.phoneNumber);

        // Check Education (JobSeeker model)
        if (user.education && user.education.length > 0 && user.education[0].school === 'Test University') {
            console.log('   ✅ Profile Field (Education) Updated');
        } else if (profile.education && profile.education.length > 0 && profile.education[0].school === 'Test University') {
            console.log('   ✅ Profile Field (Education) Updated (Nested)');
        } else {
            console.log('   ❌ Profile Field (Education) Failed');
            console.log('   User Data:', JSON.stringify(user, null, 2));
        }

    } catch (error) {
        handleError(error);
    }
}

async function testEmployerProfile() {
    console.log('\n2️⃣ Testing EMPLOYER Profile Update...');
    const uniqueId = Date.now();
    const email = `test.empr.profile.${uniqueId}@example.com`;
    const password = 'Password@123';

    // 1. Signup
    try {
        const form = new FormData();
        form.append('name', 'Test Employer');
        form.append('email', email);
        form.append('password', password);
        form.append('role', 'employer');
        form.append('company', 'Initial Company');

        await axios.post(`${BASE_URL}/auth/signup`, form, { headers: { ...form.getHeaders() } });

        // 2. Login
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        const token = loginResponse.data.token;

        console.log(`   ✅ Logged in as Employer`);

        // 3. Update Profile
        const updateData = {
            company: 'Updated Company Ltd',
            experience: '10 years in industry'
        };

        await axios.put(`${BASE_URL}/auth/profile`, updateData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // 4. Verify
        const meResponse = await axios.get(`${BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        const user = meResponse.data.user;

        if (user.company === 'Updated Company Ltd') console.log('   ✅ Profile Field (Company) Updated');
        else console.log('   ❌ Profile Field (Company) Failed:', user.company);

    } catch (error) {
        handleError(error);
    }
}

function handleError(error) {
    console.error('   ❌ Error:');
    if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', error.response.data);
    } else {
        console.error('   Message:', error.message);
    }
}

verifyProfile();
