import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export class CloudinaryUtil {
    /**
     * Upload a file to Cloudinary and delete the local copy
     * @param localPath Path to the local file
     * @param folder Cloudinary folder name
     */
    static async uploadFile(localPath: string, folder: string): Promise<{ url: string; public_id: string } | null> {
        try {
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(localPath, {
                folder: `hire-xo/${folder}`,
                resource_type: 'auto'
            });

            // Delete local file after successful upload
            this.deleteLocalFile(localPath);

            return {
                url: result.secure_url,
                public_id: result.public_id
            };
        } catch (error: any) {
            console.error('Cloudinary Upload Error:', error);
            // Ensure local file is deleted even if upload fails
            this.deleteLocalFile(localPath);
            return null;
        }
    }

    /**
     * Delete a file from Cloudinary
     * @param publicId Cloudinary public_id
     */
    static async deleteFile(publicId: string): Promise<boolean> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === 'ok';
        } catch (error) {
            console.error('Cloudinary Delete Error:', error);
            return false;
        }
    }

    /**
     * Helper to delete local file
     */
    private static deleteLocalFile(filePath: string) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error('Local File Cleanup Error:', error);
        }
    }
}
