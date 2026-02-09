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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("./src/app"));
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("./src/config/database");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function runTest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Connecting to DB...");
            yield (0, database_1.connectDB)();
            console.log("Connected to DB.");
            const dummyLogoPath = path_1.default.join(__dirname, 'dummy-logo.png');
            if (!fs_1.default.existsSync(dummyLogoPath)) {
                fs_1.default.writeFileSync(dummyLogoPath, 'dummy content');
            }
            const username = 'testrecruiter_' + Date.now();
            const email = `testrecruiter_${Date.now()}@example.com`;
            console.log(`Testing signup for ${username} / ${email}...`);
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/auth/signup')
                .field('name', 'Test Recruiter')
                .field('username', username)
                .field('email', email)
                .field('password', 'password123')
                .field('role', 'employer')
                .field('phoneNumber', '1234567890')
                .field('company', 'Test Company Inc.')
                .field('experience', '5')
                .attach('companyLogo', dummyLogoPath);
            if (response.status === 201) {
                console.log('✅ Signup Successful!');
                console.log('User ID:', response.body.user.id);
                console.log('Recruiter Profile:', response.body.user.profile);
                // Verify username and company in profile
                const profile = response.body.user.profile;
                if (profile.getUsername === username || profile.username === username) {
                    console.log('✅ Username verified in profile.');
                }
                else {
                    console.log('❌ Username mismatch or missing in profile:', profile.username);
                }
                if (profile.company === 'Test Company Inc.') {
                    console.log('✅ Company verified in profile.');
                }
                else {
                    console.log('❌ Company mismatch in profile:', profile.company);
                }
            }
            else {
                console.error('❌ Signup Failed!');
                console.error('Status:', response.status);
                console.error('Body:', JSON.stringify(response.body, null, 2));
            }
        }
        catch (error) {
            console.error('Test Error:', error);
        }
        finally {
            yield mongoose_1.default.connection.close();
            if (fs_1.default.existsSync('dummy-logo.png')) {
                // fs.unlinkSync('dummy-logo.png');
            }
            process.exit(0);
        }
    });
}
runTest();
