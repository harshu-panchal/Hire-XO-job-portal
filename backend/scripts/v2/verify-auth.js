const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000/api';

async function verifyAuth() {
    console.log('🚀 Starting Authentication Verification...');

    // 1. Employee Signup
    const uniqueId = Date.now();
    const email = `test.employee.${uniqueId}@example.com`;
    const password = 'Password@123';

    console.log(`\n1️⃣ Testing Employee Signup...`);
    console.log(`   Email: ${email}`);

    try {
        const form = new FormData();
        form.append('name', 'Test Employee');
        form.append('email', email);
        form.append('password', password);
        form.append('role', 'employee');

        const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        if (signupResponse.status === 201) {
            console.log('   ✅ Signup Successful!');
        } else {
            console.log('   ❌ Signup Failed with status:', signupResponse.status);
            console.log('   Response:', signupResponse.data);
            return;
        }

        // 2. Login
        console.log(`\n2️⃣ Testing Login...`);
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: email,
            password: password
        });

        if (loginResponse.status === 200) {
            console.log('   ✅ Login Successful!');
            const token = loginResponse.data.token;
            console.log('   Token received (length):', token.length);

            // 3. Protected Route
            console.log(`\n3️⃣ Testing Protected Route (/auth/me)...`);
            const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (meResponse.status === 200) {
                console.log('   ✅ Protected Route Access Successful!');
                console.log('   User ID:', meResponse.data.user._id);
                console.log('   Role:', meResponse.data.user.role);
            } else {
                console.log('   ❌ Protected Route Failed with status:', meResponse.status);
            }

        } else {
            console.log('   ❌ Login Failed with status:', loginResponse.status);
            console.log('   Response:', loginResponse.data);
        }

    } catch (error) {
        handleError(error);
    }

    // --- Employer Signup ---
    await testRoleSignup('employer', 'Test Employer');

    // --- Resource Signup ---
    await testRoleSignup('resource', 'Test Resource');
}

async function testRoleSignup(role, name) {
    const uniqueId = Date.now();
    const email = `test.${role}.${uniqueId}@example.com`;
    const password = 'Password@123';

    console.log(`\nTesting ${role.toUpperCase()} Signup...`);
    console.log(`   Email: ${email}`);

    try {
        const form = new FormData();
        form.append('name', name);
        form.append('email', email);
        form.append('password', password);
        form.append('role', role);

        if (role === 'employer') {
            form.append('company', 'Test Company Ltd.');
        } else if (role === 'resource') {
            form.append('organizationName', 'Test Resource Org');
            form.append('category', 'investor'); // Using 'investor' as a valid category
        }

        const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, form, {
            headers: { ...form.getHeaders() }
        });

        if (signupResponse.status === 201) {
            console.log(`   ✅ ${role} Signup Successful!`);
        } else {
            console.log(`   ❌ ${role} Signup Failed with status:`, signupResponse.status);
            console.log('   Response:', signupResponse.data);
            return;
        }

        // Login
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: email,
            password: password
        });

        if (loginResponse.status === 200) {
            console.log(`   ✅ ${role} Login Successful!`);
            const token = loginResponse.data.token;

            // Me check
            const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (meResponse.status === 200 && meResponse.data.user.role === role) {
                console.log(`   ✅ ${role} Role Verified!`);
            } else {
                console.log(`   ❌ ${role} Role Mismatch or Me Failed.`);
            }

        } else {
            console.log(`   ❌ ${role} Login Failed.`);
        }

    } catch (error) {
        handleError(error);
    }
}

function handleError(error) {
    console.error('   ❌ Error during verification:');
    if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', error.response.data);
    } else {
        console.error('   Message:', error.message);
    }
}

verifyAuth();
