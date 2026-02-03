/**
 * Upload Service
 * Handles file uploads
 */

import apiClient, { getErrorMessage } from '../lib/apiConfig';

export interface UploadResponse {
    url: string;
    filename: string;
}

export const uploadService = {
    /**
     * Upload a file
     */
    async uploadFile(file: File, type?: string): Promise<UploadResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            if (type) {
                formData.append('type', type);
            }

            const response = await apiClient.post<UploadResponse>('/upload', formData, {
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
     * Upload multiple files
     */
    async uploadMultipleFiles(files: File[], type?: string): Promise<UploadResponse[]> {
        try {
            const uploadPromises = files.map((file) => this.uploadFile(file, type));
            return await Promise.all(uploadPromises);
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
};
