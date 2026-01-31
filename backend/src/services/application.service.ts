import JobApplication from '../models/job-application.model';
import ResourceApplication from '../models/resource-application.model';
import Job from '../models/job.model';
import Investor from '../models/investor.model';
import Tender from '../models/tender.model';
import Equipment from '../models/equipment.model';
import Machinery from '../models/machinery.model';
import PMC from '../models/pmc.model';
import CSM from '../models/csm.model';
import Logistics from '../models/logistics.model';
import Vehicle from '../models/vehicle.model';

export class ApplicationService {
    // Apply to a job
    public async applyToJob(applicantId: string, jobId: string, message?: string) {
        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        // Check if user is applying to their own job
        if (job.userId.toString() === applicantId) {
            throw new Error('You cannot apply to your own job');
        }

        // Check if already applied
        const existingApplication = await JobApplication.findOne({ applicantId, jobId });
        if (existingApplication) {
            throw new Error('You have already applied to this job');
        }

        // Create application
        const application = await JobApplication.create({
            applicantId,
            jobId,
            message,
            status: 'Pending'
        });

        return application;
    }

    // Apply to a resource
    public async applyToResource(
        applicantId: string,
        resourceId: string,
        resourceType: string,
        message?: string
    ) {
        // Get the appropriate model
        const modelMap: any = {
            'Investor': Investor,
            'Tender': Tender,
            'Equipment': Equipment,
            'Machinery': Machinery,
            'PMC': PMC,
            'CSM': CSM,
            'Logistics': Logistics,
            'Vehicle': Vehicle
        };

        const ResourceModel = modelMap[resourceType];
        if (!ResourceModel) {
            throw new Error('Invalid resource type');
        }

        // Check if resource exists
        const resource = await ResourceModel.findById(resourceId);
        if (!resource) {
            throw new Error('Resource not found');
        }

        // Check if user is applying to their own resource
        if (resource.userId.toString() === applicantId) {
            throw new Error('You cannot apply to your own resource');
        }

        // Check if already applied
        const existingApplication = await ResourceApplication.findOne({
            applicantId,
            resourceId,
            resourceType
        });
        if (existingApplication) {
            throw new Error('You have already applied to this resource');
        }

        // Create application
        const application = await ResourceApplication.create({
            applicantId,
            resourceId,
            resourceType,
            message,
            status: 'Pending'
        });

        return application;
    }

    // Get user's applications
    public async getMyApplications(userId: string) {
        const jobApplications = await JobApplication.find({ applicantId: userId })
            .populate('jobId')
            .sort({ appliedAt: -1 });

        const resourceApplications = await ResourceApplication.find({ applicantId: userId })
            .sort({ appliedAt: -1 });

        return {
            jobs: jobApplications,
            resources: resourceApplications
        };
    }

    // Get applications for a specific job (for job owner)
    public async getJobApplications(jobId: string, ownerId: string) {
        // Verify ownership
        const job = await Job.findById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        if (job.userId.toString() !== ownerId) {
            throw new Error('You are not authorized to view these applications');
        }

        const applications = await JobApplication.find({ jobId })
            .populate('applicantId', 'name email phoneNumber')
            .sort({ appliedAt: -1 });

        return applications;
    }

    // Get applications for a specific resource (for resource owner)
    public async getResourceApplications(resourceId: string, resourceType: string, ownerId: string) {
        const modelMap: any = {
            'Investor': Investor,
            'Tender': Tender,
            'Equipment': Equipment,
            'Machinery': Machinery,
            'PMC': PMC,
            'CSM': CSM,
            'Logistics': Logistics,
            'Vehicle': Vehicle
        };

        const ResourceModel = modelMap[resourceType];
        if (!ResourceModel) {
            throw new Error('Invalid resource type');
        }

        // Verify ownership
        const resource = await ResourceModel.findById(resourceId);
        if (!resource) {
            throw new Error('Resource not found');
        }

        if (resource.userId.toString() !== ownerId) {
            throw new Error('You are not authorized to view these applications');
        }

        const applications = await ResourceApplication.find({ resourceId, resourceType })
            .populate('applicantId', 'name email phoneNumber')
            .sort({ appliedAt: -1 });

        return applications;
    }

    // Update application status
    public async updateApplicationStatus(
        applicationId: string,
        status: 'Accepted' | 'Rejected',
        userId: string,
        isJobApplication: boolean
    ) {
        if (isJobApplication) {
            const application = await JobApplication.findById(applicationId).populate('jobId');
            if (!application) {
                throw new Error('Application not found');
            }

            const job: any = application.jobId;
            if (job.userId.toString() !== userId) {
                throw new Error('You are not authorized to update this application');
            }

            application.status = status;
            await application.save();
            return application;
        } else {
            const application = await ResourceApplication.findById(applicationId);
            if (!application) {
                throw new Error('Application not found');
            }

            // Verify ownership through resource
            const modelMap: any = {
                'Investor': Investor,
                'Tender': Tender,
                'Equipment': Equipment,
                'Machinery': Machinery,
                'PMC': PMC,
                'CSM': CSM,
                'Logistics': Logistics,
                'Vehicle': Vehicle
            };

            const ResourceModel = modelMap[application.resourceType];
            const resource = await ResourceModel.findById(application.resourceId);

            if (!resource || resource.userId.toString() !== userId) {
                throw new Error('You are not authorized to update this application');
            }

            application.status = status;
            await application.save();
            return application;
        }
    }
}
