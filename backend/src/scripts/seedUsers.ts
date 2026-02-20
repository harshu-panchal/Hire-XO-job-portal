import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { connectDB } from '../config/database';
import User from '../models/user.model';
import JobSeeker from '../models/job-seeker.model';
import Recruiter from '../models/recruiter.model';
import ResourceProfile from '../models/resource-profile.model';

const USERS = [
    // Employee
    {
        email: 'employee@example.com',
        password: 'password123',
        role: 'employee',
        name: 'John Doe',
        profile: {
            education: [{ school: 'MIT', degree: 'CS', period: '2015-2019' }],
            experience: [{ company: 'Tech Corp', role: 'Developer', period: '2020-2023' }],
            skills: ['React', 'Node.js']
        }
    },
    // Employer
    {
        email: 'employer@example.com',
        password: 'password123',
        role: 'employer',
        name: 'Jane Smith',
        profile: {
            company: 'Tech Solutions',
            description: 'Leading tech company',
            website: 'https://techsolutions.com'
        }
    },
    // Resources - Investor
    {
        email: 'investor.give@example.com',
        password: 'password123',
        role: 'resource',
        name: 'Investor Give',
        profile: {
            organizationName: 'Invest Corp',
            category: 'Investor',
            investorType: 'want-to-invest',
            investmentAmount: '1000000',
            investmentSector: ['Tech', 'Health']
        }
    },
    {
        email: 'investor.get@example.com',
        password: 'password123',
        role: 'resource',
        name: 'Investor Get',
        profile: {
            organizationName: 'Startup Inc',
            category: 'Investor',
            investorType: 'want-investment',
            investmentAmount: '500000',
            investmentSector: ['AI']
        }
    },
    // Resources - Tender
    {
        email: 'tender.give@example.com',
        password: 'password123',
        role: 'resource',
        name: 'Tender Provider',
        profile: {
            organizationName: 'Gov Body',
            category: 'Tender',
            tenderType: 'provide-tenders',
            tenderValue: '100000-500000'
        }
    },
    {
        email: 'tender.get@example.com',
        password: 'password123',
        role: 'resource',
        name: 'Tender Applicant',
        profile: {
            organizationName: 'Construction Co',
            category: 'Tender',
            tenderType: 'apply-for-tenders'
        }
    },
    // Resources - Equipment
    {
        email: 'equipment.give@example.com',
        password: 'password123',
        role: 'resource',
        name: 'Equipment Rental',
        profile: {
            organizationName: 'Rent All',
            category: 'Equipment',
            equipmentType: 'rent-out-equipment',
            equipmentTypes: ['Excavator', 'Bulldozer']
        }
    },
    {
        email: 'equipment.get@example.com',
        password: 'password123',
        role: 'resource',
        name: 'Equipment User',
        profile: {
            organizationName: 'Build It',
            category: 'Equipment',
            equipmentType: 'rent-equipment',
            equipmentTypes: ['Crane']
        }
    },
    // Resources - Machinery
    {
        email: 'machinery.give@example.com',
        password: 'password123',
        role: 'resource',
        name: 'Machinery Supplier',
        profile: {
            organizationName: 'Machine World',
            category: 'Machinery',
            machineryType: 'provide-machinery',
            machineryTypes: ['Lathe', 'CNC']
        }
    },
    {
        email: 'machinery.get@example.com',
        password: 'password123',
        role: 'resource',
        name: 'Machinery User',
        profile: {
            organizationName: 'Fab Lab',
            category: 'Machinery',
            machineryType: 'need-machinery',
            machineryTypes: ['3D Printer']
        }
    },
    // Resources - PMC
    {
        email: 'pmc.give@example.com',
        password: 'password123',
        role: 'resource',
        name: 'PMC Firm',
        profile: {
            organizationName: 'Manage Pro',
            category: 'PMC',
            pmcType: 'offer-pmc-services',
            projectExperience: 10
        }
    },
    {
        email: 'pmc.get@example.com',
        password: 'password123',
        role: 'resource',
        name: 'PMC Client',
        profile: {
            organizationName: 'Big Project',
            category: 'PMC',
            pmcType: 'hire-pmc'
        }
    },
    // Resources - CSM
    {
        email: 'csm.give@example.com',
        password: 'password123',
        role: 'resource',
        name: 'CSM Service',
        profile: {
            organizationName: 'Safety First',
            category: 'CSM',
            csmType: 'offer-csm-services',
            certifications: ['ISO 9001']
        }
    },
    {
        email: 'csm.get@example.com',
        password: 'password123',
        role: 'resource',
        name: 'CSM Client',
        profile: {
            organizationName: 'Secure Site',
            category: 'CSM',
            csmType: 'hire-csm'
        }
    },
    // Resources - Logistics
    {
        email: 'logistics.give@example.com',
        password: 'password123',
        role: 'resource',
        name: 'Logistics Provider',
        profile: {
            organizationName: 'Fast Move',
            category: 'Logistics',
            logisticsType: 'provide-logistics',
            serviceArea: 'Nationwide'
        }
    },
    {
        email: 'logistics.get@example.com',
        password: 'password123',
        role: 'resource',
        name: 'Logistics User',
        profile: {
            organizationName: 'Retail Chain',
            category: 'Logistics',
            logisticsType: 'need-logistics'
        }
    },
    // Resources - Vehicle
    {
        email: 'vehicle.give@example.com',
        password: 'password123',
        role: 'resource',
        name: 'Vehicle Rental',
        profile: {
            organizationName: 'Car Fleet',
            category: 'Vehicle',
            vehicleType: 'rent-out-vehicles',
            vehicleTypes: ['Truck', 'Van']
        }
    },
    {
        email: 'vehicle.get@example.com',
        password: 'password123',
        role: 'resource',
        name: 'Vehicle User',
        profile: {
            organizationName: 'Delivery Co',
            category: 'Vehicle',
            vehicleType: 'rent-vehicles',
            vehicleTypes: ['Scooter']
        }
    }
];

const seedUsers = async () => {
    try {
        await connectDB();
        console.log('Connected to Database');

        for (const userData of USERS) {
            const { email, password, role, name, profile } = userData;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log(`User already exists: ${email}`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                role,
                // Assign profile data to user.profile as well, as per schema
                profile: userProfileToUserSchemaProfile(role, profile)
            });

            await newUser.save();
            console.log(`Created user: ${email}`);

            // Create specific profile document
            if (role === 'employee') {
                await JobSeeker.create({
                    userId: newUser._id,
                    education: profile.education || [],
                    experience: profile.experience || [],
                    interestedCompanies: [],
                    cv: 'dummy-cv.pdf'
                });
            } else if (role === 'employer') {
                await Recruiter.create({
                    userId: newUser._id,
                    company: profile.company,
                    experience: '5 years',
                    username: 'employer_user'
                });
            } else if (role === 'resource') {
                await ResourceProfile.create({
                    userId: newUser._id,
                    organizationName: profile.organizationName,
                    category: profile.category,
                    ...profile
                });
            }
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

function userProfileToUserSchemaProfile(role: string, profile: any) {
    // Map specific profile fields to User.profile schema if necessary
    // This is a simplified mapping based on common fields
    const commonFields: any = {};
    if (role === 'employee') {
        commonFields.skills = profile.skills;
        commonFields.experience = profile.experience;
        commonFields.education = profile.education;
    } else if (role === 'employer') {
        commonFields.company = profile.company;
        commonFields.website = profile.website;
        commonFields.about = profile.description;
    } else if (role === 'resource') {
        commonFields.organizationName = profile.organizationName;
        commonFields.category = profile.category;
        Object.assign(commonFields, profile);
    }
    return commonFields;
}

seedUsers();
