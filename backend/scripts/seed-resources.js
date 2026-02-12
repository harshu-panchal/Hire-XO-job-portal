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
const resource_profile_model_1 = __importDefault(require("../src/models/resource-profile.model"));
const database_1 = require("../src/config/database");
dotenv_1.default.config();
const resourceCategories = [
    { category: 'Investor', typeField: 'investorType' },
    { category: 'Tenders', typeField: 'tenderType' },
    { category: 'Equipments', typeField: 'equipmentType' },
    { category: 'Machinery', typeField: 'machineryType' },
    { category: 'PMC', typeField: 'pmcType' },
    { category: 'CSM', typeField: 'csmType' },
    { category: 'Logistics', typeField: 'logisticsType' },
    { category: 'Vehicles', typeField: 'vehicleType' }
];
const seedResourceUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectDB)();
        console.log('Connected to database...');
        const password = 'Password@123';
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        for (const { category, typeField } of resourceCategories) {
            const email = `${category.toLowerCase()}@hirexo.com`;
            const name = `${category} Provider`;
            // Delete existing user for this email to re-seed accurately
            yield user_model_1.default.deleteOne({ email });
            yield resource_profile_model_1.default.deleteOne({ category: category });
            const newUser = yield user_model_1.default.create({
                name,
                email,
                password: hashedPassword,
                role: 'resource',
                phoneNumber: '1234567890',
                status: 'active',
                walletBalance: 5000
            });
            yield resource_profile_model_1.default.create({
                userId: newUser._id,
                organizationName: `${name} Ltd`,
                category: category,
                [typeField]: 'Standard Provider'
            });
            console.log(`Seeded user: ${email} (${category})`);
        }
        console.log('Resource users seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding resource users:', error);
        process.exit(1);
    }
});
seedResourceUsers();
