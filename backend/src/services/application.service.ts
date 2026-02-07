import JobApplication from '../models/job-application.model';
import Notification from '../models/notification.model';
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
import User from '../models/user.model';
import { notificationEmitter } from '../utils/notificationEmitter';


export class ApplicationService {
    // Apply to a job
    public async applyToJob(
        applicantId: string,
        jobId: string,
        data: {
            message?: string;
            resume?: string;
            additionalDocuments?: string[];
        }
    ) {
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
            message: data.message,
            resume: data.resume,
            additionalDocuments: data.additionalDocuments,
            status: 'Pending'
        });

        // Notify Job Owner (Employer)
        try {
            const applicant = await User.findById(applicantId);
            const applicantName = applicant ? applicant.name : 'A candidate';

            const notification = await Notification.create({
                userId: job.userId,
                title: 'New Job Application',
                message: `${applicantName} has applied for ${job.title}`,
                type: 'info',
                relatedId: application._id.toString(),
                relatedType: 'job_application'
            });
            notificationEmitter.emit('new_notification', { userId: job.userId, notification });
        } catch (error) {
            console.error('Failed to create notification for job owner', error);
        }

        return application;
    }

    // Apply to a resource
    public async applyToResource(
        applicantId: string,
        resourceId: string,
        resourceType: string,
        data: {
            message?: string;
            bidAmount?: number;
            coverLetter?: string;
        }
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
            message: data.message,
            bidAmount: data.bidAmount,
            coverLetter: data.coverLetter,
            status: 'Pending'
        });

        // Notify Resource Owner
        try {
            const applicant = await User.findById(applicantId);
            const applicantName = applicant ? applicant.name : 'A candidate';

            const notification = await Notification.create({
                userId: resource.userId,
                title: 'New Resource Application',
                message: `${applicantName} has applied for your ${resourceType}`,
                type: 'info',
                relatedId: application._id.toString(),
                relatedType: 'resource_application'
            });
            notificationEmitter.emit('new_notification', { userId: resource.userId, notification });
        } catch (error) {
            console.error('Failed to create notification for resource owner', error);
        }

        return application;
    }

    // Get user's applications
    public async getMyApplications(userId: string) {
        const jobApplications = await JobApplication.find({ applicantId: userId })
            .populate('jobId')
            .sort({ appliedAt: -1 });

        const resourceApplications = await ResourceApplication.find({ applicantId: userId })
            .populate('resourceId')
            .sort({ appliedAt: -1 });

        return {
            jobs: jobApplications,
            resources: resourceApplications
        };
    }

    // Get applications for a specific job (for job owner)
    public async getJobApplications(jobId: string, ownerId: string) {
        // Check subscription status
        const isSubscribed = await this.checkUserSubscription(ownerId);

        // Verify ownership
        const job = await Job.findById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        if (job.userId.toString() !== ownerId) {
            throw new Error('You are not authorized to view these applications');
        }

        const applications = await JobApplication.find({ jobId })
            .populate('applicantId', 'name email phoneNumber profilePhoto profile')
            .sort({ appliedAt: -1 })
            .lean();

        if (!isSubscribed) {
            return applications.map(app => this.maskApplicationData(app));
        }

        return applications;
    }

    // Get all applications received for jobs posted by the user (Recruiter Dashboard)
    public async getReceivedApplications(userId: string) {
        // Check subscription status
        const isSubscribed = await this.checkUserSubscription(userId);

        // Find all jobs posted by the user
        const jobs = await Job.find({ userId });
        const jobIds = jobs.map(job => job._id);

        // Find applications for these jobs
        const applications = await JobApplication.find({ jobId: { $in: jobIds } })
            .populate('applicantId', 'name email phoneNumber profilePhoto profile')
            .populate('jobId', 'title')
            .sort({ appliedAt: -1 })
            .lean();

        if (!isSubscribed) {
            return applications.map(app => this.maskApplicationData(app));
        }

        return applications;
    }

    // Get all applications received for resources posted by the user
    public async getReceivedResourceApplications(userId: string, category: string) {
        // Map category to model
        const modelMap: any = {
            'investor': Investor,
            'tenders': Tender,
            'equipments': Equipment,
            'machinery': Machinery,
            'pmc': PMC,
            'csm': CSM,
            'logistics': Logistics,
            'vehicles': Vehicle
        };

        // Handle case sensitivity or mapping differences if any
        // Assuming category matches keys (lowercased or capitalized properly)
        // The ResourceProfile category is usually lowercase (e.g. "investor").
        // The modelMap keys above are capitalized. Adjusting.

        const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        // Special case for plurals/singulars if needed. 
        // In AuthController/Service, 'investor' matches schema.
        // Let's assume the mapping needs to be robust.

        // Better map:
        const refinedMap: any = {
            'investor': Investor,
            'investors': Investor,
            'tender': Tender,
            'tenders': Tender,
            'equipment': Equipment,
            'equipments': Equipment,
            'machinery': Machinery,
            'pmc': PMC,
            'csm': CSM,
            'logistics': Logistics,
            'vehicle': Vehicle,
            'vehicles': Vehicle
        };

        const ResourceModel = refinedMap[category.toLowerCase()];

        if (!ResourceModel) {
            // If no specific category logic or mixed, return empty or throw
            // For now, return empty if category unknown
            return [];
        }

        // Find all resources posted by the user
        const resources = await ResourceModel.find({ userId });
        const resourceIds = resources.map((r: any) => r._id);

        // Check subscription status
        const isSubscribed = await this.checkUserSubscription(userId);

        // Find applications for these resources
        const applications = await ResourceApplication.find({ resourceId: { $in: resourceIds } })
            .populate('applicantId', 'name email phoneNumber profilePhoto profile')
            .populate('resourceId')
            .sort({ appliedAt: -1 })
            .lean();

        if (!isSubscribed) {
            return applications.map(app => this.maskApplicationData(app));
        }

        return applications;
    }

    // Get applications for a specific resource (for resource owner)
    public async getResourceApplications(resourceId: string, resourceType: string, ownerId: string) {
        // Check subscription status
        const isSubscribed = await this.checkUserSubscription(ownerId);

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
            .populate('applicantId', 'name email phoneNumber profilePhoto profile')
            .sort({ appliedAt: -1 })
            .lean();

        if (!isSubscribed) {
            return applications.map(app => this.maskApplicationData(app));
        }

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

            // Create Notification
            const title = status === 'Accepted' ? 'Application Shortlisted' : 'Application Update';
            const message = status === 'Accepted'
                ? `You are shortlisted for ${job.title}. Our team will contact you soon.`
                : `Thank you for your interest in ${job.title}. Unfortunately, your application was not selected at this time.`;

            const notification = await Notification.create({
                userId: application.applicantId,
                title,
                message,
                type: status === 'Accepted' ? 'success' : 'info',
                relatedId: application._id.toString(),
                relatedType: 'job_application'
            });
            notificationEmitter.emit('new_notification', { userId: application.applicantId, notification });

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

            // Create Notification
            const title = status === 'Accepted' ? 'Application Shortlisted' : 'Application Update';
            const message = status === 'Accepted'
                ? `You are shortlisted for the ${application.resourceType} position. Our team will contact you soon.`
                : `Thank you for your interest in the ${application.resourceType} position. Unfortunately, your application was not selected at this time.`;

            const notification = await Notification.create({
                userId: application.applicantId,
                title,
                message,
                type: status === 'Accepted' ? 'success' : 'info',
                relatedId: application._id.toString(),
                relatedType: 'resource_application'
            });
            notificationEmitter.emit('new_notification', { userId: application.applicantId, notification });

            return application;
        }
    }

    // Helper to mask application data for unsubscribed users
    private maskApplicationData(application: any) {
        if (application.applicantId && typeof application.applicantId === 'object') {
            const applicant = application.applicantId;

            // Mask email (show first 3 chars)
            if (applicant.email) {
                const [user, domain] = applicant.email.split('@');
                applicant.email = `${user.substring(0, 3)}***@${domain}`;
            }

            // Mask phone (show last 4 chars)
            if (applicant.phoneNumber) {
                applicant.phoneNumber = applicant.phoneNumber.replace(/.(?=.{4})/g, "*");
            }

            // Mask profile details
            if (applicant.profile) {
                if (applicant.profile.experience && applicant.profile.experience.length > 0) {
                    applicant.profile.experience = applicant.profile.experience.map(() => ({
                        company: '********',
                        role: '********',
                        period: '********'
                    }));
                }

                if (applicant.profile.education && applicant.profile.education.length > 0) {
                    applicant.profile.education = applicant.profile.education.map(() => ({
                        school: '********',
                        degree: '********',
                        period: '********'
                    }));
                }

                applicant.profile.bio = "Upgrade to a PRO subscription to view this candidate's full profile, experience history, and contact details.";
            }

            // Mask application message
            if (application.message) {
                application.message = "This message is only visible to PRO subscribers.";
            }

            // Mask cover letter (for resource applications)
            if (application.coverLetter) {
                application.coverLetter = "Upgrade to view cover letter.";
            }

            // Mask resume and additional documents
            if (application.resume) {
                application.resume = "";
            }
            if (application.additionalDocuments) {
                application.additionalDocuments = [];
            }
        }
        return application;
    }

    // Helper to check if a user has an active subscription
    private async checkUserSubscription(userId: string): Promise<boolean> {
        const user = await User.findById(userId);
        if (!user) return false;

        if (!user.activeSubscriptionId || !user.subscriptionExpiry) {
            return false;
        }

        const now = new Date();
        return user.subscriptionExpiry > now;
    }
}

