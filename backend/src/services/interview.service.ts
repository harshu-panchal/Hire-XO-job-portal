import Interview, { IInterview } from '../models/interview.model';
import JobApplication from '../models/job-application.model';
import ResourceApplication from '../models/resource-application.model';
import Notification from '../models/notification.model';
import User from '../models/user.model';
import { notificationEmitter } from '../utils/notificationEmitter';
import mongoose from 'mongoose';
import Job from '../models/job.model';

export class InterviewService {
    public createInterview = async (data: any): Promise<IInterview> => {
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
            if (job.userId.toString() !== data.employerId) {
                throw new Error('You can only schedule interviews for your own jobs');
            }
        }

        // 3. Verify Resource Ownership (if linked to a resource) - optional based on schema but good practice
        // For now, focusing on Job as per plan.

        const interview = await Interview.create(data);

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

    public getInterviewsForUser = async (userId: string, role: string): Promise<IInterview[]> => {
        const query = role === 'employer' ? { employerId: userId } : { applicantId: userId };
        return await Interview.find(query)
            .populate('jobId', 'title company location')
            .populate('applicantId', 'name profilePhoto email')
            .populate('employerId', 'name profilePhoto email')
            .sort({ date: 1, time: 1 });
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
