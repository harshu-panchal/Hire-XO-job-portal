"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const user_model_1 = __importDefault(require("./src/models/user.model"));
const job_model_1 = __importDefault(require("./src/models/job.model"));
const post_model_1 = __importDefault(require("./src/models/post.model"));
const interview_service_1 = require("./src/services/interview.service");
const promotion_service_1 = require("./src/services/promotion.service");
// Load environment variables
dotenv_1.default.config({ path: path_1.default.join(__dirname, '.env') });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hire-xo';
function verifyFix11() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('--- Verifying Fix 11: Ownership Validation ---');
        try {
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log('Connected to MongoDB');
            // Setup Test Data
            // User A (Employer)
            let userA = yield user_model_1.default.findOne({ email: 'employer_a@test.com' });
            if (!userA) {
                userA = yield user_model_1.default.create({
                    name: 'Employer A',
                    email: 'employer_a@test.com',
                    password: 'password123',
                    role: 'employer'
                });
            }
            // User B (Employer)
            let userB = yield user_model_1.default.findOne({ email: 'employer_b@test.com' });
            if (!userB) {
                userB = yield user_model_1.default.create({
                    name: 'Employer B',
                    email: 'employer_b@test.com',
                    password: 'password123',
                    role: 'employer'
                });
            }
            // User C (Employee/Applicant)
            let userC = yield user_model_1.default.findOne({ email: 'employee_c@test.com' });
            if (!userC) {
                userC = yield user_model_1.default.create({
                    name: 'Employee C',
                    email: 'employee_c@test.com',
                    password: 'password123',
                    role: 'employee'
                });
            }
            // Job by User A
            const jobA = yield job_model_1.default.create({
                userId: userA._id,
                title: 'Job A',
                company: 'Company A',
                location: 'Remote',
                type: 'Full-time',
                description: 'Test Job A',
                category: 'IT'
            });
            // Post by User A
            const postA = yield post_model_1.default.create({
                userId: userA._id,
                content: 'Post by A'
            });
            const interviewService = new interview_service_1.InterviewService();
            const promotionService = new promotion_service_1.PromotionService();
            // TEST 1: User B tries to interview for Job A (Should Fail)
            console.log('\nTest 1: User B creating interview for Job A (Owned by A)...');
            try {
                yield interviewService.createInterview({
                    employerId: userB._id.toString(),
                    applicantId: userC._id.toString(),
                    applicationType: 'JobApplication', // Mock
                    applicationId: new mongoose_1.default.Types.ObjectId(), // Mock
                    jobId: jobA._id.toString(),
                    title: 'Unauthorized Interview',
                    date: new Date(),
                    time: '10:00 AM'
                });
                console.error('FAILED: User B was able to create interview for Job A!');
            }
            catch (error) {
                if (error.message.includes('own jobs')) {
                    console.log('PASSED: Caught expected error:', error.message);
                }
                else {
                    console.error('FAILED: Caught unexpected error:', error.message);
                }
            }
            // TEST 2: User A creates interview for Job A (Should Pass)
            console.log('\nTest 2: User A creating interview for Job A...');
            try {
                yield interviewService.createInterview({
                    employerId: userA._id.toString(),
                    applicantId: userC._id.toString(),
                    applicationType: 'JobApplication', // Mock
                    applicationId: new mongoose_1.default.Types.ObjectId(), // Mock
                    jobId: jobA._id.toString(),
                    title: 'Authorized Interview',
                    date: new Date(),
                    time: '10:00 AM'
                });
                console.log('PASSED: Interview created successfully.');
            }
            catch (error) {
                console.error('FAILED: User A could not create interview:', error.message);
            }
            // TEST 3: User B tries to promote Post A (Should Fail)
            console.log('\nTest 3: User B promoting Post A (Owned by A)...');
            try {
                yield promotionService.createPromotion(userB._id.toString(), postA._id.toString(), 'Post', 100);
                console.error('FAILED: User B was able to promote Post A!');
            }
            catch (error) {
                if (error.message.includes('own posts')) {
                    console.log('PASSED: Caught expected error:', error.message);
                }
                else {
                    console.error('FAILED: Caught unexpected error:', error.message);
                }
            }
            // TEST 4: User A promotes Job A (Should Pass)
            console.log('\nTest 4: User A promoting Job A...');
            try {
                yield promotionService.createPromotion(userA._id.toString(), jobA._id.toString(), 'Job', 100);
                console.log('PASSED: Promotion created successfully.');
            }
            catch (error) {
                console.error('FAILED: User A could not promote Job A:', error.message);
            }
            // Cleanup
            yield job_model_1.default.findByIdAndDelete(jobA._id);
            yield post_model_1.default.findByIdAndDelete(postA._id);
            // Keeping users for future tests or manual cleanup
        }
        catch (error) {
            console.error('Verification Script Error:', error);
        }
        finally {
            yield mongoose_1.default.disconnect();
            console.log('\nVerification Complete.');
        }
    });
}
verifyFix11();
