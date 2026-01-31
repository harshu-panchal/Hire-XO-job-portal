import { Router } from 'express';
import { CertificateController } from '../controllers/certificate.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const certificateController = new CertificateController();

// All routes require authentication
router.post('/', authenticateToken, certificateController.createCertificate);
router.get('/', authenticateToken, certificateController.getUserCertificates);
router.get('/active', authenticateToken, certificateController.getActiveCertificates);
router.get('/:id', authenticateToken, certificateController.getCertificateById);
router.put('/:id', authenticateToken, certificateController.updateCertificate);
router.delete('/:id', authenticateToken, certificateController.deleteCertificate);

export default router;
