import Recruiter from '../models/recruiter.model';
import User from '../models/user.model';

export class RecruiterService {
    public async getProfile(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const recruiterProfile = await Recruiter.findOne({ userId });
        if (!recruiterProfile) {
            throw new Error('Recruiter profile not found');
        }

        return {
            ...user.toObject(),
            recruiterProfile: recruiterProfile.toObject()
        };
    }

    public async updateProfile(userId: string, data: any) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Update user fields
        if (data.name) user.name = data.name;
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber;
        if (data.profilePhoto) user.profilePhoto = data.profilePhoto;
        await user.save();

        // Update recruiter profile
        const recruiterProfile = await Recruiter.findOne({ userId });
        if (recruiterProfile) {
            if (data.company) recruiterProfile.company = data.company;
            if (data.companyLogo) recruiterProfile.companyLogo = data.companyLogo;
            if (data.experience !== undefined) recruiterProfile.experience = data.experience;
            await recruiterProfile.save();
        }

        return {
            ...user.toObject(),
            recruiterProfile: recruiterProfile?.toObject()
        };
    }
}
