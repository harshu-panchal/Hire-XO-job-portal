import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { CertificateRequestService } from '../services/certificate-request.service';

export class CertificateRequestController {
    private service: CertificateRequestService;

    constructor() {
        this.service = new CertificateRequestService();
    }

    public listRequests = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { status, search, page = '1', limit = '20' } = req.query;
            const data = await this.service.listRequests({
                status: status as string | undefined,
                search: search as string | undefined,
                page: Number(page) || 1,
                limit: Number(limit) || 20
            });

            res.status(200).json({
                success: true,
                ...data
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch certificate requests'
            });
        }
    };

    public issueRequest = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const adminId = req.user?.id;
            if (!adminId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const payload = req.body || {};
            const result = await this.service.issueRequest(id, adminId, payload);
            res.status(200).json({
                success: true,
                message: 'Certificate issued successfully',
                data: result
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to issue certificate'
            });
        }
    };

    public previewRequest = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.service.previewRequest(id, req.body || {});
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to preview certificate'
            });
        }
    };

    public rejectRequest = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const adminId = req.user?.id;
            if (!adminId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const { reason } = req.body;
            const request = await this.service.rejectRequest(id, adminId, reason);
            res.status(200).json({
                success: true,
                message: 'Certificate request rejected',
                data: request
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to reject request'
            });
        }
    };

}
