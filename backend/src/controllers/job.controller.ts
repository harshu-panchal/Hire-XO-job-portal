import { NextFunction, Request, Response } from 'express';
import Job, { IJob } from '../models/job.model';
import { ResourceFactoryController } from './resource-factory.controller';

class JobController extends ResourceFactoryController<IJob> {
    constructor() {
        super(Job, 'Job', ['companyLogo']);
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        // Custom Validation
        if (req.body.minSalary && req.body.maxSalary) {
            if (Number(req.body.minSalary) > Number(req.body.maxSalary)) {
                res.status(400).json({
                    success: false,
                    message: 'Minimum salary cannot be greater than maximum salary'
                });
                return;
            }
        }

        // Call super
        await super.create(req, res, next);
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        // Custom Validation
        if (req.body.minSalary && req.body.maxSalary) {
            if (Number(req.body.minSalary) > Number(req.body.maxSalary)) {
                res.status(400).json({
                    success: false,
                    message: 'Minimum salary cannot be greater than maximum salary'
                });
                return;
            }
        }

        // Call super
        await super.update(req, res, next);
    }
}

export const jobController = new JobController();
