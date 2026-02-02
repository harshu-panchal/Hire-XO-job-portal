import { Response } from 'express';
import { CertificateService } from '../services/certificate.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class CertificateController {
    private certificateService: CertificateService;

    constructor() {
        this.certificateService = new CertificateService();
    }

    public createCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { name, issueDate, expiryDate, successRate } = req.body;

            if (!name || !issueDate || !expiryDate || successRate === undefined) {
                res.status(400).json({ message: 'All fields are required' });
                return;
            }

            const certificate = await this.certificateService.createCertificate(
                userId,
                name,
                new Date(issueDate),
                new Date(expiryDate),
                successRate
            );

            res.status(201).json({
                message: 'Certificate created successfully',
                certificate
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Failed to create certificate' });
        }
    };

    public getUserCertificates = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const certificates = await this.certificateService.getUserCertificates(userId);
            res.status(200).json(certificates);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to fetch certificates' });
        }
    };

    public getActiveCertificates = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const certificates = await this.certificateService.getActiveCertificates(userId);
            res.status(200).json(certificates);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to fetch active certificates' });
        }
    };

    public getCertificateById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const certificate = await this.certificateService.getCertificateById(id, userId);
            res.status(200).json(certificate);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Certificate not found' });
        }
    };

    public updateCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const updates = req.body;

            const certificate = await this.certificateService.updateCertificate(id, userId, updates);
            res.status(200).json({
                message: 'Certificate updated successfully',
                certificate
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Failed to update certificate' });
        }
    };

    public deleteCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const result = await this.certificateService.deleteCertificate(id, userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Failed to delete certificate' });
        }
    };

    // ========== ADMIN ONLY METHODS ==========

    /**
     * Get all certificates with optional status filter (Admin only)
     * GET /api/admin/certificates?status=pending
     */
    public getAllCertificates = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { status, page = '1', limit = '20' } = req.query;

            const query: any = {};
            if (status && ['pending', 'approved', 'rejected'].includes(status as string)) {
                query.verificationStatus = status;
            }

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);
            const skip = (pageNum - 1) * limitNum;

            const certificates = await this.certificateService.getAllCertificates(query, skip, limitNum);
            const total = await this.certificateService.countCertificates(query);

            res.status(200).json({
                success: true,
                data: certificates,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch certificates'
            });
        }
    };

    /**
     * Approve a certificate (Admin only)
     * PATCH /api/admin/certificates/:id/approve
     */
    public approveCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const adminId = req.user?.id;
            if (!adminId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const certificate = await this.certificateService.approveCertificate(id, adminId);

            res.status(200).json({
                success: true,
                message: 'Certificate approved successfully',
                data: certificate
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to approve certificate'
            });
        }
    };

    /**
     * Reject a certificate (Admin only)
     * PATCH /api/admin/certificates/:id/reject
     */
    public rejectCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const adminId = req.user?.id;
            if (!adminId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const { reason } = req.body;

            if (!reason) {
                res.status(400).json({
                    success: false,
                    message: 'Rejection reason is required'
                });
                return;
            }

            const certificate = await this.certificateService.rejectCertificate(id, adminId, reason);

            res.status(200).json({
                success: true,
                message: 'Certificate rejected',
                data: certificate
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to reject certificate'
            });
        }
    };
}
