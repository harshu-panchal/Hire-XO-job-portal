// Feature 5: Subscription & Wallet - Complete Test Script

const BASE_URL = 'http://localhost:5000';

let token = null;
let userData = null;
let plans = [];

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

async function runSubscriptionTests() {
    console.log('='.repeat(60));
    console.log('🚀 FEATURE 5: SUBSCRIPTION & WALLET - COMPLETE TEST');
    console.log('='.repeat(60));

    const results = { total: 0, passed: 0, failed: 0 };

    // 1. Setup User
    console.log('\n📋 SETUP: Creating Test User');
    const signupResult = await testEndpoint(
        'Setup - Create User',
        'POST',
        '/api/auth/signup',
        {
            name: 'Wallet User',
            email: 'wallet.user.f5@test.com',
            password: 'Test123!',
            role: 'recruiter',
            company: 'WalletCorp',
            phoneNumber: '9999999999'
        }
    );
    if (signupResult.success) {
        token = signupResult.data.token;
        userData = signupResult.data.user;
    } else {
        console.log('❌ FATAL: Signup failed');
        return;
    }

    // 2. Get Plans
    console.log('\n📋 TEST SUITE 5.1: SUBSCRIPTION PLANS');
    console.log('-'.repeat(60));

    let result = await testEndpoint('5.1.1 Get All Plans', 'GET', '/api/subscriptions/plans', null);
    results.total++;
    if (result.success && result.data.length > 0) {
        results.passed++;
        plans = result.data;
        console.log(`   ✅ Found ${plans.length} plans`);
    } else {
        results.failed++;
        console.log('   ❌ No plans found. Did you run seed-plans.js?');
        return;
    }

    // 3. Wallet Operations
    console.log('\n📋 TEST SUITE 5.2: WALLET OPERATIONS');
    console.log('-'.repeat(60));

    // Get Balance
    result = await testEndpoint(
        '5.2.1 Get Initial Balance',
        'GET',
        '/api/subscriptions/wallet/balance',
        null,
        { 'Authorization': `Bearer ${token}` }
    );
    results.total++;
    if (result.success && result.data.balance === 0) results.passed++; else results.failed++;

    // Recharge
    result = await testEndpoint(
        '5.2.2 Recharge Wallet',
        'POST',
        '/api/subscriptions/wallet/recharge',
        { amount: 500 },
        { 'Authorization': `Bearer ${token}` }
    );
    results.total++;
    if (result.success && result.data.newBalance === 500) results.passed++; else results.failed++;

    // 4. Purchase Subscription
    console.log('\n📋 TEST SUITE 5.3: SUBSCRIPTION PURCHASE');
    console.log('-'.repeat(60));

    // Purchase (Insufficient Balance)
    const expensivePlan = plans.find(p => p.price > 500);
    if (expensivePlan) {
        result = await testEndpoint(
            '5.3.1 Purchase Expensive Plan (Should Fail)',
            'POST',
            '/api/subscriptions/purchase',
            { planId: expensivePlan._id },
            { 'Authorization': `Bearer ${token}` }
        );
        results.total++;
        if (!result.success && result.status === 400) results.passed++; else results.failed++;
    }

    // Purchase (Successful)
    const cheapPlan = plans.find(p => p.price <= 500);
    result = await testEndpoint(
        '5.3.2 Purchase Basic Plan',
        'POST',
        '/api/subscriptions/purchase',
        { planId: cheapPlan._id },
        { 'Authorization': `Bearer ${token}` }
    );
    results.total++;
    if (result.success && result.data.walletBalance === 500 - cheapPlan.price) results.passed++; else results.failed++;

    // 5. Check Status
    console.log('\n📋 TEST SUITE 5.4: SUBSCRIPTION STATUS');
    console.log('-'.repeat(60));

    result = await testEndpoint(
        '5.4.1 Check Subscription Status',
        'GET',
        '/api/subscriptions/status',
        null,
        { 'Authorization': `Bearer ${token}` }
    );
    results.total++;
    if (result.success && result.data.isActive === true) results.passed++; else results.failed++;


    // SUMMARY
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUBSCRIPTION & WALLET FEATURE TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${results.total}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`);
    console.log('='.repeat(60));
}

runSubscriptionTests().catch(console.error);
