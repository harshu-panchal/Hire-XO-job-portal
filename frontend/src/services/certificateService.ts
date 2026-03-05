/**
 * Certificate Service
 * Handles certificate upload and management
 */

import apiClient, { getErrorMessage } from "../lib/apiConfig";
import { tokenManager } from "../lib/tokenManager";
import type { Certificate } from "../types";

export const certificateService = {
  getCertificateDownloadUrl(certificateId: string): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const token = tokenManager.getToken();
    const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : "";
    return `${baseUrl}/certificates/${certificateId}/download${tokenQuery}`;
  },
  /**
   * Upload a new certificate
   */
  async uploadCertificate(
    certificateData: FormData
  ): Promise<{ message: string; certificate: Certificate }> {
    try {
      const response = await apiClient.post("/certificates", certificateData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      const certificate = data.certificate || data.data;
      if (!certificate) {
        throw new Error(data.message || "Certificate upload is not available");
      }
      return {
        ...data,
        certificate: {
          ...certificate,
          id: certificate.id || certificate._id,
        },
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get my certificates
   */
  async getMyCertificates(): Promise<Certificate[]> {
    try {
      const response = await apiClient.get<Certificate[]>("/certificates");
      const certificates = response.data || [];
      return certificates.map((cert: any) => ({
        ...cert,
        id: cert.id || cert._id,
      }));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete a certificate
   */
  async deleteCertificate(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/certificates/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
