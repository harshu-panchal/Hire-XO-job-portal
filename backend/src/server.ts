import dotenv from 'dotenv';
dotenv.config(); // Load .env FIRST before any other imports

if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    process.exit(1);
}

import app from './app';
import { connectDB } from './config/database';
import { seedPlans } from './utils/seed';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Seed initial data
        await seedPlans();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Server started
startServer();



