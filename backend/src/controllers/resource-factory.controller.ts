import { Request, Response } from 'express';
import { Model, Document } from 'mongoose';

export class ResourceFactoryController<T extends Document> {
    private model: Model<T>;
    private resourceName: string;
    private fileFields: string[];

    constructor(model: Model<T>, resourceName: string, fileFields: string[] = []) {
        this.model = model;
        this.resourceName = resourceName;
        this.fileFields = fileFields;
    }

    public create = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            // Assume user is attached to req by auth middleware
            const userId = (req as any).user?.id || req.body.userId;

            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized: User ID missing' });
                return;
            }

            // Fetch user to get company name
            const User = require('../models/user.model').default;
            const user = await User.findById(userId);

            const newItem = await this.model.create({
                ...req.body,
                userId,
                company: user?.profile?.company || user?.company || 'Confidential',
                postedAt: new Date()
            });

            res.status(201).json({ success: true, message: `${this.resourceName} created successfully`, data: newItem });
        } catch (error: any) {
            next(error);
        }
    };

    public getAll = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            // Build query filters
            const query: any = {};

            // Search by keyword (title, description, company)
            if (req.query.search) {
                query.$or = [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } },
                    { company: { $regex: req.query.search, $options: 'i' } }
                ];
            }

            // Filter by location
            if (req.query.location) {
                query.location = { $regex: req.query.location, $options: 'i' };
            }

            // Filter by type
            if (req.query.type) {
                query.type = req.query.type;
            }

            // Filter by category (for resources)
            if (req.query.category) {
                query.category = req.query.category;
            }

            // Salary range filtering (for jobs/resources)
            if (req.query.minSalary || req.query.maxSalary) {
                const min = req.query.minSalary ? Number(req.query.minSalary) : undefined;
                const max = req.query.maxSalary ? Number(req.query.maxSalary) : undefined;

                if ((min && !isNaN(min)) || (max && !isNaN(max))) {
                    query.salary = {};
                    if (min && !isNaN(min)) query.salary.$gte = min;
                    if (max && !isNaN(max)) query.salary.$lte = max;
                }
            }


            // Sorting
            let sortOption: any = { createdAt: -1 }; // Default: newest first
            if (req.query.sort === 'oldest') {
                sortOption = { createdAt: 1 };
            } else if (req.query.sort === 'title') {
                sortOption = { title: 1 };
            }

            // Pagination
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const skip = (page - 1) * limit;

            const items = await this.model.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(limit);

            const total = await this.model.countDocuments(query);

            res.status(200).json({
                success: true,
                data: items,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error: any) {
            next(error);
        }
    };

    public getById = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const item = await this.model.findById(req.params.id);
            if (!item) {
                res.status(404).json({ success: false, message: `${this.resourceName} not found` });
                return;
            }
            res.status(200).json({ success: true, data: item });
        } catch (error: any) {
            next(error);
        }
    };

    public getMyListings = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = (req as any).user?.id || req.query.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const skip = (page - 1) * limit;

            const items = await this.model.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await this.model.countDocuments({ userId });

            res.status(200).json({
                success: true,
                data: items,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error: any) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = (req as any).user?.id;

            // Find the item first to check ownership
            const item = await this.model.findById(req.params.id);

            if (!item) {
                res.status(404).json({ success: false, message: `${this.resourceName} not found` });
                return;
            }

            // Check ownership
            if (item.get('userId').toString() !== userId) {
                res.status(403).json({ success: false, message: 'You can only update your own listings' });
                return;
            }

            const updatedItem = await this.model.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            res.status(200).json({ success: true, message: `${this.resourceName} updated successfully`, data: updatedItem });
        } catch (error: any) {
            next(error);
        }
    };

    public delete = async (req: Request, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = (req as any).user?.id;

            // Find the item first to check ownership
            const item = await this.model.findById(req.params.id);

            if (!item) {
                res.status(404).json({ success: false, message: `${this.resourceName} not found` });
                return;
            }

            // Check ownership
            if (item.get('userId').toString() !== userId) {
                res.status(403).json({ success: false, message: 'You can only delete your own listings' });
                return;
            }

            // Cleanup associated files from Cloudinary
            if (this.fileFields && this.fileFields.length > 0) {
                const { CloudinaryUtil } = require('../utils/cloudinary');

                for (const field of this.fileFields) {
                    const value = item.get(field);

                    if (Array.isArray(value)) {
                        // Handle array of URLs (e.g. images)
                        for (const url of value) {
                            if (typeof url === 'string') {
                                const publicId = CloudinaryUtil.extractPublicIdFromUrl(url);
                                if (publicId) {
                                    await CloudinaryUtil.deleteFile(publicId);
                                }
                            }
                        }
                    } else if (typeof value === 'string') {
                        // Handle single URL
                        const publicId = CloudinaryUtil.extractPublicIdFromUrl(value);
                        if (publicId) {
                            await CloudinaryUtil.deleteFile(publicId);
                        }
                    }
                }
            }

            await this.model.findByIdAndDelete(req.params.id);
            res.status(200).json({ success: true, message: `${this.resourceName} deleted successfully` });
        } catch (error: any) {
            next(error);
        }
    };
}
