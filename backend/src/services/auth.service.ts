import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import JobSeeker from '../models/job-seeker.model';
import Recruiter from '../models/recruiter.model';
import ResourceProfile from '../models/resource-profile.model';
import { BadRequestError, UnauthorizedError, NotFoundError, ConflictError } from '../utils/errors';

export class AuthService {
    private secretKey = process.env.JWT_SECRET || 'secret';

    public async signup(userData: any) {
        const { email, password, role, ...profileData } = userData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ConflictError('An account with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser: any; // Using any to avoid complex Mongoose document type issues in try-catch scope
        try {
            newUser = await User.create({
                name: userData.name,
                email,
                password: hashedPassword,
                role,
                phoneNumber: userData.phoneNumber,
                profilePhoto: userData.profilePhoto?.name || userData.profilePhoto, // Handle File object or string
                profile: {
                    company: userData.company || userData.companyName // For employers/recruiters
                }
            });

            let profile;

            if (role === 'job-seeker' || role === 'employee') {
                // Handle potentially string inputs from frontend (especially in signup FormData)
                // Helper to parse potentially JSON-stringified array items from FormData
                const parseComplexField = (field: any) => {
                    if (typeof field === 'string') {
                        try {
                            const parsed = JSON.parse(field);
                            return Array.isArray(parsed) ? parsed : [parsed];
                        } catch (e) {
                            return [{ degree: field }]; // Fallback for simple string education
                        }
                    } else if (Array.isArray(field)) {
                        return field.map(item => {
                            if (typeof item === 'string') {
                                try { return JSON.parse(item); } catch (e) { return item; }
                            }
                            return item;
                        });
                    }
                    return field;
                };

                const parseExperience = (field: any) => {
                    if (typeof field === 'string') {
                        try {
                            const parsed = JSON.parse(field);
                            return Array.isArray(parsed) ? parsed : [parsed];
                        } catch (e) { // Logic for simple string/number input
                            return [{ role: String(field) + ' years' }];
                        }
                    } else if (typeof field === 'number') {
                        return [{ role: String(field) + ' years' }];
                    } else if (Array.isArray(field)) {
                        return field.map(item => {
                            if (typeof item === 'string') {
                                try { return JSON.parse(item); } catch (e) { return item; }
                            }
                            return item;
                        });
                    }
                    return field;
                };

                const education = parseComplexField(profileData.education);
                const experience = parseExperience(profileData.experience);

                profile = await JobSeeker.create({
                    userId: newUser._id,
                    education,
                    age: profileData.age,
                    experience,
                    interestedCompanies: profileData.interestedCompanies,
                    cv: profileData.cv?.name || profileData.cv,
                });
            } else if (role === 'recruiter' || role === 'employer') {
                profile = await Recruiter.create({
                    userId: newUser._id,
                    company: profileData.company || profileData.companyName, // Handle both
                    companyLogo: profileData.companyLogo?.name || profileData.companyLogo,
                    experience: String(profileData.experience),
                    username: profileData.username,
                });
            } else if (role === 'resource') {
                profile = await ResourceProfile.create({
                    userId: newUser._id,
                    organizationName: profileData.organizationName || profileData.company, // Frontend sends organizationName or company depending on exact form
                    category: profileData.category,
                    investorType: profileData.investorType,
                    tenderType: profileData.tenderType,
                    equipmentType: profileData.equipmentType,
                    machineryType: profileData.machineryType,
                    pmcType: profileData.pmcType,
                    csmType: profileData.csmType,
                    logisticsType: profileData.logisticsType,
                    vehicleType: profileData.vehicleType,
                    // Spread other potential fields
                    ...profileData,
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: newUser._id.toString(), role: newUser.role, email: newUser.email },
                this.secretKey,
                { expiresIn: '24h' as any }
            );

            // Construct the unified response
            const userResponse = newUser.toObject();
            delete userResponse.password;

            return {
                token,
                user: {
                    ...userResponse,
                    id: newUser._id,
                    // Flattened profile fields
                    ...(profile?.toObject() || {}),
                    // Helper fields from user model
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    // Preserved nested profile for backward compatibility
                    profile: {
                        ...profile?.toObject(),
                        id: profile?._id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role,
                    }
                }
            };
        } catch (error) {
            // Rollback: Delete user if profile creation failed to prevent orphan records
            if (newUser?._id) {
                console.error(`[AuthService] Signup failed. Rolling back user creation for: ${email}`);
                await User.findByIdAndDelete(newUser._id).catch(err =>
                    console.error(`[AuthService] CRITICAL: Failed to rollback user deletion for ${newUser._id}:`, err)
                );
            }
            throw error;
        }

    }

    public async login(credentials: any) {
        const { email, password } = credentials;
        // Check if user exists
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Check password
        // Check password
        const isMatch = await bcrypt.compare(password, user.password as string);

        if (!isMatch) {
            throw new UnauthorizedError('Invalid email or password');
        }

        let profile;
        if (user.role === 'employee') {
            profile = await JobSeeker.findOne({ userId: user._id });
        } else if (user.role === 'employer') {
            profile = await Recruiter.findOne({ userId: user._id });
        } else if (user.role === 'resource') {
            profile = await ResourceProfile.findOne({ userId: user._id });
        }

        const token = jwt.sign(
            { id: user._id.toString(), role: user.role, email: user.email },
            this.secretKey,
            { expiresIn: '24h' as any }
        );

        const userResponse = user.toObject();
        delete userResponse.password;

        const unifiedUser = {
            ...userResponse,
            id: user._id,
            profile: {
                ...profile?.toObject() || {},
                id: profile?._id,
                name: user.name,
                email: user.email,
                role: user.role,
                interviewSuccessRate: user.interviewSuccessRate,
                walletBalance: user.walletBalance,
                subscriptionExpiry: user.subscriptionExpiry,
            }
        };

        return {
            token,
            user: {
                ...unifiedUser,
                // Flattened profile fields
                ...(profile?.toObject() || {}),
                profile: unifiedUser.profile // Ensure nested profile is kept
            }
        };

    }

    public async getCurrentUser(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        let profile;
        if (user.role === 'employee') {
            profile = await JobSeeker.findOne({ userId: user._id });
        } else if (user.role === 'employer') {
            profile = await Recruiter.findOne({ userId: user._id });
        } else if (user.role === 'resource') {
            profile = await ResourceProfile.findOne({ userId: user._id });
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        return {
            ...userResponse,
            id: user._id,
            // Flattened profile fields
            ...(profile?.toObject() || {}),
            profile: {
                ...profile?.toObject() || {},
                id: profile?._id,
                name: user.name,
                email: user.email,
                role: user.role,
                interviewSuccessRate: user.interviewSuccessRate,
                walletBalance: user.walletBalance,
                subscriptionExpiry: user.subscriptionExpiry,
            }
        };

    }

    public async updateProfile(userId: string, updateData: any) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Update User fields
        const userUpdates: any = {};
        if (updateData.name) userUpdates.name = updateData.name;
        if (updateData.phoneNumber) userUpdates.phoneNumber = updateData.phoneNumber;
        if (updateData.profilePhoto) userUpdates.profilePhoto = updateData.profilePhoto;

        if (Object.keys(userUpdates).length > 0) {
            await User.findByIdAndUpdate(userId, userUpdates);
        }

        // Update role-specific profile
        let profile;
        if (user.role === 'employee') {
            const profileUpdates: any = {};
            if (updateData.education) profileUpdates.education = updateData.education;
            if (updateData.age) profileUpdates.age = updateData.age;
            if (updateData.experience) profileUpdates.experience = updateData.experience;
            if (updateData.interestedCompanies) profileUpdates.interestedCompanies = updateData.interestedCompanies;
            if (updateData.cv) profileUpdates.cv = updateData.cv;

            profile = await JobSeeker.findOneAndUpdate(
                { userId },
                profileUpdates,
                { new: true }
            );
        } else if (user.role === 'employer') {
            const profileUpdates: any = {};
            if (updateData.company) profileUpdates.company = updateData.company;
            if (updateData.companyLogo) profileUpdates.companyLogo = updateData.companyLogo;
            if (updateData.experience) profileUpdates.experience = updateData.experience;

            profile = await Recruiter.findOneAndUpdate(
                { userId },
                profileUpdates,
                { new: true }
            );
        } else if (user.role === 'resource') {
            profile = await ResourceProfile.findOneAndUpdate(
                { userId },
                updateData,
                { new: true }
            );
        }

        return this.getCurrentUser(userId);
    }

    public async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password as string);
        if (!isMatch) {
            throw new UnauthorizedError('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        return { message: 'Password changed successfully' };
    }

    public async forgotPassword(email: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError('User with this email does not exist');
        }

        // Generate reset token
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpires = Date.now() + 3600000; // 1 hour

        // Save to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(resetPasswordExpires);
        await user.save();

        // Send email
        const { EmailService } = require('./email.service');
        const emailService = new EmailService();
        const emailSent = await emailService.sendPasswordResetEmail(user.email, resetToken);

        if (!emailSent) {
            throw new Error('Failed to send password reset email. Please try again later.');
        }

        return { message: 'Password reset email sent' };
    }

    public async resetPassword(token: string, newPassword: string) {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new BadRequestError('Password reset token is invalid or has expired');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return { message: 'Password has been reset successfully' };
    }
}
