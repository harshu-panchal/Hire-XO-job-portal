const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let employerToken = '';
let employerId = '';
let jobId = '';

async function verifyJobs() {
    console.log('🚀 Starting Job Feature Verification...');

    try {
        // 1. Login as Employer (using the one created in verify-auth or create new)
        // Let's create a new one to be sure
        const uniqueId = Date.now();
        const email = `test.job.employer.${uniqueId}@example.com`;
        const password = 'Password@123';

        console.log(`\n1️⃣ Creating Employer for Job Test...`);
        const Form = require('form-data');
        const form = new Form();
        form.append('name', 'Job Employer');
        form.append('email', email);
        form.append('password', password);
        form.append('role', 'employer');
        form.append('company', 'Job Test Co');

        await axios.post(`${BASE_URL}/auth/signup`, form, { headers: { ...form.getHeaders() } });

        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        employerToken = loginResponse.data.token;
        employerId = loginResponse.data.user.id;
        console.log('   ✅ Employer Logged In');

        // 2. Post a Job
        console.log(`\n2️⃣ Posting a Job...`);
        const jobData = {
            title: 'Senior React Developer',
            description: 'We need a rockstar developer',
            company: 'Job Test Co',
            location: 'Remote',
            type: 'Full-time',
            salary: '₹15L - ₹25L',
            category: 'Development',
            requirements: ['React', 'Node.js', 'TypeScript'],
            experienceLevel: 'Senior',
            workMode: 'Remote'
        };

        const postResponse = await axios.post(`${BASE_URL}/jobs`, jobData, {
            headers: { Authorization: `Bearer ${employerToken}` }
        });

        if (postResponse.status === 201) {
            console.log('   ✅ Job Posted Successfully');
            jobId = postResponse.data.data._id;
            console.log('   Job ID:', jobId);
        }

        // 3. List Jobs (Public)
        console.log(`\n3️⃣ Listing Jobs (Public)...`);
        const listResponse = await axios.get(`${BASE_URL}/jobs`);
        const jobs = listResponse.data.data;
        const found = jobs.find(j => j._id === jobId);

        if (found) console.log('   ✅ Job found in public listing');
        else console.log('   ❌ Job NOT found in public listing');

        // 4. Update Job
        console.log(`\n4️⃣ Updating Job...`);
        const updateResponse = await axios.put(`${BASE_URL}/jobs/${jobId}`, {
            title: 'Lead React Developer'
        }, {
            headers: { Authorization: `Bearer ${employerToken}` }
        });

        if (updateResponse.status === 200 && updateResponse.data.data.title === 'Lead React Developer') {
            console.log('   ✅ Job Updated Successfully');
        } else {
            console.log('   ❌ Job Update Failed');
        }

        // 5. Delete Job
        console.log(`\n5️⃣ Deleting Job...`);
        const deleteResponse = await axios.delete(`${BASE_URL}/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${employerToken}` }
        });

        if (deleteResponse.status === 200) {
            console.log('   ✅ Job Deleted Successfully');
        }

        // 6. Verify Deletion
        try {
            await axios.get(`${BASE_URL}/jobs/${jobId}`);
            console.log('   ❌ Job still exists after deletion');
        } catch (e) {
            if (e.response && e.response.status === 404) {
                console.log('   ✅ Job correctly returned 404');
            } else {
                console.log('   ⚠️ Startling response check deletion:', e.message);
            }
        }

    } catch (error) {
        console.error('   ❌ Error:', error.response ? error.response.data : error.message);
    }
}

verifyJobs();
