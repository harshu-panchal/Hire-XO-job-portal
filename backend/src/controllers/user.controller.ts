import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import User from '../models/user.model';
import Job from '../models/job.model';
import JobApplication from '../models/job-application.model';
import ResourceApplication from '../models/resource-application.model';
import { CloudinaryUtil } from '../utils/cloudinary';


export class UserController {
    /**
     * Aggregates stats for the user dashboard
     * GET /api/users/stats
     */
    public getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }

            // Count applications (both job and resource)
            const jobAppsCount = await JobApplication.countDocuments({ applicantId: userId });
            const resourceAppsCount = await ResourceApplication.countDocuments({ applicantId: userId });

            // Count jobs posted by this user
            const activeJobsCount = await Job.countDocuments({ userId });

            res.status(200).json({
                success: true,
                stats: {
                    totalApplications: jobAppsCount + resourceAppsCount,
                    activeJobs: activeJobsCount,
                    walletBalance: user.walletBalance || 0
                }
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Internal server error' });
        }
    };

    /**
     * Dedicated profile photo upload
     * PATCH /api/users/profile-photo
     */
    public updateProfilePhoto = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }

            // Upload to Cloudinary
            const result = await CloudinaryUtil.uploadFile(req.file.path, 'profile-photos');

            if (!result) {
                res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
                return;
            }

            // Update user model with Cloudinary URL
            await User.findByIdAndUpdate(userId, { profilePhoto: result.url });

            res.status(200).json({
                success: true,
                message: 'Profile photo updated successfully',
                url: result.url
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Upload failed' });
        }
    };

    /**
     * Add a resource to user bookmarks
     * POST /api/resources/:id/bookmark
     */
    public addBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const { id: resourceId } = req.params;

            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            // Add resourceId to bookmarks if not already present
            await User.findByIdAndUpdate(userId, {
                $addToSet: { bookmarks: resourceId }
            });

            res.status(200).json({
                success: true,
                message: 'Resource bookmarked successfully'
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Bookmarking failed' });
        }
    };

    /**
     * Remove a resource from user bookmarks
     * DELETE /api/resources/:id/bookmark
     */
    public removeBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const { id: resourceId } = req.params;

            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            // Remove resourceId from bookmarks
            await User.findByIdAndUpdate(userId, {
                $pull: { bookmarks: resourceId }
            });

            res.status(200).json({
                success: true,
                message: 'Resource removed from bookmarks'
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Removal failed' });
        }
    };
}


