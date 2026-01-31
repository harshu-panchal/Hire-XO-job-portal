import { Request, Response } from 'express';
import { CloudinaryUtil } from '../utils/cloudinary';

export class UploadController {
    public uploadProfilePhoto = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'profile-photos');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'Profile photo uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };

    public uploadCV = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'cvs');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'CV uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };

    public uploadCompanyLogo = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'company-logos');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'Company logo uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };
}
