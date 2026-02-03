/**
 * Certificate Service
 * Handles certificate upload and management
 */

import apiClient, { getErrorMessage } from '../lib/apiConfig';
import type { Certificate } from '../types';

export const certificateService = {
    /**
     * Upload a new certificate
     */
    async uploadCertificate(certificateData: FormData): Promise<{ message: string; certificate: Certificate }> {
        try {
            const response = await apiClient.post('/certificates', certificateData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Get my certificates
     */
    async getMyCertificates(): Promise<Certificate[]> {
        try {
            const response = await apiClient.get<Certificate[]>('/certificates/my-certificates');
            return response.data;
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
