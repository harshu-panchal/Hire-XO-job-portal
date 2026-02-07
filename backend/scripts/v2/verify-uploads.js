const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000/api';
let token = '';

async function verifyUploads() {
    console.log('🚀 Starting File Upload Verification...');

    try {
        // 1. Create User
        const uniqueId = Date.now();
        const email = `test.upload.${uniqueId}@example.com`;
        const password = 'Password@123';

        console.log(`\n1️⃣ Creating User...`);
        const formSignup = new FormData();
        formSignup.append('name', 'Upload User');
        formSignup.append('email', email);
        formSignup.append('password', password);
        formSignup.append('role', 'employee');

        await axios.post(`${BASE_URL}/auth/signup`, formSignup, { headers: { ...formSignup.getHeaders() } });

        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        token = loginResponse.data.token;
        console.log('   ✅ User Logged In');

        // 2. Upload Profile Photo
        console.log(`\n2️⃣ Uploading Profile Photo...`);
        // Create dummy file
        const dummyPath = path.join(__dirname, 'test-image.png');
        if (!fs.existsSync(dummyPath)) {
            fs.writeFileSync(dummyPath, 'fake-image-content');
        }

        const formUpload = new FormData();
        formUpload.append('profilePhoto', fs.createReadStream(dummyPath));

        const uploadResponse = await axios.patch(`${BASE_URL}/users/profile-photo`, formUpload, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...formUpload.getHeaders()
            }
        });

        if (uploadResponse.status === 200 && uploadResponse.data.url) {
            console.log('   ✅ Profile Photo Uploaded Successfully');
            console.log('   URL:', uploadResponse.data.url);
        } else {
            console.log('   ❌ Upload Response Missing URL');
        }

        // Cleanup
        if (fs.existsSync(dummyPath)) fs.unlinkSync(dummyPath);

    } catch (error) {
        console.error('   ❌ Error:', error.response ? error.response.data : error.message);
    }
}

verifyUploads();
