// Feature 4: Application System - Complete Test Script

const BASE_URL = 'http://localhost:5000';

let tokens = {};
let data = {
    jobId: null,
    resourceId: null,
    jobApplicationId: null,
    resourceApplicationId: null
};

const testUsers = {
    recruiter: {
        name: 'Jane Recruiter',
        email: 'jane.recruiter.f4@test.com',
        password: 'Test123!',
        role: 'recruiter',
        company: 'HireXO',
        phoneNumber: '1111111111'
    },
    jobSeeker: {
        name: 'John Seeker',
        email: 'john.seeker.f4@test.com',
        password: 'Test123!',
        role: 'job-seeker',
        phoneNumber: '2222222222'
    },
    jobSeeker2: {
        name: 'Bob Seeker',
        email: 'bob.seeker.f4@test.com',
        password: 'Test123!',
        role: 'job-seeker',
        phoneNumber: '3333333333'
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
        const resData = await response.json();

        if (response.ok) {
            console.log(`✅ PASS: ${name}`);
            console.log(`   Status: ${response.status}`);
            return { success: true, data: resData, status: response.status };
        } else {
            const isExpectedFailure = name.includes('Should Fail');
            if (isExpectedFailure) {
                console.log(`✅ PASS (Expected Failure): ${name}`);
            } else {
                console.log(`❌ FAIL: ${name}`);
            }
            console.log(`   Status: ${response.status}`);
            console.log(`   Error:`, resData.message || resData);
            return { success: false, data: resData, status: response.status };
        }
    } catch (error) {
        console.log(`❌ ERROR: ${name}`);
        console.log(`   ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function runApplicationTests() {
    console.log('='.repeat(60));
    console.log('🚀 FEATURE 4: APPLICATION SYSTEM - COMPLETE TEST');
    console.log('='.repeat(60));

    const results = { total: 0, passed: 0, failed: 0 };

    // 1. Setup Users
    console.log('\n📋 SETUP: Creating Test Users');
    for (const [key, userData] of Object.entries(testUsers)) {
        const result = await testEndpoint(`Setup - Create ${key}`, 'POST', '/api/auth/signup', userData);
        if (result.success) tokens[key] = result.data.token;
    }

    // 2. Setup Job and Resource
    console.log('\n📋 SETUP: Creating Job and Resource');
    const jobResult = await testEndpoint(
        'Setup - Create Job',
        'POST',
        '/api/jobs',
        {
            title: 'Senior Developer',
            company: 'HireXO',
            location: 'Remote',
            salary: '100k-120k',
            type: 'Full-time',
            category: 'Engineering',
            description: 'Test job description'
        },
        { 'Authorization': `Bearer ${tokens.recruiter}` }
    );
    if (jobResult.success) data.jobId = jobResult.data.data?._id;

    const resResult = await testEndpoint(
        'Setup - Create Equipment',
        'POST',
        '/api/equipments',
        {
            title: 'Test Equipment',
            company: 'HireXO',
            location: 'Remote',
            compensation: '$100/day',
            type: 'Rental',
            category: 'Equipments',
            description: 'Test equipment description'
        },
        { 'Authorization': `Bearer ${tokens.recruiter}` }
    );
    if (resResult.success) data.resourceId = resResult.data.data?._id;

    if (!data.jobId || !data.resourceId) {
        console.log('❌ FATAL: Setup failed. Cannot proceed with application tests.');
        return;
    }

    // 4.1 Job Application
    console.log('\n📋 TEST SUITE 4.1: JOB APPLICATIONS');
    console.log('-'.repeat(60));

    // Apply
    let result = await testEndpoint(
        '4.1.1 Apply to Job',
        'POST',
        `/api/applications/jobs/${data.jobId}/apply`,
        { message: 'I am interested in this job' },
        { 'Authorization': `Bearer ${tokens.jobSeeker}` }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        data.jobApplicationId = result.data.application?._id;
    } else results.failed++;

    // Duplicate (Should Fail)
    result = await testEndpoint(
        '4.1.2 Duplicate Application (Should Fail)',
        'POST',
        `/api/applications/jobs/${data.jobId}/apply`,
        { message: 'Applying again' },
        { 'Authorization': `Bearer ${tokens.jobSeeker}` }
    );
    results.total++;
    if (!result.success) results.passed++; else results.failed++;

    // Apply to own job (Should Fail)
    result = await testEndpoint(
        '4.1.3 Apply to Own Job (Should Fail)',
        'POST',
        `/api/applications/jobs/${data.jobId}/apply`,
        { message: 'Me applying to me' },
        { 'Authorization': `Bearer ${tokens.recruiter}` }
    );
    results.total++;
    if (!result.success) results.passed++; else results.failed++;

    // View applications (Owner)
    result = await testEndpoint(
        '4.1.4 View Job Applications (As Owner)',
        'GET',
        `/api/applications/jobs/${data.jobId}/applications`,
        null,
        { 'Authorization': `Bearer ${tokens.recruiter}` }
    );
    results.total++;
    if (result.success && result.data.length > 0) results.passed++; else results.failed++;

    // View applications (Not Owner - Should Fail)
    result = await testEndpoint(
        '4.1.5 View Job Applications (As Non-Owner - Should Fail)',
        'GET',
        `/api/applications/jobs/${data.jobId}/applications`,
        null,
        { 'Authorization': `Bearer ${tokens.jobSeeker2}` }
    );
    results.total++;
    if (!result.success && result.status === 403) results.passed++; else results.failed++;

    // 4.2 Resource Application
    console.log('\n📋 TEST SUITE 4.2: RESOURCE APPLICATIONS');
    console.log('-'.repeat(60));

    // Apply
    result = await testEndpoint(
        '4.2.1 Apply to Equipment',
        'POST',
        `/api/applications/resources/Equipment/${data.resourceId}/apply`,
        { message: 'Applying for equipment' },
        { 'Authorization': `Bearer ${tokens.jobSeeker}` }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        data.resourceApplicationId = result.data.application?._id;
    } else results.failed++;

    // View applications (Owner)
    result = await testEndpoint(
        '4.2.2 View Equipment Applications (As Owner)',
        'GET',
        `/api/applications/resources/Equipment/${data.resourceId}/applications`,
        null,
        { 'Authorization': `Bearer ${tokens.recruiter}` }
    );
    results.total++;
    if (result.success && result.data.length > 0) results.passed++; else results.failed++;

    // 4.3 Status & My Applications
    console.log('\n📋 TEST SUITE 4.3: STATUS & LISTING');
    console.log('-'.repeat(60));

    // Get My Applications
    result = await testEndpoint(
        '4.3.1 Get My Applications',
        'GET',
        '/api/applications/my-applications',
        null,
        { 'Authorization': `Bearer ${tokens.jobSeeker}` }
    );
    results.total++;
    if (result.success && result.data.jobs?.length > 0 && result.data.resources?.length > 0) results.passed++; else results.failed++;

    // Update Status (Owner - Accept)
    result = await testEndpoint(
        '4.3.2 Update Application Status (As Owner - Accept)',
        'PUT',
        `/api/applications/${data.jobApplicationId}/status`,
        { status: 'Accepted', type: 'job' },
        { 'Authorization': `Bearer ${tokens.recruiter}` }
    );
    results.total++;
    if (result.success && result.data.application?.status === 'Accepted') results.passed++; else results.failed++;

    // Update Status (Not Owner - Should Fail)
    result = await testEndpoint(
        '4.3.3 Update Application Status (As Non-Owner - Should Fail)',
        'PUT',
        `/api/applications/${data.jobApplicationId}/status`,
        { status: 'Rejected', type: 'job' },
        { 'Authorization': `Bearer ${tokens.jobSeeker2}` }
    );
    results.total++;
    if (!result.success && result.status === 403) results.passed++; else results.failed++;


    // SUMMARY
    console.log('\n' + '='.repeat(60));
    console.log('📊 APPLICATION SYSTEM FEATURE TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${results.total}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`);
    console.log('='.repeat(60));

    if (results.failed === 0) {
        console.log('\n✅ ALL TESTS PASSED - Application System feature is complete!');
    }
}

runApplicationTests().catch(console.error);
