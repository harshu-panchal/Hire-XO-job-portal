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
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../src/models/user.model"));
const database_1 = require("../src/config/database");
dotenv_1.default.config();
const seedAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectDB)();
        console.log('Connected to database...');
        const email = 'admin@gmail.com';
        const password = '123456';
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Check if admin already exists
        const existingAdmin = yield user_model_1.default.findOne({ email });
        if (existingAdmin) {
            console.log(`Admin user ${email} already exists. Updating password...`);
            yield user_model_1.default.updateOne({ email }, { password: hashedPassword, role: 'admin' });
        }
        else {
            yield user_model_1.default.create({
                name: 'System Admin',
                email,
                password: hashedPassword,
                role: 'admin',
                status: 'active'
            });
            console.log(`Admin user created: ${email}`);
        }
        console.log('Admin seeding completed!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
});
seedAdminUser();
