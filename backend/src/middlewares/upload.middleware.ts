import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create upload directories if they don't exist
const uploadDirs = ['uploads/tmp'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/tmp');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for validation
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedDocTypes = /pdf|doc|docx/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (file.fieldname === 'cv' || file.fieldname === 'certificate' || file.fieldname === 'tender-document') {
        // CV, Certificates and Tender Documents: Accept PDFs and Word docs
        if (allowedDocTypes.test(extname) && (
            mimetype === 'application/pdf' ||
            mimetype === 'application/msword' ||
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed for documents'));
        }
    } else {
        // Profile photo and company logo: Accept images only
        if (allowedImageTypes.test(extname) && mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
        }
    }
};

// Multer configuration
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit (increased for documents)
    }
});

// Multiple file upload configurations
export const uploadProfilePhoto = upload.single('profilePhoto');
export const uploadCV = upload.single('cv');
export const uploadCompanyLogo = upload.single('companyLogo');
export const uploadCertificate = upload.single('certificate');
export const uploadTenderDocument = upload.single('tender-document');
export const uploadMultiple = upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'companyLogo', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
    { name: 'tender-document', maxCount: 5 }
]);
