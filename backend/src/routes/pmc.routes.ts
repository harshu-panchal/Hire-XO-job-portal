import { pmcController } from '../controllers/resource.controller';
import { createResourceRouter } from './resource-router-factory';

import { baseResourceSchema, updateResourceSchema } from '../validations/resource.validation';

export default createResourceRouter(pmcController, baseResourceSchema, updateResourceSchema);
