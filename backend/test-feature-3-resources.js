// Feature 3: Resource Management - Complete Test Script

const BASE_URL = 'http://localhost:5000';

let tokens = {};
let resourceIds = {
    equipment: [],
    machinery: [],
    logistics: [],
    vehicle: [],
    tender: [],
    investor: [],
    pmc: [],
    csm: []
};

const testUsers = {
    user1: {
        name: 'Resource Provider 1',
        email: 'provider1.f3@test.com',
        password: 'Test123!',
        role: 'recruiter',
        company: 'Provider Corp 1',
        phoneNumber: '1111111111'
    },
    user2: {
        name: 'Resource Provider 2',
        email: 'provider2.f3@test.com',
        password: 'Test123!',
        role: 'recruiter',
        company: 'Provider Corp 2',
        phoneNumber: '2222222222'
    },
    jobSeeker: {
        name: 'John Seeker',
        email: 'seeker.f3@test.com',
        password: 'Test123!',
        role: 'job-seeker',
        phoneNumber: '3333333333'
    }
};

const testResources = {
    equipment: {
        title: 'Excavator for Rent',
        company: 'HeavyLift Co',
        location: 'Houston, TX',
        compensation: '$500/day',
        type: 'Rental',
        description: 'Well-maintained excavator available for rent',
        requirements: ['Insurance certificate required'],
        responsibilities: ['Standard operation'],
        benefits: ['Maintenance included'],
        category: 'Equipments',
        equipmentType: 'rent-out-equipment',
        urgency: 'Immediate'
    },
    machinery: {
        title: 'Industrial Generator',
        company: 'PowerGen Inc',
        location: 'Dallas, TX',
        compensation: '$200/day',
        type: 'Rental',
        description: '500kVA generator for construction sites',
        requirements: ['Fuel not included'],
        category: 'Machinery',
        machineryType: 'provide-machinery',
        urgency: 'Immediate'
    },
    logistics: {
        title: 'Flatbed Trucking Service',
        company: 'LogiTrans',
        location: 'Chicago, IL',
        compensation: '$2/mile',
        type: 'Service',
        description: 'Reliable flatbed logistics services',
        requirements: ['Minimum 100 miles'],
        category: 'Logistics',
        logisticsType: 'provide-logistics',
        serviceArea: 'Midwest',
        urgency: 'Within Week'
    },
    vehicle: {
        title: 'Cargo Van',
        company: 'CityMove',
        location: 'New York, NY',
        compensation: '$100/day',
        type: 'Rental',
        description: 'Large cargo van for local deliveries',
        category: 'Vehicles',
        vehicleType: 'rent-out-vehicles',
        urgency: 'Flexible'
    },
    tender: {
        title: 'Road Construction Project',
        company: 'Govt Works',
        location: 'Austin, TX',
        compensation: '$1M+',
        type: 'Tender',
        description: 'Public tender for highway expansion',
        requirements: ['Previous experience required'],
        category: 'Tenders',
        tenderType: 'apply-for-tenders',
        tenderValue: '$1,000,000',
        urgency: 'Within Week'
    },
    investor: {
        title: 'Tech Seed Funding',
        company: 'SeedVenture',
        location: 'San Francisco, CA',
        compensation: 'Equity',
        type: 'Investment',
        description: 'Looking to invest in AI startups',
        category: 'Investor',
        investorType: 'want-to-invest',
        investmentAmount: '$100k - $500k',
        urgency: 'Flexible'
    },
    pmc: {
        title: 'Project Management Consultant',
        company: 'BuildRight PMC',
        location: 'Denver, CO',
        compensation: 'Commission',
        type: 'Consultancy',
        description: 'Expert project management for skyscraper projects',
        category: 'PMC',
        pmcType: 'offer-pmc-services',
        projectExperience: 15,
        urgency: 'Immediate'
    },
    csm: {
        title: 'Coal Station Operator',
        company: 'SafeCoal',
        location: 'Virginia',
        compensation: 'Negotiable',
        type: 'Operator',
        description: 'Expert coal station management services',
        category: 'CSM',
        csmType: 'offer-csm-services',
        projectExperience: 10,
        urgency: 'Within Week'
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

async function runResourceTests() {
    console.log('='.repeat(60));
    console.log('🚀 FEATURE 3: RESOURCE MANAGEMENT - COMPLETE TEST');
    console.log('='.repeat(60));

    const results = { total: 0, passed: 0, failed: 0 };

    // 1. Setup Users
    console.log('\n📋 SETUP: Creating Test Users');
    for (const [key, userData] of Object.entries(testUsers)) {
        const result = await testEndpoint(`Setup - Create ${key}`, 'POST', '/api/auth/signup', userData);
        if (result.success) tokens[key] = result.data.token;
    }

    // 2. Test each resource type
    const resourceTypes = [
        { key: 'equipment', endpoint: '/api/equipments' },
        { key: 'machinery', endpoint: '/api/machinery' },
        { key: 'logistics', endpoint: '/api/logistics' },
        { key: 'vehicle', endpoint: '/api/vehicles' },
        { key: 'tender', endpoint: '/api/tenders' },
        { key: 'investor', endpoint: '/api/investors' },
        { key: 'pmc', endpoint: '/api/pmc' },
        { key: 'csm', endpoint: '/api/csm' }
    ];

    for (const resType of resourceTypes) {
        console.log(`\n📦 TESTING RESOURCE MODULE: ${resType.key.toUpperCase()}`);
        console.log('-'.repeat(60));

        // CREATE
        let result = await testEndpoint(
            `3.1 Create ${resType.key}`,
            'POST',
            resType.endpoint,
            testResources[resType.key],
            { 'Authorization': `Bearer ${tokens.user1}` }
        );
        results.total++;
        if (result.success) {
            results.passed++;
            const id = result.data.data?._id;
            if (id) resourceIds[resType.key].push(id);
        } else results.failed++;

        // GET ALL (Public)
        result = await testEndpoint(`3.2 Get All ${resType.key} (Public)`, 'GET', resType.endpoint, null);
        results.total++;
        if (result.success) results.passed++; else results.failed++;

        // GET BY ID
        if (resourceIds[resType.key][0]) {
            result = await testEndpoint(
                `3.3 Get ${resType.key} by ID`,
                'GET',
                `${resType.endpoint}/${resourceIds[resType.key][0]}`,
                null
            );
            results.total++;
            if (result.success) results.passed++; else results.failed++;
        }

        // UPDATE (Owner)
        if (resourceIds[resType.key][0]) {
            result = await testEndpoint(
                `3.4 Update ${resType.key} (Owner)`,
                'PUT',
                `${resType.endpoint}/${resourceIds[resType.key][0]}`,
                { title: `Updated ${testResources[resType.key].title}` },
                { 'Authorization': `Bearer ${tokens.user1}` }
            );
            results.total++;
            if (result.success) results.passed++; else results.failed++;
        }

        // UPDATE (Non-Owner - Should Fail)
        if (resourceIds[resType.key][0]) {
            result = await testEndpoint(
                `3.5 Update ${resType.key} (Non-Owner - Should Fail)`,
                'PUT',
                `${resType.endpoint}/${resourceIds[resType.key][0]}`,
                { title: 'Hacked Title' },
                { 'Authorization': `Bearer ${tokens.user2}` }
            );
            results.total++;
            if (!result.success && result.status === 403) results.passed++; else results.failed++;
        }

        // GET MY LISTINGS
        result = await testEndpoint(
            `3.6 Get My ${resType.key}`,
            'GET',
            `${resType.endpoint}/my-listings`,
            null,
            { 'Authorization': `Bearer ${tokens.user1}` }
        );
        results.total++;
        if (result.success && result.data.data?.length > 0) results.passed++; else results.failed++;

        // DELETE (Owner)
        if (resourceIds[resType.key][0]) {
            result = await testEndpoint(
                `3.7 Delete ${resType.key} (Owner)`,
                'DELETE',
                `${resType.endpoint}/${resourceIds[resType.key][0]}`,
                null,
                { 'Authorization': `Bearer ${tokens.user1}` }
            );
            results.total++;
            if (result.success) results.passed++; else results.failed++;
        }
    }

    // SUMMARY
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESOURCE MANAGEMENT FEATURE TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${results.total}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`);
    console.log('='.repeat(60));

    if (results.failed === 0) {
        console.log('\n✅ ALL TESTS PASSED - Resource Management feature is complete!');
    }
}

runResourceTests().catch(console.error);
