// Clean test database before running tests
require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hire-xo';

async function cleanDatabase() {
    console.log('🧹 Cleaning database...');
    console.log(`   URI: ${MONGO_URI.substring(0, 40)}...`);

    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        console.log('   ✅ Connected to database');

        const db = client.db();

        // Drop all collections
        const collections = await db.listCollections().toArray();

        for (const collection of collections) {
            await db.collection(collection.name).deleteMany({});
            console.log(`   ✅ Cleared: ${collection.name}`);
        }

        console.log('✅ Database cleaned successfully!\n');
    } catch (error) {
        console.error('❌ Error cleaning database:', error.message);
    } finally {
        await client.close();
    }
}

cleanDatabase();
