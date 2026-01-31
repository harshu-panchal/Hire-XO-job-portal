import fs from 'fs';
import path from 'path';

export class FileUploadUtil {
    /**
     * Delete a file from the file system
     */
    static deleteFile(filePath: string): boolean {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }

    /**
     * Get file URL for serving
     */
    static getFileUrl(filename: string, type: 'profile-photo' | 'cv' | 'company-logo'): string {
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const typeMap = {
            'profile-photo': 'profile-photos',
            'cv': 'cvs',
            'company-logo': 'company-logos'
        };
        return `${baseUrl}/uploads/${typeMap[type]}/${filename}`;
    }

    /**
     * Validate file exists
     */
    static fileExists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }

    /**
     * Get file info
     */
    static getFileInfo(filePath: string) {
        if (!fs.existsSync(filePath)) {
            return null;
        }

        const stats = fs.statSync(filePath);
        return {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            extension: path.extname(filePath)
        };
    }
}
