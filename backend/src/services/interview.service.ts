import Interview, { IInterview } from '../models/interview.model';
import JobApplication from '../models/job-application.model';
import ResourceApplication from '../models/resource-application.model';
import Notification from '../models/notification.model';
import User from '../models/user.model';
import { notificationEmitter } from '../utils/notificationEmitter';
import mongoose from 'mongoose';
import Job from '../models/job.model';
import { AuditService } from './audit.service';

export class InterviewService {
    public createInterview = async (data: any): Promise<IInterview> => {
        if (!data.applicationId || !data.applicationType) {
            throw new Error('Application details are required to schedule an interview');
        }

        let jobApplication: any = null;
        let interviewOwnerEmployerId: string | undefined = data.employerId;
        if (data.applicationType === 'JobApplication') {
            const application = await JobApplication.findById(data.applicationId);
            if (!application) {
                throw new Error('Application not found');
            }

            if (application.status !== 'Accepted') {
                throw new Error('Candidate must be hired before scheduling interview');
            }

            const job = await Job.findById(application.jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            interviewOwnerEmployerId = job.userId.toString();
            if (data.requesterRole !== 'admin' && job.userId.toString() !== data.employerId) {
                throw new Error('You can only schedule interviews for your own jobs');
            }

            data.applicantId = application.applicantId;
            data.jobId = application.jobId;
            data.employerId = job.userId;
            jobApplication = application;

            const hasEmployerSubscription = await this.hasActiveEmployerSubscription(interviewOwnerEmployerId);
            if (!hasEmployerSubscription) {
                throw new Error('Employer subscription required to schedule interview');
            }

            const now = new Date();
            const appliedAt = new Date(application.appliedAt);
            const maxScheduleDays = application.verificationMaxScheduleDays;

            if (maxScheduleDays && maxScheduleDays > 0) {
                const deadline = new Date(appliedAt);
                deadline.setDate(deadline.getDate() + maxScheduleDays);

                const isForceScheduleByAdmin = Boolean(
                    data.requesterRole === 'admin' && data.forceSchedule && data.overrideReason
                );

                if (now > deadline && !isForceScheduleByAdmin) {
                    application.status = 'SLAExpired';
                    await application.save();
                    throw new Error(`Interview SLA window expired on ${deadline.toDateString()}`);
                }

                if (isForceScheduleByAdmin) {
                    await AuditService.logAction(
                        data.requesterId,
                        'FORCE_SCHEDULE_INTERVIEW',
                        'JobApplication',
                        String(application._id),
                        {
                            reason: data.overrideReason,
                            appliedAt,
                            maxScheduleDays,
                            originalDeadline: deadline
                        }
                    );
                }
            } else {
                const earliestScheduleDate = new Date(appliedAt);
                earliestScheduleDate.setDate(earliestScheduleDate.getDate() + 30);

                if (now < earliestScheduleDate) {
                    throw new Error(`Without employee verification tier, interview can be scheduled after ${earliestScheduleDate.toDateString()}`);
                }
            }
        }

        // 1. Verify Applicant exists
        const applicant = await User.findById(data.applicantId);
        if (!applicant) {
            throw new Error('Applicant not found');
        }

        // 2. Verify Job Ownership (if linked to a job)
        if (data.jobId) {
            const job = await Job.findById(data.jobId);
            if (!job) {
                throw new Error('Job not found');
            }
            if (data.requesterRole !== 'admin' && job.userId.toString() !== data.employerId) {
                throw new Error('You can only schedule interviews for your own jobs');
            }
        }

        // 3. Verify Resource Ownership (if linked to a resource) - optional based on schema but good practice
        // For now, focusing on Job as per plan.

        const interview = await Interview.create(data);

        // Mark job application as interview scheduled once interview is created.
        if (jobApplication) {
            jobApplication.status = 'InterviewScheduled';
            await jobApplication.save();
        }

        // Notify Applicant
        try {
            const employer = await User.findById(data.employerId);
            const employerName = employer ? employer.name : 'An employer';

            const details = data.type === 'Remote'
                ? `Join via: ${data.link}`
                : `Location: ${data.location}`;

            const notification = await Notification.create({
                userId: data.applicantId,
                title: 'Interview Scheduled',
                message: `${employerName} has scheduled an interview for ${data.title} on ${new Date(data.date).toLocaleDateString()} at ${data.time}. Type: ${data.type}. ${details}`,
                type: 'info',
                relatedId: interview._id.toString(),
                relatedType: 'job_application' // Or generic 'interview'?
            });
            notificationEmitter.emit('new_notification', { userId: data.applicantId, notification });
        } catch (error) {
            console.error('Failed to notify applicant about interview', error);
        }

        return interview;
    };

    private async hasActiveEmployerSubscription(employerId: string): Promise<boolean> {
        const employer = await User.findById(employerId);
        if (!employer) return false;
        if (!employer.activeSubscriptionId || !employer.subscriptionExpiry) return false;
        return employer.subscriptionExpiry > new Date();
    }

    public getInterviewsForUser = async (userId: string, role: string): Promise<IInterview[]> => {
        const query = role === 'admin'
            ? {}
            : role === 'employer'
                ? { employerId: userId }
                : { applicantId: userId };
        return await Interview.find(query)
            .populate('jobId', 'title company location')
            .populate('applicantId', 'name profilePhoto email')
            .populate('employerId', 'name profilePhoto email')
            .sort({ date: 1, time: 1 });
    };

    public updateInterview = async (
        interviewId: string,
        payload: Partial<IInterview>,
        userId: string,
        role: string
    ): Promise<IInterview> => {
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            throw new Error('Interview not found');
        }

        const isAdmin = role === 'admin';
        if (!isAdmin && interview.employerId.toString() !== userId) {
            throw new Error('Only employer or admin can edit this interview');
        }

        if (!['scheduled', 'pending'].includes(interview.status)) {
            throw new Error('Only scheduled or pending interviews can be edited');
        }

        const editableFields = ['title', 'description', 'date', 'time', 'type', 'location', 'link', 'status'] as const;
        editableFields.forEach((field) => {
            if (payload[field] !== undefined) {
                (interview as any)[field] = payload[field];
            }
        });

        if (interview.type === 'Remote' && !interview.link) {
            throw new Error('Meeting link is required for remote interviews');
        }
        if (interview.type === 'On-site' && !interview.location) {
            throw new Error('Location is required for on-site interviews');
        }

        await interview.save();

        try {
            const editor = await User.findById(userId);
            const editorName = editor ? editor.name : 'Admin';

            const message = `${editorName} updated interview details for ${interview.title} on ${new Date(interview.date).toLocaleDateString()} at ${interview.time}.`;

            const notifyTargets = [interview.applicantId.toString(), interview.employerId.toString()]
                .filter((targetId) => targetId !== userId);

            for (const targetId of notifyTargets) {
                const notification = await Notification.create({
                    userId: targetId,
                    title: 'Interview Updated',
                    message,
                    type: 'info',
                    relatedId: interview._id.toString(),
                    relatedType: 'job_application'
                });
                notificationEmitter.emit('new_notification', { userId: targetId, notification });
            }
        } catch (error) {
            console.error('Failed to notify users about interview update', error);
        }

        return interview;
    };

    public updateInterviewStatus = async (interviewId: string, status: string, userId: string): Promise<IInterview> => {
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            throw new Error('Interview not found');
        }

        // Verify authorization
        if (interview.employerId.toString() !== userId && interview.applicantId.toString() !== userId) {
            throw new Error('Unauthorized');
        }

        interview.status = status as any;
        await interview.save();

        // Notify other party
        try {
            const notificationTarget = interview.employerId.toString() === userId ? interview.applicantId : interview.employerId;
            const updater = await User.findById(userId);
            const updaterName = updater ? updater.name : 'The other party';

            const notification = await Notification.create({
                userId: notificationTarget,
                title: 'Interview Status Updated',
                message: `${updaterName} has marked the interview for ${interview.title} as ${status}.`,
                type: 'info',
                relatedId: interview._id.toString(),
                relatedType: 'job_application'
            });
            notificationEmitter.emit('new_notification', { userId: notificationTarget, notification });
        } catch (error) {
            console.error('Failed to notify about interview status update', error);
        }

        return interview;
    };

    public deleteInterview = async (interviewId: string, userId: string): Promise<void> => {
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            throw new Error('Interview not found');
        }

        if (interview.employerId.toString() !== userId) {
            throw new Error('Only the employer can cancel/delete the interview');
        }


        // Notify Applicant about cancellation
        try {
            const employer = await User.findById(userId);
            const employerName = employer ? employer.name : 'The employer';

            const notification = await Notification.create({
                userId: interview.applicantId,
                title: 'Interview Canceled',
                message: `${employerName} has canceled the interview for ${interview.title}.`,
                type: 'info',
                relatedId: interview.applicationId.toString(), // Redirect to application since interview is gone
                relatedType: 'job_application'
            });
            notificationEmitter.emit('new_notification', { userId: interview.applicantId, notification });
        } catch (error) {
            console.error('Failed to notify about interview cancellation', error);
        }

        await Interview.findByIdAndDelete(interviewId);
    };
}
