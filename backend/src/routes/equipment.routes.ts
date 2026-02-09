import { equipmentController } from '../controllers/resource.controller';
import { createResourceRouter } from './resource-router-factory';

import { baseResourceSchema, updateResourceSchema } from '../validations/resource.validation';

export default createResourceRouter(equipmentController, baseResourceSchema, updateResourceSchema);
