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

export const interviewService = {
    scheduleInterview: async (data: Partial<Interview>) => {
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

    cancelInterview: async (interviewId: string) => {
        const response = await api.delete(`/interviews/${interviewId}`);
        return response.data;
    }
};
