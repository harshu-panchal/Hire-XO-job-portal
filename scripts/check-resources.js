const mongoose = require('mongoose');
require('dotenv').config();

// Import models using require since it's a JS script
const Investor = require('../backend/src/models/investor.model').default;
const Tender = require('../backend/src/models/tender.model').default;
const Equipment = require('../backend/src/models/equipment.model').default;
const Machinery = require('../backend/src/models/machinery.model').default;
const PMC = require('../backend/src/models/pmc.model').default;
const CSM = require('../backend/src/models/csm.model').default;
const Logistics = require('../backend/src/models/logistics.model').default;
const Vehicle = require('../backend/src/models/vehicle.model').default;

async function checkResources() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
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

        process.exit(0);
    } catch (error) {
        console.error('Error checking resources:', error);
        process.exit(1);
    }
}

checkResources();
