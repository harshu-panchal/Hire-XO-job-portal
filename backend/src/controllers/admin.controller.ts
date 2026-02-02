import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import User from '../models/user.model';
import Job from '../models/job.model';
import JobApplication from '../models/job-application.model';
import ResourceApplication from '../models/resource-application.model';
import SubscriptionPlan from '../models/subscription-plan.model';
import Investor from '../models/investor.model';
import Tender from '../models/tender.model';
import Equipment from '../models/equipment.model';
import Machinery from '../models/machinery.model';
import PMC from '../models/pmc.model';
import CSM from '../models/csm.model';
import Logistics from '../models/logistics.model';
import Vehicle from '../models/vehicle.model';

export class AdminController {
    /**
     * Get all users with filtering and pagination
     * GET /api/admin/users?role=recruiter&status=active&page=1&limit=20
     */
    public getUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const { role, status, search, page = '1', limit = '20' } = req.query;

            const query: any = {};

            // Filter by role
            if (role && ['job-seeker', 'recruiter', 'resource', 'admin'].includes(role as string)) {
                query.role = role;
            }

            // Filter by status (if we add status field)
            if (status) {
                query.status = status;
            }

            // Search by name or email
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);
            const skip = (pageNum - 1) * limitNum;

            const users = await User.find(query)
                .select('-password') // Exclude password
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum);

            const total = await User.countDocuments(query);

            res.status(200).json({
                success: true,
                data: users,
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
                message: 'Failed to fetch users',
                error: error.message
            });
        }
    };

    /**
     * Update user status (verify, suspend, ban)
     * PATCH /api/admin/users/:id/status
     * Body: { status: 'active' | 'suspended' | 'banned', reason?: string }
     */
    public updateUserStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { status, reason } = req.body;

            if (!['active', 'suspended', 'banned'].includes(status)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be: active, suspended, or banned'
                });
                return;
            }

            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            // Update user status
            const updatedUser = await User.findByIdAndUpdate(
                id,
                {
                    status,
                    statusReason: reason || '',
                    statusUpdatedAt: new Date()
                },
                { new: true }
            ).select('-password');

            // TODO: Add audit log entry here

            res.status(200).json({
                success: true,
                message: `User status updated to ${status}`,
                data: updatedUser
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to update user status',
                error: error.message
            });
        }
    };

    /**
     * Get system-wide statistics
     * GET /api/admin/stats
     */
    public getSystemStats = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            // Count users by role
            const userStats = await User.aggregate([
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Total jobs
            const totalJobs = await Job.countDocuments();
            const activeJobs = await Job.countDocuments({ status: { $ne: 'closed' } });

            // Total applications
            const jobApplications = await JobApplication.countDocuments();
            const resourceApplications = await ResourceApplication.countDocuments();

            // Revenue from subscriptions (sum of wallet recharges or subscription purchases)
            const totalRevenue = await User.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$walletBalance' }
                    }
                }
            ]);

            // Resources posted per category
            const investorCount = await Investor.countDocuments();
            const tenderCount = await Tender.countDocuments();
            const equipmentCount = await Equipment.countDocuments();
            const machineryCount = await Machinery.countDocuments();
            const pmcCount = await PMC.countDocuments();
            const csmCount = await CSM.countDocuments();
            const logisticsCount = await Logistics.countDocuments();
            const vehicleCount = await Vehicle.countDocuments();

            const usersByRole = userStats.reduce((acc: any, item: any) => {
                acc[item._id] = item.count;
                return acc;
            }, {});

            res.status(200).json({
                success: true,
                stats: {
                    users: {
                        total: userStats.reduce((sum, item) => sum + item.count, 0),
                        byRole: {
                            'job-seeker': usersByRole['job-seeker'] || 0,
                            'recruiter': usersByRole['recruiter'] || 0,
                            'resource': usersByRole['resource'] || 0,
                            'admin': usersByRole['admin'] || 0
                        }
                    },
                    jobs: {
                        total: totalJobs,
                        active: activeJobs
                    },
                    applications: {
                        jobs: jobApplications,
                        resources: resourceApplications,
                        total: jobApplications + resourceApplications
                    },
                    revenue: {
                        total: totalRevenue[0]?.total || 0
                    },
                    resources: {
                        investors: investorCount,
                        tenders: tenderCount,
                        equipments: equipmentCount,
                        machinery: machineryCount,
                        pmc: pmcCount,
                        csm: csmCount,
                        logistics: logisticsCount,
                        vehicles: vehicleCount,
                        total: investorCount + tenderCount + equipmentCount + machineryCount +
                            pmcCount + csmCount + logisticsCount + vehicleCount
                    }
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch system statistics',
                error: error.message
            });
        }
    };

    /**
     * Delete user (soft delete)
     * DELETE /api/admin/users/:id
     */
    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            // Soft delete by setting status to 'deleted'
            await User.findByIdAndUpdate(id, {
                status: 'deleted',
                deletedAt: new Date()
            });

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete user',
                error: error.message
            });
        }
    };
}
