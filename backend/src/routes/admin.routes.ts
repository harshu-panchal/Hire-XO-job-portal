import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { SubscriptionController } from '../controllers/subscription.controller';
import { CertificateController } from '../controllers/certificate.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router = Router();
const adminController = new AdminController();
const subscriptionController = new SubscriptionController();
const certificateController = new CertificateController();

// All admin routes require authentication AND admin role
router.use(authenticateToken);
router.use(requireAdmin);

// User Management
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// System Statistics
router.get('/stats', adminController.getSystemStats);

// Subscription Plan Management
router.post('/plans', subscriptionController.createPlan);
router.put('/plans/:id', subscriptionController.updatePlan);
router.delete('/plans/:id', subscriptionController.deletePlan);

// Certificate Verification
router.get('/certificates', certificateController.getAllCertificates);
router.patch('/certificates/:id/approve', certificateController.approveCertificate);
router.patch('/certificates/:id/reject', certificateController.rejectCertificate);

export default router;
