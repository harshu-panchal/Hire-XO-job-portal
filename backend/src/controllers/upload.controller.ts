import { Request, Response } from 'express';
import { FileUploadUtil } from '../utils/file-upload';

export class UploadController {
    public uploadProfilePhoto = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            const fileUrl = FileUploadUtil.getFileUrl(req.file.filename, 'profile-photo');

            res.status(200).json({
                message: 'Profile photo uploaded successfully',
                filename: req.file.filename,
                url: fileUrl,
                path: req.file.path
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

            const fileUrl = FileUploadUtil.getFileUrl(req.file.filename, 'cv');

            res.status(200).json({
                message: 'CV uploaded successfully',
                filename: req.file.filename,
                url: fileUrl,
                path: req.file.path
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

            const fileUrl = FileUploadUtil.getFileUrl(req.file.filename, 'company-logo');

            res.status(200).json({
                message: 'Company logo uploaded successfully',
                filename: req.file.filename,
                url: fileUrl,
                path: req.file.path
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };
}
