import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { WalletService } from '../services/wallet.service';

export class WalletController {
    private walletService: WalletService;

    constructor() {
        this.walletService = new WalletService();
    }

    /**
     * Get wallet status and history
     */
    public getWallet = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const data = await this.walletService.getWalletData(userId);
            res.status(200).json(data);
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * Get full transaction history
     */
    public getTransactions = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await this.walletService.getTransactions(userId, page, limit);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * Handle simulated top-up
     */
    public topUp = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            const { amount } = req.body;

            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            if (!amount || amount <= 0) {
                res.status(400).json({ message: 'Invalid amount' });
                return;
            }

            const result = await this.walletService.topUp(userId, amount);
            res.status(200).json({
                message: 'Top-up successful',
                ...result
            });
        } catch (error: any) {
            next(error);
        }
    };
}
