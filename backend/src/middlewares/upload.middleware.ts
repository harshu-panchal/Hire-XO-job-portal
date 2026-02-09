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

    if (file.fieldname === 'cv' || file.fieldname === 'resume' || file.fieldname === 'additionalDocuments' || file.fieldname === 'certificate' || file.fieldname === 'tender-document') {
        // CV, Resume, Certificates and Tender Documents: Accept PDFs and Word docs
        if (allowedDocTypes.test(extname) && (
            mimetype === 'application/pdf' ||
            mimetype === 'application/msword' ||
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed for documents'));
        }
    } else if (file.fieldname === 'file') {
        // Generic post media: Accept both images and docs
        if (
            (allowedImageTypes.test(extname) && mimetype.startsWith('image/')) ||
            (allowedDocTypes.test(extname) && (
                mimetype === 'application/pdf' ||
                mimetype === 'application/msword' ||
                mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ))
        ) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed: Images, PDF, Word docs'));
        }
    } else if (
        file.fieldname === 'equipment-image' ||
        file.fieldname === 'machinery-image' ||
        file.fieldname === 'vehicle-image' ||
        file.fieldname === 'logistics-image' ||
        file.fieldname === 'pmc-image' ||
        file.fieldname === 'csm-image' ||
        file.fieldname === 'investor-image' ||
        file.fieldname === 'resource-image'
    ) {
        // Resource images
        if (allowedImageTypes.test(extname) && mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed for resource images'));
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

// Multer configurations
const limitsImage = { fileSize: 5 * 1024 * 1024 }; // 5MB for images
const limitsDoc = { fileSize: 10 * 1024 * 1024 }; // 10MB for documents/mixed

const uploadImage = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limitsImage
});

const uploadDoc = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limitsDoc
});

// Export instances for specific use cases
export const uploadProfilePhoto = uploadImage.single('profilePhoto');
export const uploadCompanyLogo = uploadImage.single('companyLogo');
export const uploadResourceImage = uploadImage.single('resource-image');
export const uploadEquipmentImage = uploadImage.single('equipment-image');
export const uploadMachineryImage = uploadImage.single('machinery-image');
export const uploadVehicleImage = uploadImage.single('vehicle-image');
export const uploadLogisticsImage = uploadImage.single('logistics-image');
export const uploadPMCImage = uploadImage.single('pmc-image');
export const uploadCSMImage = uploadImage.single('csm-image');
export const uploadInvestorImage = uploadImage.single('investor-image');

// Documents and Mixed
export const uploadCV = uploadDoc.single('cv');
export const uploadCertificate = uploadDoc.single('certificate');
export const uploadTenderDocument = uploadDoc.single('tender-document');
export const uploadPostMedia = uploadDoc.single('file'); // Posts can be images or docs

export const uploadApplication = uploadDoc.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'additionalDocuments', maxCount: 5 }
]);

export const uploadMultiple = uploadDoc.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'companyLogo', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
    { name: 'tender-document', maxCount: 5 },
    { name: 'resume', maxCount: 1 },
    { name: 'additionalDocuments', maxCount: 5 }
]);
