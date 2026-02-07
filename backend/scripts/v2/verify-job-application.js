const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let employerToken = '';
let employerId = '';
let employeeToken = '';
let employeeId = '';
let jobId = '';

async function verifyJobApplication() {
    console.log('🚀 Starting Job Application Verification...');

    try {
        // 1. Create Employer
        const uniqueId = Date.now();
        const employerEmail = `test.emp.app.${uniqueId}@example.com`;
        const password = 'Password@123';

        console.log(`\n1️⃣ Creating Employer...`);
        const Form = require('form-data');
        const formEmployer = new Form();
        formEmployer.append('name', 'App Employer');
        formEmployer.append('email', employerEmail);
        formEmployer.append('password', password);
        formEmployer.append('role', 'employer');
        formEmployer.append('company', 'App Test Co');

        await axios.post(`${BASE_URL}/auth/signup`, formEmployer, { headers: { ...formEmployer.getHeaders() } });

        const loginEmpResponse = await axios.post(`${BASE_URL}/auth/login`, { email: employerEmail, password });
        employerToken = loginEmpResponse.data.token;
        employerId = loginEmpResponse.data.user.id;
        console.log('   ✅ Employer Logged In');

        // 2. Post a Job
        console.log(`\n2️⃣ Posting a Job...`);
        const jobData = {
            title: 'React Dev for App Test',
            description: 'Apply now',
            company: 'App Test Co',
            location: 'Remote',
            type: 'Full-time',
            salary: '₹10L - ₹20L',
            category: 'Development',
            requirements: ['React'],
            responsibilities: ['Coding']
        };

        const postResponse = await axios.post(`${BASE_URL}/jobs`, jobData, {
            headers: { Authorization: `Bearer ${employerToken}` }
        });
        jobId = postResponse.data.data._id;
        console.log('   ✅ Job Posted:', jobId);

        // 3. Create Employee
        const employeeEmail = `test.employee.app.${uniqueId}@example.com`;
        console.log(`\n3️⃣ Creating Employee...`);
        const formEmployee = new Form();
        formEmployee.append('name', 'App Employee');
        formEmployee.append('email', employeeEmail);
        formEmployee.append('password', password);
        formEmployee.append('role', 'employee');

        await axios.post(`${BASE_URL}/auth/signup`, formEmployee, { headers: { ...formEmployee.getHeaders() } });

        const loginEmp2Response = await axios.post(`${BASE_URL}/auth/login`, { email: employeeEmail, password });
        employeeToken = loginEmp2Response.data.token;
        employeeId = loginEmp2Response.data.user.id;
        console.log('   ✅ Employee Logged In');

        // 4. Apply to Job
        console.log(`\n4️⃣ Applying to Job...`);
        try {
            const applyResponse = await axios.post(`${BASE_URL}/applications/jobs/${jobId}/apply`, {
                message: 'I am interested'
            }, {
                headers: { Authorization: `Bearer ${employeeToken}` }
            });

            if (applyResponse.status === 201) {
                console.log('   ✅ Application Submitted');
            }
        } catch (e) {
            console.log('   ❌ Application Failed:', e.response ? e.response.data : e.message);
        }

        // 5. Verify Employee's Applications
        console.log(`\n5️⃣ Verifying Employee Applications...`);
        const myAppsResponse = await axios.get(`${BASE_URL}/applications/my-applications`, {
            headers: { Authorization: `Bearer ${employeeToken}` }
        });

        // Structure might be different depending on controller
        const myApps = myAppsResponse.data;
        // Controller returns: res.status(200).json(applications);

        const foundMyApp = Array.isArray(myApps) && myApps.find(a => a.jobId && a.jobId._id === jobId || a.jobId === jobId);

        if (foundMyApp) console.log('   ✅ Application found in Employee list');
        else {
            console.log('   ❌ Application NOT found in Employee list');
            console.log('   List:', JSON.stringify(myApps, null, 2));
        }

        // 6. Verify Employer's Received Applications
        console.log(`\n6️⃣ Verifying Employer Received Applications...`);
        // Route: /jobs/:jobId/applications
        const jobAppsResponse = await axios.get(`${BASE_URL}/applications/jobs/${jobId}/applications`, {
            headers: { Authorization: `Bearer ${employerToken}` }
        });

        const jobApps = jobAppsResponse.data;
        const foundJobApp = Array.isArray(jobApps) && jobApps.find(a => a.applicantId && (a.applicantId._id === employeeId || a.applicantId === employeeId));

        if (foundJobApp) console.log('   ✅ Application found in Job Applications list');
        else {
            console.log('   ❌ Application NOT found in Job Applications list');
            console.log('   List:', JSON.stringify(jobApps, null, 2));
        }

    } catch (error) {
        console.error('   ❌ Critical Error:', error.response ? error.response.data : error.message);
    }
}

verifyJobApplication();
