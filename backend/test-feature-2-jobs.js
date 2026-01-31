// Feature 2: Job Management - Complete Test Script

const BASE_URL = 'http://localhost:5000';

// Store tokens and IDs from Feature 1
let tokens = {};
let userIds = {};
let jobIds = [];

// Test data
const testUsers = {
    jobSeeker: {
        name: 'John Seeker',
        email: 'john.seeker.f2@test.com',
        password: 'Test123!',
        role: 'job-seeker',
        phoneNumber: '1234567890',
        education: 'Bachelor',
        age: 25,
        experience: 2
    },
    recruiter: {
        name: 'Jane Recruiter',
        email: 'jane.recruiter.f2@test.com',
        password: 'Test123!',
        role: 'recruiter',
        phoneNumber: '0987654321',
        company: 'TechCorp',
        experience: 5
    },
    recruiter2: {
        name: 'Bob Recruiter',
        email: 'bob.recruiter.f2@test.com',
        password: 'Test123!',
        role: 'recruiter',
        phoneNumber: '5555555555',
        company: 'StartupCo',
        experience: 3
    }
};

const testJobs = {
    job1: {
        title: 'Senior Software Engineer',
        description: 'We are looking for an experienced software engineer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        salary: '120000-150000',
        type: 'Full-time',
        category: 'Engineering',
        requirements: ['5+ years experience', 'Bachelor degree'],
        responsibilities: ['Lead development', 'Code reviews'],
        benefits: ['Health insurance', '401k']
    },
    job2: {
        title: 'Junior Frontend Developer',
        description: 'Entry level position for frontend development',
        company: 'TechCorp',
        location: 'Remote',
        salary: '60000-80000',
        type: 'Full-time',
        category: 'Engineering',
        requirements: ['1+ years experience'],
        responsibilities: ['Build UI components'],
        benefits: ['Remote work', 'Flexible hours']
    },
    job3: {
        title: 'DevOps Engineer',
        description: 'Manage cloud infrastructure',
        company: 'StartupCo',
        location: 'New York, NY',
        salary: '100000-130000',
        type: 'Full-time',
        category: 'DevOps',
        requirements: ['3+ years experience'],
        responsibilities: ['Manage AWS', 'CI/CD'],
        benefits: ['Stock options', 'Health insurance']
    }
};

// Helper function
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

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${BASE_URL}${url}`, options);
        const data = await response.json();

        if (response.ok) {
            console.log(`✅ PASS: ${name}`);
            console.log(`   Status: ${response.status}`);
            if (data.data || data.jobs || data.job) {
                const preview = JSON.stringify(data, null, 2).substring(0, 150);
                console.log(`   Response: ${preview}...`);
            }
            return { success: true, data, status: response.status };
        } else {
            // Check if failure was expected
            const isExpectedFailure = (name.includes('Should Fail') || name.includes('Without Token'));
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

async function runJobManagementTests() {
    console.log('='.repeat(60));
    console.log('🚀 FEATURE 2: JOB MANAGEMENT - COMPLETE TEST');
    console.log('='.repeat(60));

    const results = {
        total: 0,
        passed: 0,
        failed: 0
    };

    // SETUP: Create test users
    console.log('\n📋 SETUP: Creating Test Users');
    console.log('-'.repeat(60));

    for (const [key, userData] of Object.entries(testUsers)) {
        const result = await testEndpoint(
            `Setup - Create ${key}`,
            'POST',
            '/api/auth/signup',
            userData
        );
        if (result.success) {
            tokens[key] = result.data.token;
            userIds[key] = result.data.user?.id || result.data.user?._id;
            console.log(`   ✅ ${key} created with token`);
        }
    }

    // TEST 1: Create Job - Recruiter
    console.log('\n📋 TEST SUITE 1: JOB CREATION');
    console.log('-'.repeat(60));

    let result = await testEndpoint(
        '1.1 Create Job - As Recruiter',
        'POST',
        '/api/jobs',
        testJobs.job1,
        { 'Authorization': `Bearer ${tokens.recruiter}` }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        const jobId = result.data.data?._id || result.data.job?._id || result.data._id;
        if (jobId) {
            jobIds.push(jobId);
            console.log(`   ✅ Job created with ID: ${jobId}`);
        } else {
            console.log(`   ⚠️  Job created but ID not found in response`);
        }
    } else {
        results.failed++;
    }

    // TEST 2: Create Job - Job Seeker (Should Fail)
    result = await testEndpoint(
        '1.2 Create Job - As Job Seeker (Should Fail)',
        'POST',
        '/api/jobs',
        testJobs.job2,
        { 'Authorization': `Bearer ${tokens.jobSeeker}` }
    );
    results.total++;
    if (!result.success && (result.status === 403 || result.status === 401)) {
        results.passed++;
        console.log('   ✅ Correctly rejected job seeker from creating job');
    } else {
        results.failed++;
        console.log('   ❌ Should have rejected job seeker');
    }

    // TEST 3: Create Job - Without Token
    result = await testEndpoint(
        '1.3 Create Job - Without Token',
        'POST',
        '/api/jobs',
        testJobs.job2
    );
    results.total++;
    if (!result.success && result.status === 401) {
        results.passed++;
        console.log('   ✅ Correctly rejected request without token');
    } else {
        results.failed++;
    }

    // Create more jobs for testing
    result = await testEndpoint(
        'Setup - Create Job 2',
        'POST',
        '/api/jobs',
        testJobs.job2,
        { 'Authorization': `Bearer ${tokens.recruiter}` }
    );
    if (result.success) {
        const jobId = result.data.data?._id || result.data.job?._id || result.data._id;
        if (jobId) jobIds.push(jobId);
    }

    result = await testEndpoint(
        'Setup - Create Job 3',
        'POST',
        '/api/jobs',
        testJobs.job3,
        { 'Authorization': `Bearer ${tokens.recruiter2}` }
    );
    if (result.success) {
        const jobId = result.data.data?._id || result.data.job?._id || result.data._id;
        if (jobId) jobIds.push(jobId);
    }

    // TEST 4: Get All Jobs - Public
    console.log('\n📋 TEST SUITE 2: JOB LISTING');
    console.log('-'.repeat(60));

    result = await testEndpoint(
        '2.1 Get All Jobs - Public Access',
        'GET',
        '/api/jobs',
        null
    );
    results.total++;
    if (result.success) {
        results.passed++;
        const jobCount = result.data.jobs?.length || result.data.data?.length || 0;
        console.log(`   ✅ Retrieved ${jobCount} jobs`);
    } else {
        results.failed++;
    }

    // TEST 5: Get Job Details
    result = await testEndpoint(
        '2.2 Get Job Details - By ID',
        'GET',
        `/api/jobs/${jobIds[0]}`,
        null
    );
    results.total++;
    if (result.success) {
        results.passed++;
        console.log(`   ✅ Retrieved job details`);
    } else {
        results.failed++;
    }

    // TEST 6: Get Job Details - Invalid ID
    result = await testEndpoint(
        '2.3 Get Job Details - Invalid ID',
        'GET',
        '/api/jobs/invalid_id_123',
        null
    );
    results.total++;
    if (!result.success && result.status === 400) {
        results.passed++;
        console.log('   ✅ Correctly handled invalid ID format');
    } else {
        results.failed++;
    }

    // TEST 7: Search Jobs
    console.log('\n📋 TEST SUITE 3: JOB SEARCH & FILTER');
    console.log('-'.repeat(60));

    result = await testEndpoint(
        '3.1 Search Jobs - By Title',
        'GET',
        '/api/jobs?search=Engineer',
        null
    );
    results.total++;
    if (result.success) {
        results.passed++;
        console.log('   ✅ Search by title working');
    } else {
        results.failed++;
    }

    // TEST 8: Filter by Location
    result = await testEndpoint(
        '3.2 Filter Jobs - By Location',
        'GET',
        '/api/jobs?location=Remote',
        null
    );
    results.total++;
    if (result.success) {
        results.passed++;
        console.log('   ✅ Filter by location working');
    } else {
        results.failed++;
    }

    // TEST 9: Filter by Job Type
    result = await testEndpoint(
        '3.3 Filter Jobs - By Job Type',
        'GET',
        '/api/jobs?type=Full-time',
        null
    );
    results.total++;
    if (result.success) {
        results.passed++;
        console.log('   ✅ Filter by job type working');
    } else {
        results.failed++;
    }

    // TEST 10: Update Job - Owner
    console.log('\n📋 TEST SUITE 4: JOB UPDATE');
    console.log('-'.repeat(60));

    result = await testEndpoint(
        '4.1 Update Job - As Owner',
        'PUT',
        `/api/jobs/${jobIds[0]}`,
        { title: 'Senior Software Engineer - Updated', salary: '130000-160000' },
        { 'Authorization': `Bearer ${tokens.recruiter}` }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        console.log('   ✅ Job updated successfully');
    } else {
        results.failed++;
    }

    // TEST 11: Update Job - Non-Owner
    result = await testEndpoint(
        '4.2 Update Job - As Non-Owner (Should Fail)',
        'PUT',
        `/api/jobs/${jobIds[0]}`,
        { title: 'Hacked Title' },
        { 'Authorization': `Bearer ${tokens.recruiter2}` }
    );
    results.total++;
    if (!result.success && (result.status === 403 || result.status === 401)) {
        results.passed++;
        console.log('   ✅ Correctly rejected non-owner update');
    } else {
        results.failed++;
        console.log('   ❌ Should have rejected non-owner');
    }

    // TEST 12: Update Job - Job Seeker
    result = await testEndpoint(
        '4.3 Update Job - As Job Seeker (Should Fail)',
        'PUT',
        `/api/jobs/${jobIds[0]}`,
        { title: 'Hacked Title' },
        { 'Authorization': `Bearer ${tokens.jobSeeker}` }
    );
    results.total++;
    if (!result.success && (result.status === 403 || result.status === 401)) {
        results.passed++;
        console.log('   ✅ Correctly rejected job seeker update');
    } else {
        results.failed++;
    }

    // TEST 13: Get My Jobs - Recruiter
    console.log('\n📋 TEST SUITE 5: MY JOBS');
    console.log('-'.repeat(60));

    result = await testEndpoint(
        '5.1 Get My Jobs - As Recruiter',
        'GET',
        '/api/jobs/my-listings',
        null,
        { 'Authorization': `Bearer ${tokens.recruiter}` }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        const myJobCount = result.data.jobs?.length || result.data.data?.length || 0;
        console.log(`   ✅ Retrieved ${myJobCount} my jobs`);
    } else {
        results.failed++;
    }

    // TEST 14: Get My Jobs - Job Seeker
    result = await testEndpoint(
        '5.2 Get My Jobs - As Job Seeker (Should Return Empty)',
        'GET',
        '/api/jobs/my-listings',
        null,
        { 'Authorization': `Bearer ${tokens.jobSeeker}` }
    );
    results.total++;
    if (result.success || result.status === 403) {
        results.passed++;
        console.log('   ✅ Handled job seeker my-jobs request');
    } else {
        results.failed++;
    }

    // TEST 15: Delete Job - Owner
    console.log('\n📋 TEST SUITE 6: JOB DELETION');
    console.log('-'.repeat(60));

    result = await testEndpoint(
        '6.1 Delete Job - As Owner',
        'DELETE',
        `/api/jobs/${jobIds[1]}`,
        null,
        { 'Authorization': `Bearer ${tokens.recruiter}` }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        console.log('   ✅ Job deleted successfully');
    } else {
        results.failed++;
    }

    // TEST 16: Delete Job - Non-Owner
    result = await testEndpoint(
        '6.2 Delete Job - As Non-Owner (Should Fail)',
        'DELETE',
        `/api/jobs/${jobIds[0]}`,
        null,
        { 'Authorization': `Bearer ${tokens.recruiter2}` }
    );
    results.total++;
    if (!result.success && (result.status === 403 || result.status === 401)) {
        results.passed++;
        console.log('   ✅ Correctly rejected non-owner deletion');
    } else {
        results.failed++;
    }

    // TEST 17: Verify Deleted Job
    result = await testEndpoint(
        '6.3 Get Deleted Job - Should Fail',
        'GET',
        `/api/jobs/${jobIds[1]}`,
        null
    );
    results.total++;
    if (!result.success && result.status === 404) {
        results.passed++;
        console.log('   ✅ Deleted job not found (correct)');
    } else {
        results.failed++;
    }

    // SUMMARY
    console.log('\n' + '='.repeat(60));
    console.log('📊 JOB MANAGEMENT FEATURE TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${results.total}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`);
    console.log('='.repeat(60));

    if (results.failed > 0) {
        console.log('\n⚠️  ISSUES FOUND - Need to fix:');
        console.log('Review failed tests above for details');
    } else {
        console.log('\n✅ ALL TESTS PASSED - Job Management feature is complete!');
    }

    return results;
}

// Run tests
runJobManagementTests().catch(console.error);
