import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token, user } = await this.authService.login(req.body);
            res.status(200).json({ message: 'Login successful', token, user });
        } catch (error: any) {
            res.status(401).json({ message: error.message || 'Login failed' });
        }
    };

    public signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.authService.signup(req.body);
            res.status(201).json({ message: 'User registered successfully', ...result });
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Signup failed' });
        }
    };

    public getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const user = await this.authService.getCurrentUser(userId);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'User not found' });
        }
    };

    public updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const user = await this.authService.updateProfile(userId, req.body);
            res.status(200).json({ message: 'Profile updated successfully', user });
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Update failed' });
        }
    };

    public changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                res.status(400).json({ message: 'Old and new passwords are required' });
                return;
            }

            const result = await this.authService.changePassword(userId, oldPassword, newPassword);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Password change failed' });
        }
    };

    public logout = async (req: AuthRequest, res: Response): Promise<void> => {
        // For JWT, logout is typically handled client-side by removing the token
        // Here we just confirm the action
        res.status(200).json({ message: 'Logout successful' });
    };
}

