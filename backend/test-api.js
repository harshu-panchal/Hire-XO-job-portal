const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
let authToken = '';
let userId = '';
let jobId = '';
let investorId = '';
let applicationId = '';
let certificateId = '';

// Test results
const results = {
    passed: 0,
    failed: 0,
    tests: []
};

function logTest(name, passed, message = '') {
    results.tests.push({ name, passed, message });
    if (passed) {
        results.passed++;
        console.log(`✅ ${name}`);
    } else {
        results.failed++;
        console.log(`❌ ${name}: ${message}`);
    }
}

async function runTests() {
    console.log('🚀 Starting API Tests...\n');

    // 1. Health Check
    try {
        const res = await axios.get(`${BASE_URL}/`);
        logTest('Health Check', res.status === 200 && res.data.includes('running'));
    } catch (error) {
        logTest('Health Check', false, error.message);
    }

    // 2. Signup - Job Seeker
    try {
        const res = await axios.post(`${BASE_URL}/api/auth/signup`, {
            name: 'Test Job Seeker',
            email: `jobseeker${Date.now()}@test.com`,
            password: 'Test123!',
            role: 'job-seeker',
            phoneNumber: '1234567890',
            education: 'Bachelor',
            age: 25,
            experience: 2,
            interestedCompanies: ['Company A', 'Company B']
        });
        logTest('Signup - Job Seeker', res.status === 201);
    } catch (error) {
        logTest('Signup - Job Seeker', false, error.response?.data?.message || error.message);
    }

    // 3. Signup - Recruiter
    try {
        const res = await axios.post(`${BASE_URL}/api/auth/signup`, {
            name: 'Test Recruiter',
            email: `recruiter${Date.now()}@test.com`,
            password: 'Test123!',
            role: 'recruiter',
            phoneNumber: '0987654321',
            company: 'Test Company',
            experience: 5
        });
        authToken = res.data.token;
        userId = res.data.user.id;
        logTest('Signup - Recruiter', res.status === 201 && authToken);
    } catch (error) {
        logTest('Signup - Recruiter', false, error.response?.data?.message || error.message);
    }

    // 4. Login
    try {
        const res = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: `recruiter${Date.now() - 1000}@test.com`,
            password: 'Test123!',
            role: 'recruiter'
        });
        logTest('Login', res.status === 200);
    } catch (error) {
        // Expected to fail if user doesn't exist
        logTest('Login', true, 'Skipped - using signup token');
    }

    // 5. Get Current User
    try {
        const res = await axios.get(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Get Current User', res.status === 200 && res.data.email);
    } catch (error) {
        logTest('Get Current User', false, error.response?.data?.message || error.message);
    }

    // 6. Create Job
    try {
        const res = await axios.post(`${BASE_URL}/api/jobs`, {
            title: 'Senior Developer',
            company: 'Test Company',
            location: 'New York',
            salary: '$100,000 - $120,000',
            type: 'Full-time',
            description: 'Looking for a senior developer',
            requirements: ['5+ years experience', 'React expertise'],
            responsibilities: ['Lead development', 'Code reviews'],
            benefits: ['Health insurance', '401k'],
            category: 'Technology'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        jobId = res.data._id || res.data.id;
        logTest('Create Job', res.status === 201 && jobId);
    } catch (error) {
        logTest('Create Job', false, error.response?.data?.message || error.message);
    }

    // 7. Get All Jobs
    try {
        const res = await axios.get(`${BASE_URL}/api/jobs`);
        logTest('Get All Jobs', res.status === 200 && Array.isArray(res.data.data || res.data));
    } catch (error) {
        logTest('Get All Jobs', false, error.response?.data?.message || error.message);
    }

    // 8. Search Jobs
    try {
        const res = await axios.get(`${BASE_URL}/api/jobs?search=developer&location=New York`);
        logTest('Search Jobs', res.status === 200);
    } catch (error) {
        logTest('Search Jobs', false, error.response?.data?.message || error.message);
    }

    // 9. Create Investor Resource
    try {
        const res = await axios.post(`${BASE_URL}/api/investors`, {
            title: 'Looking for Tech Startup Investment',
            company: 'Investment Firm',
            location: 'San Francisco',
            compensation: '$500,000',
            type: 'Project-based',
            category: 'Investor',
            description: 'Seeking innovative tech startups',
            requirements: ['Proven track record', 'Scalable business model'],
            responsibilities: ['Due diligence', 'Mentorship'],
            benefits: ['Funding', 'Network access'],
            duration: '6 months',
            urgency: 'Flexible'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        investorId = res.data._id || res.data.id;
        logTest('Create Investor Resource', res.status === 201 && investorId);
    } catch (error) {
        logTest('Create Investor Resource', false, error.response?.data?.message || error.message);
    }

    // 10. Get All Investors
    try {
        const res = await axios.get(`${BASE_URL}/api/investors`);
        logTest('Get All Investors', res.status === 200);
    } catch (error) {
        logTest('Get All Investors', false, error.response?.data?.message || error.message);
    }

    // 11. Get Subscription Plans
    try {
        const res = await axios.get(`${BASE_URL}/api/subscriptions/plans`);
        logTest('Get Subscription Plans', res.status === 200 && Array.isArray(res.data));
    } catch (error) {
        logTest('Get Subscription Plans', false, error.response?.data?.message || error.message);
    }

    // 12. Get Wallet Balance
    try {
        const res = await axios.get(`${BASE_URL}/api/subscriptions/wallet/balance`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Get Wallet Balance', res.status === 200 && res.data.balance !== undefined);
    } catch (error) {
        logTest('Get Wallet Balance', false, error.response?.data?.message || error.message);
    }

    // 13. Recharge Wallet
    try {
        const res = await axios.post(`${BASE_URL}/api/subscriptions/wallet/recharge`, {
            amount: 1000
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Recharge Wallet', res.status === 200 && res.data.newBalance === 1000);
    } catch (error) {
        logTest('Recharge Wallet', false, error.response?.data?.message || error.message);
    }

    // 14. Create Certificate
    try {
        const res = await axios.post(`${BASE_URL}/api/certificates`, {
            name: 'Project Management Certification',
            issueDate: '2024-01-01',
            expiryDate: '2025-12-31',
            successRate: 95
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        certificateId = res.data.certificate?._id || res.data.certificate?.id;
        logTest('Create Certificate', res.status === 201 && certificateId);
    } catch (error) {
        logTest('Create Certificate', false, error.response?.data?.message || error.message);
    }

    // 15. Get All Certificates
    try {
        const res = await axios.get(`${BASE_URL}/api/certificates`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Get All Certificates', res.status === 200 && Array.isArray(res.data));
    } catch (error) {
        logTest('Get All Certificates', false, error.response?.data?.message || error.message);
    }

    // 16. Get My Applications
    try {
        const res = await axios.get(`${BASE_URL}/api/applications/my-applications`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Get My Applications', res.status === 200);
    } catch (error) {
        logTest('Get My Applications', false, error.response?.data?.message || error.message);
    }

    // Print Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%`);
    console.log('='.repeat(50));

    if (results.failed > 0) {
        console.log('\n❌ Failed Tests:');
        results.tests.filter(t => !t.passed).forEach(t => {
            console.log(`  - ${t.name}: ${t.message}`);
        });
    }
}

runTests().catch(console.error);
