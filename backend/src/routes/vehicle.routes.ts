import { vehicleController } from '../controllers/resource.controller';
import { createResourceRouter } from './resource-router-factory';

export default createResourceRouter(vehicleController);
