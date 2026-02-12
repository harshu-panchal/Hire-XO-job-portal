import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Path to service account key - will be provided by user
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.join(__dirname, '../../config/serviceAccountKey.json');

// Convert to absolute path for consistent behavior between fs and require
const absolutePath = path.resolve(process.cwd(), serviceAccountPath);

// Initialize Firebase Admin only if credentials file exists
// Initialize Firebase Admin
let firebaseAdmin: admin.app.App | null = null;

if (fs.existsSync(absolutePath)) {
    try {
        const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));

try {
    let serviceAccount: any;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Try parsing from environment variable first
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            console.log('Using Firebase credentials from environment variable');
        } catch (parseError) {
            console.error('Error parsing FIREBASE_SERVICE_ACCOUNT env variable:', parseError);
        }
    }

    if (!serviceAccount && fs.existsSync(serviceAccountPath)) {
        // Fallback to service account key file
        serviceAccount = require(serviceAccountPath);
        console.log('Using Firebase credentials from file:', serviceAccountPath);
    }

    if (serviceAccount) {
        firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin SDK initialized successfully');
    } else {
        console.warn(
            'Firebase credentials not found (no env variable or file). Push notifications will not work. ' +
            `Looked for file at: ${serviceAccountPath}`
        );
    }
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
}

export default admin;
export { firebaseAdmin };
