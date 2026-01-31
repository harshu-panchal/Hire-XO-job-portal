// Feature 1: Authentication System - Complete Test Script

const BASE_URL = 'http://localhost:5000';

// Test data
const testUsers = {
    jobSeeker: {
        name: 'John Doe',
        email: 'john.jobseeker@test.com',
        password: 'Test123!',
        role: 'job-seeker',
        phoneNumber: '1234567890',
        education: 'Bachelor of Science',
        age: 25,
        experience: 2,
        interestedCompanies: ['Google', 'Microsoft']
    },
    recruiter: {
        name: 'Jane Recruiter',
        email: 'jane.recruiter@test.com',
        password: 'Test123!',
        role: 'recruiter',
        phoneNumber: '0987654321',
        company: 'TechCorp',
        experience: 5
    },
    resource: {
        name: 'Bob Resource',
        email: 'bob.resource@test.com',
        password: 'Test123!',
        role: 'resource',
        phoneNumber: '5555555555',
        organizationName: 'BuildCo',
        category: 'Investor'
    }
};

let tokens = {};
let userIds = {};

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
            console.log(`   Response:`, JSON.stringify(data, null, 2).substring(0, 200));
            return { success: true, data, status: response.status };
        } else {
            console.log(`❌ FAIL: ${name}`);
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

async function runAuthenticationTests() {
    console.log('='.repeat(60));
    console.log('🚀 FEATURE 1: AUTHENTICATION SYSTEM - COMPLETE TEST');
    console.log('='.repeat(60));

    const results = {
        total: 0,
        passed: 0,
        failed: 0
    };

    // TEST 1: Signup - Job Seeker
    console.log('\n📋 TEST SUITE 1: USER SIGNUP');
    console.log('-'.repeat(60));

    let result = await testEndpoint(
        '1.1 Signup - Job Seeker',
        'POST',
        '/api/auth/signup',
        testUsers.jobSeeker
    );
    results.total++;
    if (result.success) {
        results.passed++;
        tokens.jobSeeker = result.data.token;
        userIds.jobSeeker = result.data.user?.id || result.data.user?._id;
        console.log(`   Token saved: ${tokens.jobSeeker?.substring(0, 20)}...`);
    } else {
        results.failed++;
    }

    // TEST 2: Signup - Recruiter
    result = await testEndpoint(
        '1.2 Signup - Recruiter',
        'POST',
        '/api/auth/signup',
        testUsers.recruiter
    );
    results.total++;
    if (result.success) {
        results.passed++;
        tokens.recruiter = result.data.token;
        userIds.recruiter = result.data.user?.id || result.data.user?._id;
    } else {
        results.failed++;
    }

    // TEST 3: Signup - Resource Provider
    result = await testEndpoint(
        '1.3 Signup - Resource Provider',
        'POST',
        '/api/auth/signup',
        testUsers.resource
    );
    results.total++;
    if (result.success) {
        results.passed++;
        tokens.resource = result.data.token;
        userIds.resource = result.data.user?.id || result.data.user?._id;
    } else {
        results.failed++;
    }

    // TEST 4: Duplicate Signup Prevention
    result = await testEndpoint(
        '1.4 Duplicate Signup Prevention',
        'POST',
        '/api/auth/signup',
        testUsers.jobSeeker
    );
    results.total++;
    if (!result.success && result.status === 400) {
        results.passed++;
        console.log('   ✅ Correctly prevented duplicate signup');
    } else {
        results.failed++;
        console.log('   ❌ Should have prevented duplicate signup');
    }

    // TEST 5: Login - Correct Credentials
    console.log('\n📋 TEST SUITE 2: USER LOGIN');
    console.log('-'.repeat(60));

    result = await testEndpoint(
        '2.1 Login - Correct Credentials',
        'POST',
        '/api/auth/login',
        {
            email: testUsers.jobSeeker.email,
            password: testUsers.jobSeeker.password
        }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        console.log('   ✅ Login successful, token received');
    } else {
        results.failed++;
    }

    // TEST 6: Login - Wrong Password
    result = await testEndpoint(
        '2.2 Login - Wrong Password',
        'POST',
        '/api/auth/login',
        {
            email: testUsers.jobSeeker.email,
            password: 'WrongPassword123!'
        }
    );
    results.total++;
    if (!result.success && result.status === 401) {
        results.passed++;
        console.log('   ✅ Correctly rejected wrong password');
    } else {
        results.failed++;
    }

    // TEST 7: Login - Non-existent User
    result = await testEndpoint(
        '2.3 Login - Non-existent User',
        'POST',
        '/api/auth/login',
        {
            email: 'nonexistent@test.com',
            password: 'Test123!'
        }
    );
    results.total++;
    if (!result.success && result.status === 401) {
        results.passed++;
        console.log('   ✅ Correctly rejected non-existent user');
    } else {
        results.failed++;
    }

    // TEST 8: Get Current User - With Token
    console.log('\n📋 TEST SUITE 3: PROTECTED ROUTES');
    console.log('-'.repeat(60));

    result = await testEndpoint(
        '3.1 Get Current User - With Valid Token',
        'GET',
        '/api/auth/me',
        null,
        { 'Authorization': `Bearer ${tokens.jobSeeker}` }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        console.log('   ✅ Successfully retrieved user profile');
        console.log(`   User: ${result.data.name} (${result.data.role})`);
    } else {
        results.failed++;
    }

    // TEST 9: Get Current User - Without Token
    result = await testEndpoint(
        '3.2 Get Current User - Without Token',
        'GET',
        '/api/auth/me',
        null
    );
    results.total++;
    if (!result.success && result.status === 401) {
        results.passed++;
        console.log('   ✅ Correctly rejected request without token');
    } else {
        results.failed++;
    }

    // TEST 10: Get Current User - Invalid Token
    result = await testEndpoint(
        '3.3 Get Current User - Invalid Token',
        'GET',
        '/api/auth/me',
        null,
        { 'Authorization': 'Bearer invalid_token_here' }
    );
    results.total++;
    if (!result.success && (result.status === 401 || result.status === 403)) {
        results.passed++;
        console.log('   ✅ Correctly rejected invalid token');
    } else {
        results.failed++;
    }

    // TEST 11: Update Profile
    console.log('\n📋 TEST SUITE 4: PROFILE MANAGEMENT');
    console.log('-'.repeat(60));

    result = await testEndpoint(
        '4.1 Update Profile - Valid Data',
        'PUT',
        '/api/auth/profile',
        {
            name: 'John Updated Doe',
            phoneNumber: '9999999999'
        },
        { 'Authorization': `Bearer ${tokens.jobSeeker}` }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        console.log('   ✅ Profile updated successfully');
    } else {
        results.failed++;
    }

    // TEST 12: Update Profile - Without Token
    result = await testEndpoint(
        '4.2 Update Profile - Without Token',
        'PUT',
        '/api/auth/profile',
        { name: 'Should Fail' }
    );
    results.total++;
    if (!result.success && result.status === 401) {
        results.passed++;
        console.log('   ✅ Correctly rejected update without token');
    } else {
        results.failed++;
    }

    // TEST 13: Change Password - Correct Old Password
    result = await testEndpoint(
        '4.3 Change Password - Correct Old Password',
        'PUT',
        '/api/auth/password',
        {
            oldPassword: testUsers.jobSeeker.password,
            newPassword: 'NewTest123!'
        },
        { 'Authorization': `Bearer ${tokens.jobSeeker}` }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        console.log('   ✅ Password changed successfully');
        // Update password for future tests
        testUsers.jobSeeker.password = 'NewTest123!';
    } else {
        results.failed++;
    }

    // TEST 14: Change Password - Wrong Old Password
    result = await testEndpoint(
        '4.4 Change Password - Wrong Old Password',
        'PUT',
        '/api/auth/password',
        {
            oldPassword: 'WrongOldPassword',
            newPassword: 'NewTest123!'
        },
        { 'Authorization': `Bearer ${tokens.jobSeeker}` }
    );
    results.total++;
    if (!result.success && result.status === 400) {
        results.passed++;
        console.log('   ✅ Correctly rejected wrong old password');
    } else {
        results.failed++;
    }

    // TEST 15: Login with New Password
    result = await testEndpoint(
        '4.5 Login with New Password',
        'POST',
        '/api/auth/login',
        {
            email: testUsers.jobSeeker.email,
            password: testUsers.jobSeeker.password
        }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        console.log('   ✅ Login successful with new password');
    } else {
        results.failed++;
    }

    // TEST 16: Logout
    result = await testEndpoint(
        '4.6 Logout',
        'POST',
        '/api/auth/logout',
        null,
        { 'Authorization': `Bearer ${tokens.jobSeeker}` }
    );
    results.total++;
    if (result.success) {
        results.passed++;
        console.log('   ✅ Logout successful');
    } else {
        results.failed++;
    }

    // SUMMARY
    console.log('\n' + '='.repeat(60));
    console.log('📊 AUTHENTICATION FEATURE TEST SUMMARY');
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
        console.log('\n✅ ALL TESTS PASSED - Authentication feature is complete!');
    }

    return results;
}

// Run tests
runAuthenticationTests().catch(console.error);
