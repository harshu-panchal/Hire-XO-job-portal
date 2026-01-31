// Feature 6: Certificate Management - Complete Test Script

const BASE_URL = 'http://localhost:5000';

let tokens = {};
let certIds = [];

const testUsers = {
    user1: {
        name: 'John Cert',
        email: 'john.cert.f6@test.com',
        password: 'Test123!',
        role: 'job-seeker',
        phoneNumber: '1111111111'
    },
    user2: {
        name: 'Jane Cert',
        email: 'jane.cert.f6@test.com',
        password: 'Test123!',
        role: 'job-seeker',
        phoneNumber: '2222222222'
    }
};

async function testEndpoint(name, method, url, body, headers = {}) {
    console.log(`\n🧪 Testing: ${name}`);
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        if (body) options.body = JSON.stringify(body);

        const response = await fetch(`${BASE_URL}${url}`, options);
        const data = await response.json();

        if (response.ok) {
            console.log(`✅ PASS: ${name}`);
            console.log(`   Status: ${response.status}`);
            return { success: true, data, status: response.status };
        } else {
            const isExpectedFailure = name.includes('Should Fail');
            if (isExpectedFailure) {
                console.log(`✅ PASS (Expected Failure): ${name}`);
            } else {
                console.log(`❌ FAIL: ${name}`);
            }
            console.log(`   Status: ${response.status}`);
            console.log(`   Error:`, data.message || data);
            return { success: false, data, status: response.status };
        }
    } catch (error) {
        console.log(`❌ ERROR: ${name}`);
        console.log(`   ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function runCertificateTests() {
    console.log('='.repeat(60));
    console.log('🚀 FEATURE 6: CERTIFICATE MANAGEMENT - COMPLETE TEST');
    console.log('='.repeat(60));

    const results = { total: 0, passed: 0, failed: 0 };

    // 1. Setup Users
    console.log('\n📋 SETUP: Creating Test Users');
    for (const [key, userData] of Object.entries(testUsers)) {
        const result = await testEndpoint(`Setup - Create ${key}`, 'POST', '/api/auth/signup', userData);
        if (result.success) tokens[key] = result.data.token;
    }

    // 2. Creation Tests
    console.log('\n📋 TEST SUITE 6.1: CERTIFICATE CREATION');
    console.log('-'.repeat(60));

    // Valid Certificate
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    let result = await testEndpoint(
        '6.1.1 Create Valid Certificate',
        'POST',
        '/api/certificates',
        {
            name: 'AWS Certified Solutions Architect',
            issueDate: now,
            expiryDate: nextYear,
            successRate: 95
        },
        { 'Authorization': `Bearer ${tokens.user1}` }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        certIds.push(result.data.certificate?._id);
    } else results.failed++;

    // Invalid Success Rate (Should Fail)
    result = await testEndpoint(
        '6.1.2 Create Invalid Success Rate (Should Fail)',
        'POST',
        '/api/certificates',
        {
            name: 'Invalid Rate',
            issueDate: now,
            expiryDate: nextYear,
            successRate: 150
        },
        { 'Authorization': `Bearer ${tokens.user1}` }
    );
    results.total++;
    if (!result.success && result.status === 400) results.passed++; else results.failed++;

    // Invalid Date Range (Should Fail)
    result = await testEndpoint(
        '6.1.3 Create Invalid Date Range (Should Fail)',
        'POST',
        '/api/certificates',
        {
            name: 'Invalid Date',
            issueDate: nextYear,
            expiryDate: now,
            successRate: 90
        },
        { 'Authorization': `Bearer ${tokens.user1}` }
    );
    results.total++;
    if (!result.success && result.status === 400) results.passed++; else results.failed++;

    // 3. Status Logic
    console.log('\n📋 TEST SUITE 6.2: STATUS LOGIC');
    console.log('-'.repeat(60));

    // Create Expired Certificate
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    result = await testEndpoint(
        '6.2.1 Create Already Expired Certificate',
        'POST',
        '/api/certificates',
        {
            name: 'Legacy Certification',
            issueDate: lastYear,
            expiryDate: yesterday,
            successRate: 85
        },
        { 'Authorization': `Bearer ${tokens.user1}` }
    );
    results.total++;
    if (result.success && result.data.certificate?.status === 'Expired') {
        results.passed++;
    } else results.failed++;

    // 4. Listing Tests
    console.log('\n📋 TEST SUITE 6.3: LISTING & DETAIL');
    console.log('-'.repeat(60));

    // Get All
    result = await testEndpoint(
        '6.3.1 Get User Certificates',
        'GET',
        '/api/certificates',
        null,
        { 'Authorization': `Bearer ${tokens.user1}` }
    );
    results.total++;
    if (result.success && result.data.length >= 2) results.passed++; else results.failed++;

    // Get Active
    result = await testEndpoint(
        '6.3.2 Get Active Certificates',
        'GET',
        '/api/certificates/active',
        null,
        { 'Authorization': `Bearer ${tokens.user1}` }
    );
    results.total++;
    if (result.success && result.data.length === 1) results.passed++; else results.failed++;

    // 5. Security & Ownership
    console.log('\n📋 TEST SUITE 6.4: SECURITY & OWNERSHIP');
    console.log('-'.repeat(60));

    // Get other user's certificate (Should Fail)
    result = await testEndpoint(
        '6.4.1 Get Other User Certificate (Should Fail)',
        'GET',
        `/api/certificates/${certIds[0]}`,
        null,
        { 'Authorization': `Bearer ${tokens.user2}` }
    );
    results.total++;
    if (!result.success && result.status === 404) results.passed++; else results.failed++;

    // Delete (Owner)
    result = await testEndpoint(
        '6.4.2 Delete Certificate (Owner)',
        'DELETE',
        `/api/certificates/${certIds[0]}`,
        null,
        { 'Authorization': `Bearer ${tokens.user1}` }
    );
    results.total++;
    if (result.success) results.passed++; else results.failed++;

    // SUMMARY
    console.log('\n' + '='.repeat(60));
    console.log('📊 CERTIFICATE MANAGEMENT FEATURE TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${results.total}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`);
    console.log('='.repeat(60));

    if (results.failed === 0) {
        console.log('\n✅ ALL TESTS PASSED - Certificate Management feature is complete!');
    }
}

runCertificateTests().catch(console.error);
