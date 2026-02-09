const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testRecruiterSignup() {
    const url = 'http://localhost:5001/api/auth/signup';

    // Create a dummy file for the logo if it doesn't exist
    if (!fs.existsSync('dummy-logo.png')) {
        fs.writeFileSync('dummy-logo.png', 'dummy content');
    }

    const form = new FormData();
    form.append('name', 'Test Recruiter');
    form.append('username', 'testrecruiter_' + Date.now());
    form.append('email', `testrecruiter_${Date.now()}@example.com`);
    form.append('password', 'password123');
    form.append('role', 'employer');
    form.append('phoneNumber', '1234567890');
    form.append('company', 'Test Company Inc.');
    form.append('experience', '5');
    form.append('companyLogo', fs.createReadStream('dummy-logo.png'));

    try {
        console.log('Sending signup request...');
        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders()
            }
        });
        console.log('Signup Successful!');
        console.log('Status:', response.status);
        console.log('User ID:', response.data.user.id);
        console.log('Recruiter Profile:', response.data.user.profile);
    } catch (error) {
        console.error('Signup Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error Message:', error.message);
        }
        console.error('Full Error:', error);
    } finally {
        // cleanup
        if (fs.existsSync('dummy-logo.png')) {
            // fs.unlinkSync('dummy-logo.png'); // Keep for debugging if needed
        }
    }
}

testRecruiterSignup();
