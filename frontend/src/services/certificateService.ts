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
            const data = response.data;
            return {
                ...data,
                certificate: {
                    ...data.certificate,
                    id: data.certificate.id || data.certificate._id
                }
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
            const response = await apiClient.get<Certificate[]>('/certificates/my-certificates');
            const certificates = response.data || [];
            return certificates.map((cert: any) => ({
                ...cert,
                id: cert.id || cert._id
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
