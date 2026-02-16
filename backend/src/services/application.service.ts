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
import SubscriptionPlan from '../models/subscription-plan.model';
import InterviewTier from '../models/interview-tier.model';
import { notificationEmitter } from '../utils/notificationEmitter';
import { sendNotification } from '../utils/notification.util';


export class ApplicationService {
    public async getSLAExpiredApplications(page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const applications = await JobApplication.find({ status: 'SLAExpired' })
            .populate('applicantId', 'name email phoneNumber profilePhoto')
            .populate('jobId', 'title company userId')
            .sort({ appliedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const data = applications
            .filter((app: any) => app?.jobId?.userId)
            .map((app: any) => ({
                ...app,
                employerId: app.jobId.userId
            }));

        const total = await JobApplication.countDocuments({ status: 'SLAExpired' });

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

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

        const applicant = await User.findById(applicantId);
        let verificationPlanId: any = undefined;
        let verificationMaxScheduleDays: number | undefined = undefined;

        // Preferred: dedicated interview tier
        if (applicant?.interviewTierId && applicant.interviewTierExpiry && applicant.interviewTierExpiry > new Date()) {
            const tier = await InterviewTier.findById(applicant.interviewTierId);
            if (tier?.isActive && tier.maxScheduleDays) {
                verificationPlanId = tier._id;
                verificationMaxScheduleDays = tier.maxScheduleDays;
            }
        } else if (applicant?.activeSubscriptionId && applicant.subscriptionExpiry && applicant.subscriptionExpiry > new Date()) {
            // Backward compatibility: previously interview tiers were tied to activeSubscriptionId
            const activePlan = await SubscriptionPlan.findById(applicant.activeSubscriptionId);
            if (activePlan?.type === 'job-seeker' && activePlan.maxScheduleDays) {
                verificationPlanId = activePlan._id;
                verificationMaxScheduleDays = activePlan.maxScheduleDays;
            }
        }

        // Create application
        const application = await JobApplication.create({
            applicantId,
            jobId,
            message: data.message,
            resume: data.resume,
            additionalDocuments: data.additionalDocuments,
            status: 'Pending',
            verificationPlanId,
            verificationMaxScheduleDays
        });

        // Notify Job Owner (Employer)
        try {
            const applicant = await User.findById(applicantId);
            const applicantName = applicant ? applicant.name : 'A candidate';

            await sendNotification({
                userId: job.userId.toString(),
                title: 'New Job Application',
                message: `${applicantName} has applied for ${job.title}`,
                type: 'info',
                relatedId: application._id.toString(),
                relatedType: 'job_application'
            });
        } catch (error) {
            console.error('Failed to notify job owner', error);
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
            proposalDocuments?: string[];
        }
    ) {
        const normalizedResourceType = this.getNormalizedResourceType(resourceType);
        if (!normalizedResourceType) {
            throw new Error(`Invalid resource type: ${resourceType}`);
        }

        const ResourceModel = this.getResourceModel(normalizedResourceType);
        if (!ResourceModel) {
            throw new Error(`Invalid resource type: ${resourceType}`);
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
            resourceType: normalizedResourceType
        });
        if (existingApplication) {
            throw new Error('You have already applied to this resource');
        }

        // Create application
        const application = await ResourceApplication.create({
            applicantId,
            resourceId,
            resourceType: normalizedResourceType,
            message: data.message,
            bidAmount: data.bidAmount,
            coverLetter: data.coverLetter,
            proposalDocuments: data.proposalDocuments,
            status: 'Pending'
        });

        // Notify Resource Owner
        try {
            const applicant = await User.findById(applicantId);
            const applicantName = applicant ? applicant.name : 'A candidate';

            await sendNotification({
                userId: resource.userId.toString(),
                title: 'New Resource Application',
                message: `${applicantName} has applied for your ${resourceType}`,
                type: 'info',
                relatedId: application._id.toString(),
                relatedType: 'resource_application'
            });
        } catch (error) {
            console.error('Failed to notify resource owner', error);
        }

        return application;
    }

    // Get user's applications with pagination
    public async getMyApplications(userId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [jobApplications, resourceApplications, totalJobs, totalResources] = await Promise.all([
            JobApplication.find({ applicantId: userId })
                .populate('jobId')
                .sort({ appliedAt: -1 })
                .skip(skip)
                .limit(limit),
            ResourceApplication.find({ applicantId: userId })
                .populate('resourceId')
                .sort({ appliedAt: -1 })
                .skip(skip)
                .limit(limit),
            JobApplication.countDocuments({ applicantId: userId }),
            ResourceApplication.countDocuments({ applicantId: userId })
        ]);

        return {
            jobs: jobApplications,
            resources: resourceApplications,
            pagination: {
                page,
                limit,
                total: totalJobs + totalResources,
                pages: Math.ceil(Math.max(totalJobs, totalResources) / limit)
            }
        };
    }

    // Get applications for a specific job (for job owner)
    public async getJobApplications(jobId: string, ownerId: string, page: number = 1, limit: number = 20) {
        // Check if user can view unmasked data
        const canViewData = await this.canViewUnmaskedData(ownerId);

        // Verify ownership
        const job = await Job.findById(jobId);
        if (!job) {
            throw new Error('Job not found');
        }

        if (job.userId.toString() !== ownerId) {
            throw new Error('You are not authorized to view these applications');
        }

        const skip = (page - 1) * limit;

        const applications = await JobApplication.find({ jobId })
            .populate('applicantId', 'name email phoneNumber profilePhoto profile')
            .sort({ appliedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await JobApplication.countDocuments({ jobId });

        let data = applications;
        if (!canViewData) {
            data = applications.map(app => this.maskApplicationData(app));
        }

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    // Get all applications received for jobs posted by the user (Recruiter Dashboard)
    public async getReceivedApplications(userId: string, page: number = 1, limit: number = 20) {
        // Check if user can view unmasked data
        const canViewData = await this.canViewUnmaskedData(userId);

        // Find all jobs posted by the user
        const jobs = await Job.find({ userId });
        const jobIds = jobs.map(job => job._id);

        const skip = (page - 1) * limit;

        // Find applications for these jobs
        const applications = await JobApplication.find({ jobId: { $in: jobIds } })
            .populate('applicantId', 'name email phoneNumber profilePhoto profile')
            .populate('jobId', 'title')
            .sort({ appliedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await JobApplication.countDocuments({ jobId: { $in: jobIds } });

        let data = applications;
        if (!canViewData) {
            data = applications.map(app => this.maskApplicationData(app));
        }

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    // Get all applications received for resources posted by the user
    public async getReceivedResourceApplications(userId: string, category: string, page: number = 1, limit: number = 20) {
        const ResourceModel = this.getResourceModel(category);

        if (!ResourceModel) {
            // Return empty if invalid category, or throw error? 
            // Returning empty is safer for dashboard
            return {
                data: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    pages: 0
                }
            };
        }

        // Find all resources posted by the user
        const resources = await ResourceModel.find({ userId });
        const resourceIds = resources.map((r: any) => r._id);

        // Check if user can view unmasked data
        const canViewData = await this.canViewUnmaskedData(userId);

        const skip = (page - 1) * limit;

        // Find applications for these resources
        const applications = await ResourceApplication.find({ resourceId: { $in: resourceIds } })
            .populate('applicantId', 'name email phoneNumber profilePhoto profile')
            .populate('resourceId')
            .sort({ appliedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await ResourceApplication.countDocuments({ resourceId: { $in: resourceIds } });

        let data = applications;
        if (!canViewData) {
            data = applications.map(app => this.maskApplicationData(app));
        }

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    // Get applications for a specific resource (for resource owner)
    public async getResourceApplications(resourceId: string, resourceType: string, ownerId: string, page: number = 1, limit: number = 20) {
        // Check if user can view unmasked data
        const canViewData = await this.canViewUnmaskedData(ownerId);

        const normalizedResourceType = this.getNormalizedResourceType(resourceType);
        if (!normalizedResourceType) {
            throw new Error(`Invalid resource type: ${resourceType}`);
        }

        const ResourceModel = this.getResourceModel(normalizedResourceType);
        if (!ResourceModel) {
            throw new Error(`Invalid resource type: ${resourceType}`);
        }

        // Verify ownership
        const resource = await ResourceModel.findById(resourceId);
        if (!resource) {
            throw new Error('Resource not found');
        }

        if (resource.userId.toString() !== ownerId) {
            throw new Error('You are not authorized to view these applications');
        }

        const skip = (page - 1) * limit;

        const applications = await ResourceApplication.find({ resourceId, resourceType: normalizedResourceType })
            .populate('applicantId', 'name email phoneNumber profilePhoto profile')
            .sort({ appliedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await ResourceApplication.countDocuments({ resourceId, resourceType: normalizedResourceType });

        let data = applications;
        if (!canViewData) {
            data = applications.map(app => this.maskApplicationData(app));
        }

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    // Delete/Withdraw application
    public async deleteApplication(applicationId: string, userId: string): Promise<void> {
        // Try searching in JobApplications first
        let application = await JobApplication.findById(applicationId);
        let Model: any = JobApplication;

        if (!application) {
            // Try searching in ResourceApplications
            application = await ResourceApplication.findById(applicationId) as any;
            Model = ResourceApplication;
        }

        if (!application) {
            throw new Error('Application not found');
        }

        // Check ownership (only the applicant can withdraw)
        if (application.applicantId.toString() !== userId) {
            throw new Error('You are not authorized to withdraw this application');
        }

        await Model.findByIdAndDelete(applicationId);
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

            if (status === 'Accepted') {
                const recruiter = await User.findById(userId);
                const hasActiveSubscription = Boolean(
                    recruiter?.activeSubscriptionId &&
                    recruiter?.subscriptionExpiry &&
                    recruiter.subscriptionExpiry > new Date()
                );

                if (!hasActiveSubscription) {
                    throw new Error('Employer subscription required to hire candidate');
                }
            }

            application.status = status;
            await application.save();

            // Create Notification
            const title = status === 'Accepted' ? 'Application Accepted' : 'Application Update';
            const message = status === 'Accepted'
                ? `Your application for ${job.title} has been accepted. The employer may now schedule an interview.`
                : `Thank you for your interest in ${job.title}. Unfortunately, your application was not selected at this time.`;

            await sendNotification({
                userId: application.applicantId.toString(),
                title,
                message,
                type: status === 'Accepted' ? 'success' : 'info',
                relatedId: application._id.toString(),
                relatedType: 'job_application'
            });

            return application;
        } else {
            const application = await ResourceApplication.findById(applicationId);
            if (!application) {
                throw new Error('Application not found');
            }

            // Verify ownership through resource
            const ResourceModel = this.getResourceModel(application.resourceType);
            if (!ResourceModel) {
                throw new Error('Invalid resource type in application');
            }
            const resource = await ResourceModel.findById(application.resourceId);

            if (!resource || resource.userId.toString() !== userId) {
                throw new Error('You are not authorized to update this application');
            }

            application.status = status;
            await application.save();

            // Create Notification
            const title = status === 'Accepted' ? 'Application Accepted' : 'Application Update';
            const message = status === 'Accepted'
                ? `Your application for the ${application.resourceType} position has been accepted.`
                : `Thank you for your interest in the ${application.resourceType} position. Unfortunately, your application was not selected at this time.`;

            await sendNotification({
                userId: application.applicantId.toString(),
                title,
                message,
                type: status === 'Accepted' ? 'success' : 'info',
                relatedId: application._id.toString(),
                relatedType: 'resource_application'
            });

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

                // Mask additional sensitive fields
                applicant.profile.skills = [];
                applicant.profile.linkedinUrl = '';
                applicant.profile.githubUrl = '';
                applicant.profile.twitterUrl = '';
                applicant.profile.location = '********';
                applicant.profile.age = undefined;
                applicant.profile.jobTitle = '********';
                applicant.profile.company = '********';
                applicant.profile.organizationName = '********';
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
            if (application.proposalDocuments) {
                application.proposalDocuments = [];
            }
        }
        return application;
    }

    // Helper to check if a user can view unmasked application data
    // Admins and users with active PRO subscriptions are exempt from masking
    private async canViewUnmaskedData(userId: string): Promise<boolean> {
        const user = await User.findById(userId);
        if (!user) return false;

        // Admins can see everything
        if (user.role === 'admin') return true;

        // Check for active subscription
        if (!user.activeSubscriptionId || !user.subscriptionExpiry) {
            return false;
        }

        const now = new Date();
        return user.subscriptionExpiry > now;
    }

    // Helper to get normalized resource type string (singular, capitalized)
    private getNormalizedResourceType(type: string): string | null {
        if (!type) return null;

        const normalized = type.toLowerCase().trim();

        const map: { [key: string]: string } = {
            'investor': 'Investor',
            'investors': 'Investor',
            'tender': 'Tender',
            'tenders': 'Tender',
            'equipment': 'Equipment',
            'equipments': 'Equipment',
            'machinery': 'Machinery',
            'pmc': 'PMC',
            'csm': 'CSM',
            'logistics': 'Logistics',
            'vehicle': 'Vehicle',
            'vehicles': 'Vehicle'
        };

        return map[normalized] || null;
    }

    // Helper to get Resource Model from type string (handles singular/plural/case-insensitive)
    private getResourceModel(type: string): any {
        const normalized = this.getNormalizedResourceType(type);
        if (!normalized) return null;

        const map: any = {
            'Investor': Investor,
            'Tender': Tender,
            'Equipment': Equipment,
            'Machinery': Machinery,
            'PMC': PMC,
            'CSM': CSM,
            'Logistics': Logistics,
            'Vehicle': Vehicle
        };

        return map[normalized] || null;
    }
}

