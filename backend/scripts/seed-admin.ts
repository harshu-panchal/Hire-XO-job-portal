import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/user.model';
import { connectDB } from '../src/config/database';

dotenv.config();

const seedAdminUser = async () => {
    try {
        await connectDB();
        console.log('Connected to database...');

        const email = 'admin@gmail.com';
        const password = '123456';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log(`Admin user ${email} already exists. Updating password...`);
            await User.updateOne({ email }, { password: hashedPassword, role: 'admin' });
        } else {
            await User.create({
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
    } catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdminUser();
