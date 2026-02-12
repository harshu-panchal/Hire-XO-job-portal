import { Request, Response } from 'express';
import { Model, Document } from 'mongoose';
import Investor from '../models/investor.model';
import Tender from '../models/tender.model';
import Equipment from '../models/equipment.model';
import Machinery from '../models/machinery.model';
import PMC from '../models/pmc.model';
import CSM from '../models/csm.model';
import Logistics from '../models/logistics.model';
import Vehicle from '../models/vehicle.model';
import User from '../models/user.model';

const resourceModels: { [key: string]: Model<any> } = {
    'investors': Investor,
    'tenders': Tender,
    'equipments': Equipment,
    'machinery': Machinery,
    'pmc': PMC,
    'csm': CSM,
    'logistics': Logistics,
    'vehicles': Vehicle
};

export class AdminResourceController {

    private getModel(category: string): Model<any> | null {
        return resourceModels[category.toLowerCase()] || null;
    }

    public getAllResources = async (req: Request, res: Response): Promise<void> => {
        try {
            const { category } = req.params;
            const model = this.getModel(category);

            if (!model) {
                res.status(400).json({ success: false, message: 'Invalid resource category' });
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const skip = (page - 1) * limit;
            const search = req.query.search as string;

            const query: any = {};
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { company: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            // Status filter if model supports it (we will add it)
            if (req.query.status) {
                query.status = req.query.status;
            }

            const items = await model.find(query)
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await model.countDocuments(query);

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
            res.status(500).json({ success: false, message: error.message });
        }
    };

    public updateResource = async (req: Request, res: Response): Promise<void> => {
        try {
            const { category, id } = req.params;
            const model = this.getModel(category);

            if (!model) {
                res.status(400).json({ success: false, message: 'Invalid resource category' });
                return;
            }

            const updatedItem = await model.findByIdAndUpdate(
                id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!updatedItem) {
                res.status(404).json({ success: false, message: 'Resource not found' });
                return;
            }

            res.status(200).json({ success: true, message: 'Resource updated successfully', data: updatedItem });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public deleteResource = async (req: Request, res: Response): Promise<void> => {
        try {
            const { category, id } = req.params;
            const model = this.getModel(category);

            if (!model) {
                res.status(400).json({ success: false, message: 'Invalid resource category' });
                return;
            }

            // Here we should also handle file deletion from Cloudinary if applicable
            // For now, we just delete the record

            const deletedItem = await model.findByIdAndDelete(id);

            if (!deletedItem) {
                res.status(404).json({ success: false, message: 'Resource not found' });
                return;
            }

            res.status(200).json({ success: true, message: 'Resource deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    };
}

export const adminResourceController = new AdminResourceController();
