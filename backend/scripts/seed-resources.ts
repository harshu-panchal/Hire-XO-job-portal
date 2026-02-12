import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/user.model';
import ResourceProfile from '../src/models/resource-profile.model';
import { connectDB } from '../src/config/database';

dotenv.config();

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

const seedResourceUsers = async () => {
    try {
        await connectDB();
        console.log('Connected to database...');

        const password = 'Password@123';
        const hashedPassword = await bcrypt.hash(password, 10);

        for (const { category, typeField } of resourceCategories) {
            const email = `${category.toLowerCase()}@hirexo.com`;
            const name = `${category} Provider`;

            // Delete existing user for this email to re-seed accurately
            await User.deleteOne({ email });
            await ResourceProfile.deleteOne({ category: category });

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'resource',
                phoneNumber: '1234567890',
                status: 'active',
                walletBalance: 5000
            });

            await ResourceProfile.create({
                userId: newUser._id,
                organizationName: `${name} Ltd`,
                category: category,
                [typeField]: 'Standard Provider'
            });

            console.log(`Seeded user: ${email} (${category})`);
        }

        console.log('Resource users seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding resource users:', error);
        process.exit(1);
    }
};

seedResourceUsers();
