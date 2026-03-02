import apiClient, { getErrorMessage } from "../lib/apiConfig";

export const paymentService = {
  async createCertificateRequest(planId: string): Promise<void> {
    try {
      await apiClient.post("/payments/certificate-request", { planId });
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  },
};

