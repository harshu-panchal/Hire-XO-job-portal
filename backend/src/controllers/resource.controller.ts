import { Request, Response, Router } from 'express';
import Investor from '../models/investor.model';
import Tender from '../models/tender.model';
import Equipment from '../models/equipment.model';
import Machinery from '../models/machinery.model';
import PMC from '../models/pmc.model';
import CSM from '../models/csm.model';
import Logistics from '../models/logistics.model';
import Vehicle from '../models/vehicle.model';
import { ResourceFactoryController } from './resource-factory.controller';

export const investorController = new ResourceFactoryController(Investor, 'Investor');
export const tenderController = new ResourceFactoryController(Tender, 'Tender');
export const equipmentController = new ResourceFactoryController(Equipment, 'Equipment');
export const machineryController = new ResourceFactoryController(Machinery, 'Machinery');
export const pmcController = new ResourceFactoryController(PMC, 'PMC');
export const csmController = new ResourceFactoryController(CSM, 'CSM');
export const logisticsController = new ResourceFactoryController(Logistics, 'Logistics');
export const vehicleController = new ResourceFactoryController(Vehicle, 'Vehicle');
