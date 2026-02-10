import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from current directory or parent
dotenv.config({ path: path.join(__dirname, '../.env') });

import Investor from '../src/models/investor.model';
import Tender from '../src/models/tender.model';
import Equipment from '../src/models/equipment.model';
import Machinery from '../src/models/machinery.model';
import PMC from '../src/models/pmc.model';
import CSM from '../src/models/csm.model';
import Logistics from '../src/models/logistics.model';
import Vehicle from '../src/models/vehicle.model';

async function checkResources() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI not found in environment');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const counts = {
            investors: await Investor.countDocuments(),
            tenders: await Tender.countDocuments(),
            equipments: await Equipment.countDocuments(),
            machinery: await Machinery.countDocuments(),
            pmc: await PMC.countDocuments(),
            csm: await CSM.countDocuments(),
            logistics: await Logistics.countDocuments(),
            vehicles: await Vehicle.countDocuments(),
        };

        console.log('Resource Counts:');
        console.table(counts);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error checking resources:', error);
        process.exit(1);
    }
}

checkResources();
