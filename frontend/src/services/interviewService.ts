import api from "@/lib/apiConfig";

export interface Interview {
    _id: string;
    applicationId: string;
    applicationType: 'JobApplication' | 'ResourceApplication';
    jobId?: string;
    resourceId?: string;
    resourceType?: string;
    applicantId: string;
    employerId: string;
    title: string;
    description?: string;
    date: string;
    time: string;
    type: 'Remote' | 'On-site';
    location?: string;
    link?: string;
    status: 'scheduled' | 'pending' | 'completed' | 'cancelled';
    createdAt: string;
}

export interface ScheduleInterviewPayload extends Partial<Interview> {
    employerId?: string;
    requesterId?: string;
    requesterRole?: string;
    forceSchedule?: boolean;
    overrideReason?: string;
}

export const interviewService = {
    scheduleInterview: async (data: ScheduleInterviewPayload) => {
        const response = await api.post('/interviews/schedule', data);
        return response.data;
    },

    getMyInterviews: async () => {
        const response = await api.get('/interviews/my');
        return response.data;
    },

    updateStatus: async (interviewId: string, status: string) => {
        const response = await api.patch(`/interviews/${interviewId}/status`, { status });
        return response.data;
    },

    updateInterview: async (interviewId: string, data: Partial<Interview>) => {
        const response = await api.put(`/interviews/${interviewId}`, data);
        return response.data;
    },

    cancelInterview: async (interviewId: string) => {
        const response = await api.delete(`/interviews/${interviewId}`);
        return response.data;
    }
};
