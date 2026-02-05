/**
 * Upload Service
 * Handles file uploads
 */

import apiClient, { getErrorMessage } from "../lib/apiConfig";

export interface UploadResponse {
  url: string;
  filename: string;
}

export const uploadService = {
  /**
   * Upload a file
   */
  async uploadFile(
    file: File,
    endpoint: string = "/upload/file",
    fieldName: string = "file"
  ): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      const response = await apiClient.post<UploadResponse>(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Upload tender document
   */
  async uploadTenderDocument(file: File): Promise<UploadResponse> {
    return this.uploadFile(file, "/upload/tender-document", "tender-document");
  },

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: File[],
    endpoint: string = "/upload/file",
    fieldName: string = "file"
  ): Promise<UploadResponse[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadFile(file, endpoint, fieldName));
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
