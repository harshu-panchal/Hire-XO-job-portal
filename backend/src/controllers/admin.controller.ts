import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AuditService } from '../services/audit.service';
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
import Transaction from '../models/transaction.model';
import bcrypt from 'bcryptjs';
import JobSeeker from '../models/job-seeker.model';
import Recruiter from '../models/recruiter.model';
import ResourceProfile from '../models/resource-profile.model';

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
            if (role && ['job-seeker', 'recruiter', 'resource', 'admin', 'employee', 'employer'].includes(role as string)) {
                if (role === 'recruiter' || role === 'employer') {
                    query.role = { $in: ['recruiter', 'employer'] };
                } else if (role === 'job-seeker' || role === 'employee') {
                    query.role = { $in: ['job-seeker', 'employee'] };
                } else {
                    query.role = role;
                }
            }

            // Filter by status (if we add status field)
            if (status) {
                query.status = status;
            }

            // Search by name or email
            if (search) {
                query.$or = [
                    { name: { $regex: search as string, $options: 'i' } },
                    { email: { $regex: search as string, $options: 'i' } }
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

            // Audit Log
            if ((req as AuthRequest).user) {
                await AuditService.logAction(
                    (req as AuthRequest).user!.id,
                    'UPDATE_USER_STATUS',
                    'User',
                    id,
                    { status, reason }
                );
            }

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
     * Update user details (admin override)
     * PUT /api/admin/users/:id
     */
    public updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { name, email, company, phoneNumber, profile } = req.body;

            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            // Update basic fields
            if (name) user.name = name;
            if (email) user.email = email;
            if (phoneNumber) user.phoneNumber = phoneNumber;

            // Update profile fields if provided
            if (company) {
                if (!user.profile) user.profile = {};
                user.profile.company = company;
            }

            if (profile) {
                user.profile = { ...user.profile, ...profile };
            }

            // Also keep top-level fields in profile for compatibility if they were passed separately
            if (company) {
                if (!user.profile) user.profile = {};
                user.profile.company = company;
            }

            // Role-specific profile updates for persistence across models
            const profileUpdate = { ...user.profile, name: user.name, email: user.email, phoneNumber: user.phoneNumber };

            if (user.role === 'employee' || user.role === 'job-seeker') {
                await JobSeeker.findOneAndUpdate(
                    { userId: user._id },
                    { $set: profileUpdate },
                    { upsert: true }
                );
            } else if (user.role === 'employer' || user.role === 'recruiter') {
                await Recruiter.findOneAndUpdate(
                    { userId: user._id },
                    { $set: profileUpdate },
                    { upsert: true }
                );
            } else if (user.role === 'resource') {
                await ResourceProfile.findOneAndUpdate(
                    { userId: user._id },
                    { $set: profileUpdate },
                    { upsert: true }
                );
            }

            await user.save();

            // Audit Log
            if ((req as AuthRequest).user) {
                await AuditService.logAction(
                    (req as AuthRequest).user!.id,
                    'UPDATE_USER_DETAILS',
                    'User',
                    id,
                    { name, email }
                );
            }

            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: user
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to update user',
                error: error.message
            });
        }
    };

    /**
     * Create a new user (admin only)
     * POST /api/admin/users
     */
    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password, role, phoneNumber, profile, status, company } = req.body;

            // Basic validation
            if (!name || !email || !role) {
                res.status(400).json({
                    success: false,
                    message: 'Name, email, and role are required'
                });
                return;
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(409).json({
                    success: false,
                    message: 'User with this email already exists'
                });
                return;
            }

            // Create new user
            const hashedPassword = await bcrypt.hash(password || 'Password123!', 10);

            // Merge company into profile if provided at top level
            const userProfile = { ...profile };
            if (company && !userProfile.company) {
                userProfile.company = company;
            }

            const user = new User({
                name,
                email,
                password: hashedPassword,
                role,
                phoneNumber,
                status: status || 'active',
                profile: userProfile
            });

            await user.save();

            // Create associated profile based on role
            const profileData = {
                userId: user._id,
                name,
                email,
                phoneNumber,
                ...userProfile
            };

            if (role === 'job-seeker' || role === 'employee') {
                await JobSeeker.create(profileData);
            } else if (role === 'employer' || role === 'recruiter') {
                await Recruiter.create(profileData);
            } else if (role === 'resource') {
                await ResourceProfile.create({
                    ...profileData,
                    category: userProfile?.category || 'Investor',
                    organizationName: userProfile?.organizationName || name
                });
            }

            // Audit Log
            if ((req as AuthRequest).user) {
                await AuditService.logAction(
                    (req as AuthRequest).user!.id,
                    'CREATE_USER',
                    'User',
                    user._id.toString(),
                    { name, email, role }
                );
            }

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to create user',
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

            // Revenue from subscriptions (sum of completed topups)
            const totalRevenue = await Transaction.aggregate([
                { $match: { type: 'topup', status: 'completed' } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
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

            // --- Extended Stats for Dashboard ---
            const { range = '180' } = req.query;
            const days = parseInt(range as string);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            // Grouping logic: if range <= 31 days, group by day. Otherwise by month.
            const groupByDay = days <= 31;

            const revenueStats = await Transaction.aggregate([
                {
                    $match: {
                        type: 'topup',
                        status: 'completed',
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: groupByDay
                            ? { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }
                            : { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                        total: { $sum: "$amount" }
                    }
                },
                { $sort: groupByDay ? { "_id.year": 1, "_id.month": 1, "_id.day": 1 } : { "_id.year": 1, "_id.month": 1 } }
            ]);

            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const revenueData = revenueStats.map((stat: any) => ({
                name: groupByDay ? `${stat._id.day} ${monthNames[stat._id.month - 1]}` : monthNames[stat._id.month - 1],
                value: stat.total
            }));

            // 3. User Growth Data
            const userGrowthStats = await User.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: groupByDay
                            ? { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }
                            : { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: groupByDay ? { "_id.year": 1, "_id.month": 1, "_id.day": 1 } : { "_id.year": 1, "_id.month": 1 } }
            ]);

            const userGrowthData = userGrowthStats.map((stat: any) => ({
                name: groupByDay ? `${stat._id.day} ${monthNames[stat._id.month - 1]}` : monthNames[stat._id.month - 1],
                users: stat.count
            }));

            // 4. Top Employers (by Job count)
            const topEmployersData = await Job.aggregate([
                {
                    $group: {
                        _id: "$company",
                        jobs: { $sum: 1 }
                    }
                },
                { $sort: { jobs: -1 } },
                { $limit: 5 }
            ]);

            // Map top employers to match current UI structure (needs name, jobs, hires - hires hardcoded or calculated if possible)
            // Since we don't track 'hires' easily without scanning applications, we will just use jobs count.
            const topEmployers = topEmployersData.map((e: any) => ({
                name: e._id || 'Unknown',
                jobs: e.jobs,
                hires: 0 // Placeholder
            }));

            // Recent Activity
            const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name createdAt role');
            const recentJobs = await Job.find().sort({ postedAt: -1 }).limit(5).select('title company postedAt');

            let activities = [
                ...recentUsers.map(u => ({
                    id: u._id,
                    action: `New ${u.role === 'employer' ? 'Employer' : 'Job Seeker'} Registration`,
                    user: u.name,
                    time: u.createdAt
                })),
                ...recentJobs.map(j => ({
                    id: j._id,
                    action: `New Job Posted: ${j.title}`,
                    user: j.company,
                    time: j.postedAt
                }))
            ];

            activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
            activities = activities.slice(0, 5);


            res.status(200).json({
                success: true,
                stats: {
                    users: {
                        total: userStats.reduce((sum, item) => sum + item.count, 0),
                        byRole: {
                            'job-seeker': (usersByRole['job-seeker'] || 0) + (usersByRole['employee'] || 0),
                            'recruiter': (usersByRole['recruiter'] || 0) + (usersByRole['employer'] || 0),
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
                    },
                    charts: {
                        revenue: revenueData,
                        userGrowth: userGrowthData
                    },
                    recentActivity: activities,
                    topEmployers
                }
            });
        } catch (error: any) {
            console.error('Stats error:', error);
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

    /**
     * Get all transactions
     * GET /api/admin/transactions
     */
    public getAllTransactions = async (req: Request, res: Response): Promise<void> => {
        try {
            const { search, status, type, page = '1', limit = '20' } = req.query;
            const query: any = {};

            if (status) query.status = status;
            if (type) query.type = type;

            if (search) {
                const searchStr = search as string;
                const userQuery = {
                    $or: [
                        { name: { $regex: searchStr, $options: 'i' } },
                        { email: { $regex: searchStr, $options: 'i' } }
                    ]
                };
                const users = await User.find(userQuery).select('_id');
                const userIds = users.map(u => u._id);

                query.$or = [
                    { description: { $regex: searchStr, $options: 'i' } },
                    { userId: { $in: userIds } }
                ];
                if (searchStr.match(/^[0-9a-fA-F]{24}$/)) {
                    query.$or.push({ _id: searchStr });
                }
            }

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);
            const skip = (pageNum - 1) * limitNum;

            const transactions = await Transaction.find(query)
                .populate('userId', 'name email profile.company')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum);

            const total = await Transaction.countDocuments(query);

            res.status(200).json({
                success: true,
                data: transactions,
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
                message: 'Failed to fetch transactions',
                error: error.message
            });
        }
    };

    /**
     * Get resources by category
     * GET /api/admin/resources/:category
     */
    public getResources = async (req: Request, res: Response): Promise<void> => {
        try {
            const { category } = req.params;
            const { page = '1', limit = '20', search } = req.query;

            const modelMap: any = {
                'investors': Investor,
                'tenders': Tender,
                'equipments': Equipment,
                'machinery': Machinery,
                'pmc': PMC,
                'csm': CSM,
                'logistics': Logistics,
                'vehicles': Vehicle
            };

            const Model = modelMap[category.toLowerCase()];
            if (!Model) {
                res.status(400).json({ success: false, message: 'Invalid category' });
                return;
            }

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);
            const skip = (pageNum - 1) * limitNum;

            const query: any = {};
            if (search) {
                // Generic search across common fields
                query.$or = [
                    { company: { $regex: search as string, $options: 'i' } },
                    { title: { $regex: search as string, $options: 'i' } },
                    { location: { $regex: search as string, $options: 'i' } },
                    { description: { $regex: search as string, $options: 'i' } }
                ];
            }

            const [items, total] = await Promise.all([
                Model.find(query)
                    .populate('userId', 'name email phoneNumber')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limitNum),
                Model.countDocuments(query)
            ]);

            res.status(200).json({
                success: true,
                data: items,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    /**
     * Update resource
     * PUT /api/admin/resources/:category/:id
     */
    public updateResource = async (req: Request, res: Response): Promise<void> => {
        try {
            const { category, id } = req.params;
            const updateData = req.body;
            const modelMap: any = {
                'investors': Investor,
                'tenders': Tender,
                'equipments': Equipment,
                'machinery': Machinery,
                'pmc': PMC,
                'csm': CSM,
                'logistics': Logistics,
                'vehicles': Vehicle
            };

            const Model = modelMap[category.toLowerCase()];
            if (!Model) {
                res.status(400).json({ success: false, message: 'Invalid category' });
                return;
            }

            const item = await Model.findByIdAndUpdate(id, updateData, { new: true });
            if (!item) {
                res.status(404).json({ success: false, message: 'Resource not found' });
                return;
            }

            res.status(200).json({ success: true, message: 'Resource updated successfully', data: item });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    /**
     * Delete resource
     * DELETE /api/admin/resources/:category/:id
     */
    public deleteResource = async (req: Request, res: Response): Promise<void> => {
        try {
            const { category, id } = req.params;
            const modelMap: any = {
                'investors': Investor,
                'tenders': Tender,
                'equipments': Equipment,
                'machinery': Machinery,
                'pmc': PMC,
                'csm': CSM,
                'logistics': Logistics,
                'vehicles': Vehicle
            };

            const Model = modelMap[category.toLowerCase()];
            if (!Model) {
                res.status(400).json({ success: false, message: 'Invalid category' });
                return;
            }

            const item = await Model.findByIdAndDelete(id);
            if (!item) {
                res.status(404).json({ success: false, message: 'Resource not found' });
                return;
            }

            // Audit Log
            if ((req as AuthRequest).user) {
                await AuditService.logAction(
                    (req as AuthRequest).user!.id,
                    'DELETE_RESOURCE',
                    category,
                    id,
                    { category }
                );
            }

            res.status(200).json({ success: true, message: 'Resource deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    };
}
