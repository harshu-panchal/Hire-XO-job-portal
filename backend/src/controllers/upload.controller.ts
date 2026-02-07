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

    public uploadCertificate = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'certificates');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'Certificate uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };

    public uploadTenderDocument = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'tender-documents');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'Tender document uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };

    public uploadPostMedia = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'posts');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'File uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };

    public uploadEquipmentImage = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'equipment-images');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'Equipment image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };

    public uploadMachineryImage = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'machinery-images');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'Machinery image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };

    public uploadVehicleImage = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'vehicle-images');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'Vehicle image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };

    public uploadLogisticsImage = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'logistics-images');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'Logistics image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };

    public uploadPMCImage = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'pmc-images');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'PMC image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };

    public uploadCSMImage = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'csm-images');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'CSM image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };

    public uploadInvestorImage = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            const result = await CloudinaryUtil.uploadFile(req.file.path, 'investor-images');

            if (!result) {
                res.status(500).json({ message: 'Cloudinary upload failed' });
                return;
            }

            res.status(200).json({
                message: 'Investor image uploaded successfully',
                filename: req.file.filename,
                url: result.url,
                public_id: result.public_id
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        }
    };
}
