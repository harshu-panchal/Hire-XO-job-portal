import apiClient, { getErrorMessage } from "../lib/apiConfig";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  read: boolean;
  relatedId?: string;
  relatedType?: "job_application" | "resource_application" | "certificate_request" | "certificate_issued" | "new_job" | "new_resource" | "new_user";
  createdAt: string;
}

export const notificationService = {
  async getNotifications(page: number = 1, limit: number = 20): Promise<any> {
    try {
      const response = await apiClient.get('/notifications', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.put("/notifications/mark-all-read");
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
