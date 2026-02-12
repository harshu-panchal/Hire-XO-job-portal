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
router.put('/users/:id', adminController.updateUser);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users', adminController.createUser);

// System Statistics
router.get('/stats', adminController.getSystemStats);
router.get('/transactions', adminController.getAllTransactions);

// Subscription Plan Management
router.post('/plans', subscriptionController.createPlan);
router.put('/plans/:id', subscriptionController.updatePlan);
router.delete('/plans/:id', subscriptionController.deletePlan);

// Certificate Verification
router.get('/certificates', certificateController.getAllCertificates);
router.patch('/certificates/:id/approve', certificateController.approveCertificate);
router.patch('/certificates/:id/reject', certificateController.rejectCertificate);

// Resource Management
router.get('/resources/:category', adminController.getResources);
router.put('/resources/:category/:id', adminController.updateResource);
router.delete('/resources/:category/:id', adminController.deleteResource);

export default router;
