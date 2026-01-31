import { Request, Response } from 'express';
import { Model, Document } from 'mongoose';

export class ResourceFactoryController<T extends Document> {
    private model: Model<T>;
    private resourceName: string;

    constructor(model: Model<T>, resourceName: string) {
        this.model = model;
        this.resourceName = resourceName;
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            // Assume user is attached to req by auth middleware
            const userId = (req as any).user?.id || req.body.userId;

            if (!userId) {
                res.status(401).json({ message: 'Unauthorized: User ID missing' });
                return;
            }

            const newItem = await this.model.create({
                ...req.body,
                userId,
                postedAt: new Date()
            });

            res.status(201).json({ message: `${this.resourceName} created successfully`, data: newItem });
        } catch (error: any) {
            res.status(400).json({ message: `Failed to create ${this.resourceName}`, error: error.message });
        }
    };

    public getAll = async (req: Request, res: Response): Promise<void> => {
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

            // Salary range filtering (for jobs)
            if (req.query.minSalary || req.query.maxSalary) {
                // Note: This is a simple implementation. For production, you'd want to parse salary strings
                if (req.query.minSalary) {
                    query.salary = { $gte: req.query.minSalary };
                }
                if (req.query.maxSalary) {
                    query.salary = { ...query.salary, $lte: req.query.maxSalary };
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
                data: items,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error: any) {
            res.status(500).json({ message: `Failed to fetch ${this.resourceName}s`, error: error.message });
        }
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const item = await this.model.findById(req.params.id);
            if (!item) {
                res.status(404).json({ message: `${this.resourceName} not found` });
                return;
            }
            res.status(200).json(item);
        } catch (error: any) {
            // Handle invalid MongoDB ObjectId format
            if (error.name === 'CastError') {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }
            res.status(500).json({ message: `Failed to fetch ${this.resourceName}`, error: error.message });
        }
    };

    public getMyListings = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id || req.query.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const items = await this.model.find({ userId }).sort({ createdAt: -1 });

            res.status(200).json({
                data: items,
                pagination: {
                    page: 1,
                    limit: items.length,
                    total: items.length,
                    pages: 1
                }
            });
        } catch (error: any) {
            res.status(500).json({ message: `Failed to fetch your ${this.resourceName}s`, error: error.message });
        }
    };

    public update = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;

            // Find the item first to check ownership
            const item = await this.model.findById(req.params.id);

            if (!item) {
                res.status(404).json({ message: `${this.resourceName} not found` });
                return;
            }

            // Check ownership
            if (item.get('userId').toString() !== userId) {
                res.status(403).json({ message: 'You can only update your own listings' });
                return;
            }

            const updatedItem = await this.model.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            res.status(200).json({ message: `${this.resourceName} updated successfully`, data: updatedItem });
        } catch (error: any) {
            res.status(400).json({ message: `Failed to update ${this.resourceName}`, error: error.message });
        }
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;

            // Find the item first to check ownership
            const item = await this.model.findById(req.params.id);

            if (!item) {
                res.status(404).json({ message: `${this.resourceName} not found` });
                return;
            }

            // Check ownership
            if (item.get('userId').toString() !== userId) {
                res.status(403).json({ message: 'You can only delete your own listings' });
                return;
            }

            await this.model.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: `${this.resourceName} deleted successfully` });
        } catch (error: any) {
            res.status(500).json({ message: `Failed to delete ${this.resourceName}`, error: error.message });
        }
    };
}
