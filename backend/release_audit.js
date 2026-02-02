/**
 * RELEASE AUDIT SCRIPT v1.0
 * Rigidly validates Backend <-> Frontend Contract
 * No assumptions. Fail fast on contract violations.
 */

const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hire-xo';

// --- AUDIT CONFIG ---
const RESOURCE_CATEGORIES = [
    'investors', 'tenders', 'equipments', 'machinery',
    'pmc', 'csm', 'logistics', 'vehicles'
];

// --- LOGGING ---
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

let stats = {
    contractsVerified: 0,
    contractsViolated: 0,
    functionalPass: 0,
    functionalFail: 0,
    securityPass: 0,
    securityFail: 0
};

const log = (msg, type = 'info') => {
    console.log(`${colors.cyan}[AUDIT]${colors.reset} ${msg}`);
};

const pass = (msg, cat = 'func') => {
    console.log(`${colors.green}  ✓ PASS:${colors.reset} ${msg}`);
    if (cat === 'contract') stats.contractsVerified++;
    if (cat === 'func') stats.functionalPass++;
    if (cat === 'sec') stats.securityPass++;
};

const fail = (msg, err = '', cat = 'func') => {
    console.log(`${colors.red}  ✗ FAIL:${colors.reset} ${msg} ${err ? `[${err}]` : ''}`);
    if (cat === 'contract') stats.contractsViolated++;
    if (cat === 'func') stats.functionalFail++;
    if (cat === 'sec') stats.securityFail++;
};

// --- HTTP CLIENT ---
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const req = async (method, path, data, token, expectedStatus = 200, category = 'func') => {
    await sleep(200); // Small delay to avoid rate limiting
    try {
        const config = {
            method,
            url: `${BASE_URL}${path}`,
            data,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            validateStatus: () => true
        };
        const res = await axios(config);

        if (Array.isArray(expectedStatus) ? expectedStatus.includes(res.status) : res.status === expectedStatus) {
            pass(`${method} ${path} [${res.status}]`, category);
            return res.data;
        } else {
            fail(`${method} ${path} returned ${res.status}, expected ${expectedStatus}`, JSON.stringify(res.data), category);
            return null;
        }
    } catch (e) {
        fail(`Network Error ${method} ${path}`, e.message, category);
        return null;
    }
};

// --- AUDIT ROUTINES ---

async function auditAuthContract() {
    log('--- 1. Authentication Contract Audit ---');

    // 1.1 Signup Contracts
    let recToken, jsToken, adminToken;
    let recId, jsId, adminId;

    const mkEmail = (p) => `${p}_${Date.now()}@audit.com`;

    // Recruiter Signup
    const recData = await req('POST', '/api/auth/signup', {
        name: 'Audit Recruiter',
        email: mkEmail('rec'),
        password: 'Password123!',
        role: 'recruiter',
        company: 'AuditCorp'
    }, null, 201, 'contract');

    if (recData && recData.token) {
        recToken = recData.token;
        recId = recData.user.id || recData.user._id;
        pass('Recruiter Token Received', 'contract');
    }

    // Job Seeker Signup
    const jsData = await req('POST', '/api/auth/signup', {
        name: 'Audit Seeker',
        email: mkEmail('js'),
        password: 'Password123!',
        role: 'job-seeker'
    }, null, 201, 'contract');

    if (jsData && jsData.token) {
        jsToken = jsData.token;
        jsId = jsData.user.id || jsData.user._id;
        pass('Job Seeker Token Received', 'contract');
    }

    // Admin Setup (Hybrid: Signup + DB Injection)
    const adminEmail = mkEmail('admin');
    const adminInit = await req('POST', '/api/auth/signup', {
        name: 'Audit Admin',
        email: adminEmail,
        password: 'Password123!',
        role: 'job-seeker'
    }, null, 201, 'contract');

    if (adminInit) {
        // Upgrade Role directly
        await mongoose.connect(MONGO_URI);
        const User = mongoose.connection.collection('users');
        await User.updateOne(
            { email: adminEmail },
            { $set: { role: 'admin' } }
        );

        // Re-login to confirm Admin Contract
        const loginRes = await req('POST', '/api/auth/login', {
            email: adminEmail,
            password: 'Password123!'
        }, null, 200, 'contract');

        if (loginRes && loginRes.user.role === 'admin') {
            adminToken = loginRes.token;
            adminId = loginRes.user.id || loginRes.user._id;
            pass('Admin Login Verified & Role Confirmed', 'contract');
        } else {
            fail('Admin Upgrade Failed - Role not reflected in Login', '', 'contract');
        }
    }

    return { recToken, jsToken, adminToken, recId, jsId, adminId };
}

async function auditJobContract(recToken, jsToken) {
    log('--- 2. Job Market Contract Audit ---');
    if (!recToken || !jsToken) return fail('Skip Job Audit - Missing Tokens');

    // 2.1 Post Job (Recruiter)
    const jobPayload = {
        title: 'Audit Job',
        // company: 'AuditCorp', // Assuming backend pulls from profile or requires input
        requirements: ['Req1'],
        location: 'Remote',
        salary: '100k',
        type: 'Full-time',
        description: 'Audit Description',
        category: 'IT'
    };

    // Note: Some backends require 'company' in body, some infer. Let's send it to be safe.
    jobPayload.company = 'AuditCorp';

    const job = await req('POST', '/api/jobs', jobPayload, recToken, 201, 'contract');
    let jobId;
    if (job) jobId = job._id;

    // 2.2 Browse Jobs (Public/Seeker)
    await req('GET', '/api/jobs', null, null, 200, 'contract'); // Public access check

    // 2.3 Apply (Seeker)
    if (jobId) {
        await req('POST', '/api/applications', {
            jobId: jobId,
            coverLetter: 'Audit Apply'
        }, jsToken, 201, 'contract');
    }

    // 2.4 My Listings (Recruiter)
    const myListings = await req('GET', '/api/jobs/my-listings', null, recToken, 200, 'contract');
    // Check inside .data property if response is { data: [], pagination: {} }
    if (myListings && myListings.data && myListings.data.length > 0) pass('My Listings returned data', 'func');
    else if (Array.isArray(myListings) && myListings.length > 0) pass('My Listings returned data', 'func');
    else fail('My Listings empty after post', '', 'func');

    // 2.5 Job Applications (Recruiter)
    if (jobId) {
        await req('GET', `/api/applications/jobs/${jobId}/applications`, null, recToken, 200, 'contract');
    }
}

async function auditResourceContract(token) {
    log('--- 3. Resource Categories Contract Audit ---');
    if (!token) return fail('Skip Resource Audit - Missing Token');

    for (const cat of RESOURCE_CATEGORIES) {
        // 3.1 Post Resource
        const payload = {
            title: `Audit ${cat}`,
            description: 'Audit Desc',
            location: 'Remote',
            category: cat,
            type: 'Audit Type',
            company: 'AuditCorp',
            compensation: '$100k'
        };

        // Add specific fields to avoid validation errors if models are strict
        if (cat === 'investors') payload.investmentAmount = 1000;
        else payload.price = 100;

        const res = await req('POST', `/api/${cat}`, payload, token, 201, 'contract');

        // 3.2 List Resources
        await req('GET', `/api/${cat}`, null, null, 200, 'contract');

        // 3.3 My Listings
        await req('GET', `/api/${cat}/my-listings`, null, token, 200, 'contract');
    }
}

async function auditAdminContract(adminToken, recToken) {
    log('--- 4. Admin Module Contract Audit ---');
    if (!adminToken) return fail('Skip Admin Audit - Missing Admin Token');

    // 4.1 Stats
    await req('GET', '/api/admin/stats', null, adminToken, 200, 'contract');

    // 4.2 Security Check (Recruiter accessing stats)
    await req('GET', '/api/admin/stats', null, recToken, 403, 'sec');

    // 4.3 User Management
    const users = await req('GET', '/api/admin/users', null, adminToken, 200, 'contract');
    if (users && users.data && users.data.length > 0) pass('Admin Users List populated', 'func');

    // 4.4 Plans
    const plan = await req('POST', '/api/admin/plans', {
        name: `Audit Plan ${Date.now()}`,
        price: 10,
        durationDays: 30,
        description: 'Audit',
        features: ['A']
    }, adminToken, 201, 'contract');

    if (plan && plan.data && plan.data._id) {
        await req('DELETE', `/api/admin/plans/${plan.data._id}`, null, adminToken, 200, 'contract');
    }
}

async function auditCertContract(jsToken, adminToken) {
    log('--- 5. Certificate Workflow Audit ---');
    if (!jsToken || !adminToken) return fail('Skip Cert Audit - Missing Tokens');

    // 5.1 Upload/Create
    const cert = await req('POST', '/api/certificates', {
        name: 'Audit Cert',
        issueDate: new Date(),
        expiryDate: new Date(Date.now() + 86400000),
        successRate: 100
    }, jsToken, 201, 'contract');

    let certId = cert && cert.certificate ? cert.certificate._id : null;

    // 5.2 Admin Approve
    if (certId) {
        await req('PATCH', `/api/admin/certificates/${certId}/approve`, null, adminToken, 200, 'contract');
    }
}

async function startAudit() {
    try {
        log('Connecting to DB...');
        await mongoose.connect(MONGO_URI);

        const tokens = await auditAuthContract();

        await auditJobContract(tokens.recToken, tokens.jsToken);
        await auditResourceContract(tokens.recToken); // Using Recruiter as Resource User (valid in this system)
        await auditAdminContract(tokens.adminToken, tokens.recToken);
        await auditCertContract(tokens.jsToken, tokens.adminToken);

        log('\n=== AUDIT SUMMARY ===');
        console.table(stats);

        // Final Verdict Calculation
        const score = 100 - (stats.contractsViolated * 20) - (stats.functionalFail * 10) - (stats.securityFail * 25);
        console.log(`\nFINAL SCORE: ${Math.max(0, score)}/100`);

        if (stats.contractsViolated > 0 || stats.securityFail > 0) {
            console.log(`${colors.red}❌ VERDICT: NOT READY (BLOCK RELEASE)${colors.reset}`);
            process.exit(1);
        } else if (stats.functionalFail > 0) {
            console.log(`${colors.yellow}⚠️ VERDICT: READY WITH RISKS${colors.reset}`);
            process.exit(0);
        } else {
            console.log(`${colors.green}✅ VERDICT: FULLY PRODUCTION-READY${colors.reset}`);
            process.exit(0);
        }

    } catch (e) {
        log('CRITICAL AUDIT FAILURE', e);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

startAudit();
