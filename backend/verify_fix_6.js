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
// @ts-nocheck
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const application_service_1 = require("./src/services/application.service");
const user_model_1 = __importDefault(require("./src/models/user.model"));
const tender_model_1 = __importDefault(require("./src/models/tender.model"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '.env') });
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hire-xo';
const runVerification = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        // Create Dummy User
        const user = yield user_model_1.default.create({
            name: 'Test Employer',
            email: `testemp_${Date.now()}@example.com`,
            password: 'password123',
            role: 'employer',
            username: `testemp_${Date.now()}`
        });
        console.log('Created User:', user._id);
        // Create Dummy Tender
        const tender = yield tender_model_1.default.create({
            userId: user._id,
            title: 'Test Tender',
            company: 'Test Co',
            location: 'Remote',
            compensation: '1000',
            type: 'Contract', // Required field
            description: 'Test Description',
            category: 'Tenders', // Plural in DB
            postedAt: new Date()
        });
        console.log('Created Tender:', tender._id);
        // Create Applicant
        const applicant = yield user_model_1.default.create({
            name: 'Test Applicant',
            email: `testapp_${Date.now()}@example.com`,
            password: 'password123',
            role: 'employee',
            username: `testapp_${Date.now()}`
        });
        // Test Application with "Tenders" (Plural)
        const appService = new application_service_1.ApplicationService();
        console.log('Attempting to apply with type "Tenders"...');
        try {
            yield appService.applyToResource(applicant._id.toString(), tender._id.toString(), 'Tenders', // PLURAL - This would fail before fix
            { message: 'Test Application' });
            console.log('SUCCESS: Application created with "Tenders"');
        }
        catch (error) {
            console.error('FAILURE: "Tenders" application failed:', error.message);
        }
        // Test Application with "Tender" (Singular) - Should also work
        console.log('Attempting to apply with type "Tender"...');
        try {
            // Need new applicant or it will fail with duplicate
            const applicant2 = yield user_model_1.default.create({
                name: 'Test Applicant 2',
                email: `testapp2_${Date.now()}@example.com`,
                password: 'password123',
                role: 'employee',
                username: `testapp2_${Date.now()}`
            });
            yield appService.applyToResource(applicant2._id.toString(), tender._id.toString(), 'Tender', // SINGULAR
            { message: 'Test Application 2' });
            console.log('SUCCESS: Application created with "Tender"');
        }
        catch (error) {
            console.error('FAILURE: "Tender" application failed:', error.message);
        }
        // Cleanup
        yield user_model_1.default.deleteMany({ email: { $in: [user.email, applicant.email] } });
        // Clean up tender...
        yield tender_model_1.default.findByIdAndDelete(tender._id);
        process.exit(0);
    }
    catch (error) {
        console.error('Script Error:', error);
        process.exit(1);
    }
});
runVerification();
