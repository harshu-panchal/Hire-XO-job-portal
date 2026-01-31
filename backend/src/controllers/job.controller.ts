import Job from '../models/job.model';
import { ResourceFactoryController } from './resource-factory.controller';

export const jobController = new ResourceFactoryController(Job, 'Job');
