import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { uploadProfilePhoto, uploadCV, uploadCompanyLogo } from '../middlewares/upload.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const uploadController = new UploadController();

// All upload routes are protected
router.post('/profile-photo', authenticateToken, uploadProfilePhoto, uploadController.uploadProfilePhoto);
router.post('/cv', authenticateToken, uploadCV, uploadController.uploadCV);
router.post('/company-logo', authenticateToken, uploadCompanyLogo, uploadController.uploadCompanyLogo);

export default router;
