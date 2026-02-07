import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { uploadProfilePhoto, uploadCV, uploadCompanyLogo, uploadCertificate, uploadTenderDocument, uploadEquipmentImage, uploadMachineryImage, uploadVehicleImage, uploadLogisticsImage, uploadPMCImage, uploadCSMImage, uploadInvestorImage } from '../middlewares/upload.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const uploadController = new UploadController();

// All upload routes are protected
router.post('/profile-photo', authenticateToken, uploadProfilePhoto, uploadController.uploadProfilePhoto);
router.post('/cv', authenticateToken, uploadCV, uploadController.uploadCV);
router.post('/company-logo', authenticateToken, uploadCompanyLogo, uploadController.uploadCompanyLogo);
router.post('/certificate', authenticateToken, uploadCertificate, uploadController.uploadCertificate);
router.post('/tender-document', authenticateToken, uploadTenderDocument, uploadController.uploadTenderDocument);
router.post('/equipment-image', authenticateToken, uploadEquipmentImage, uploadController.uploadEquipmentImage);
router.post('/machinery-image', authenticateToken, uploadMachineryImage, uploadController.uploadMachineryImage);
router.post('/vehicle-image', authenticateToken, uploadVehicleImage, uploadController.uploadVehicleImage);
router.post('/logistics-image', authenticateToken, uploadLogisticsImage, uploadController.uploadLogisticsImage);
router.post('/pmc-image', authenticateToken, uploadPMCImage, uploadController.uploadPMCImage);
router.post('/csm-image', authenticateToken, uploadCSMImage, uploadController.uploadCSMImage);
router.post('/investor-image', authenticateToken, uploadInvestorImage, uploadController.uploadInvestorImage);
router.post('/post-media', authenticateToken, require('../middlewares/upload.middleware').uploadPostMedia, uploadController.uploadPostMedia);

export default router;
