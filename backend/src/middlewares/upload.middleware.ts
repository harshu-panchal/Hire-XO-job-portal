import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create upload directories if they don't exist
const uploadDirs = ['uploads/profile-photos', 'uploads/cvs', 'uploads/company-logos'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        if (file.fieldname === 'profilePhoto') {
            uploadPath += 'profile-photos';
        } else if (file.fieldname === 'cv') {
            uploadPath += 'cvs';
        } else if (file.fieldname === 'companyLogo') {
            uploadPath += 'company-logos';
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for validation
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedImageTypes = /jpeg|jpg|png|gif/;
    const allowedDocTypes = /pdf|doc|docx/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (file.fieldname === 'cv') {
        // CV: Accept PDFs and Word docs
        if (allowedDocTypes.test(extname) && (
            mimetype === 'application/pdf' ||
            mimetype === 'application/msword' ||
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed for CV'));
        }
    } else {
        // Profile photo and company logo: Accept images only
        if (allowedImageTypes.test(extname) && mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
};

// Multer configuration
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Multiple file upload configurations
export const uploadProfilePhoto = upload.single('profilePhoto');
export const uploadCV = upload.single('cv');
export const uploadCompanyLogo = upload.single('companyLogo');
export const uploadMultiple = upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'companyLogo', maxCount: 1 }
]);
