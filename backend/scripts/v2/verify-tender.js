const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let employerToken = '';
let tenderId = '';

async function verifyTender() {
    console.log('🚀 Starting Tender Resource Verification...');

    try {
        // 1. Create Employer
        const uniqueId = Date.now();
        const email = `test.tender.${uniqueId}@example.com`;
        const password = 'Password@123';

        console.log(`\n1️⃣ Creating Employer...`);
        const Form = require('form-data');
        const form = new Form();
        form.append('name', 'Tender Creator');
        form.append('email', email);
        form.append('password', password);
        form.append('role', 'employer');
        form.append('company', 'Tender Co');

        await axios.post(`${BASE_URL}/auth/signup`, form, { headers: { ...form.getHeaders() } });

        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        employerToken = loginResponse.data.token;
        console.log('   ✅ Employer Logged In');

        // 2. Post Tender
        console.log(`\n2️⃣ Posting a Tender...`);
        const tenderData = {
            title: 'Construction Tender 2026',
            company: 'Tender Co',
            location: 'Mumbai',
            compensation: '₹50L - ₹1Cr', // salary/compensation field
            type: 'Full-time', // or specific tender type
            description: 'Looking for construction partners',
            tenderType: 'provide-tenders',
            urgency: 'Within Week',
            requirements: ['Grade A License'],
            responsibilities: ['Build Tower'],
            benefits: ['Advance Payment']
        };

        const postResponse = await axios.post(`${BASE_URL}/tenders`, tenderData, {
            headers: { Authorization: `Bearer ${employerToken}` }
        });

        if (postResponse.status === 201) {
            console.log('   ✅ Tender Created Successfully');
            tenderId = postResponse.data.data._id;
            console.log('   Tender ID:', tenderId);
        }

        // 3. List Tenders
        console.log(`\n3️⃣ Listing Tenders...`);
        const listResponse = await axios.get(`${BASE_URL}/tenders`);
        const tenders = listResponse.data.data;
        const found = tenders.find(t => t._id === tenderId);

        if (found) {
            console.log('   ✅ Tender found in listing');
            if (found.category === 'Tenders') console.log('   ✅ Category is correct');
        } else {
            console.log('   ❌ Tender NOT found in listing');
        }

        // 4. Get By ID
        console.log(`\n4️⃣ Get Tender By ID...`);
        const getResponse = await axios.get(`${BASE_URL}/tenders/${tenderId}`);
        if (getResponse.status === 200 && getResponse.data.title === 'Construction Tender 2026') {
            console.log('   ✅ Get By ID Successful');
        }

    } catch (error) {
        console.error('   ❌ Error:', error.response ? error.response.data : error.message);
    }
}

verifyTender();
