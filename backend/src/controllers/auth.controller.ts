import { Request, Response } from 'express';
import { CloudinaryUtil } from '../utils/cloudinary';
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
            console.log('[DEBUG] Signup Request Body:', req.body);
            console.log('[DEBUG] Signup Request Files:', req.files ? 'Files present' : 'No files');

            const userData = { ...req.body };
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (files) {
                // Handle Company Logo
                if (files.companyLogo?.[0]) {
                    const result = await CloudinaryUtil.uploadFile(files.companyLogo[0].path, 'company-logos');
                    if (result) userData.companyLogo = result.url;
                }

                // Handle Profile Photo
                if (files.profilePhoto?.[0]) {
                    const result = await CloudinaryUtil.uploadFile(files.profilePhoto[0].path, 'profile-photos');
                    if (result) userData.profilePhoto = result.url;
                }

                // Handle CV
                if (files.cv?.[0]) {
                    const result = await CloudinaryUtil.uploadFile(files.cv[0].path, 'cvs');
                    if (result) userData.cv = result.url;
                }
            }

            const result = await this.authService.signup(userData);
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
            res.status(200).json({ user });
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

    public forgotPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ message: 'Email is required' });
                return;
            }

            const result = await this.authService.forgotPassword(email);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Forgot password request failed' });
        }
    };

    public resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                res.status(400).json({ message: 'Token and new password are required' });
                return;
            }

            const result = await this.authService.resetPassword(token, newPassword);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Reset password failed' });
        }
    };
}

