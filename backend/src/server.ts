import { config } from './config/env.config';
import app from './app';
import { connectDB } from './config/database';
// import { seedPlans } from './utils/seed';

const PORT = config.PORT;

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Seed initial data
        // await seedPlans();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Server started
startServer();



