import { Request, Response } from 'express';
import { CloudinaryUtil } from '../utils/cloudinary';

export class UploadController {
    public uploadProfilePhoto = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'profile-photos');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Profile photo uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };

    public uploadCV = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'cvs');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'CV uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };

    public uploadCompanyLogo = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'company-logos');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Company logo uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };

    public uploadCertificate = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'certificates');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Certificate uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };

    public uploadTenderDocument = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'tender-documents');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Tender document uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };

    public uploadPostMedia = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'posts');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'File uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };

    public uploadEquipmentImage = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'equipment-images');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Equipment image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };

    public uploadMachineryImage = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'machinery-images');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Machinery image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };

    public uploadVehicleImage = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'vehicle-images');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Vehicle image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };

    public uploadLogisticsImage = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'logistics-images');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Logistics image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };

    public uploadPMCImage = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'pmc-images');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'PMC image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };

    public uploadCSMImage = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'csm-images');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'CSM image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };

    public uploadInvestorImage = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'investor-images');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Investor image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            next(error);
        }
    };
}
