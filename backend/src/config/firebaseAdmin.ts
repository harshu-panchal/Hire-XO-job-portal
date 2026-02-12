import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Path to service account key - will be provided by user
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.join(__dirname, '../../config/serviceAccountKey.json');

// Convert to absolute path for consistent behavior between fs and require
const absolutePath = path.resolve(process.cwd(), serviceAccountPath);

// Initialize Firebase Admin only if credentials file exists
let firebaseAdmin: admin.app.App | null = null;

if (fs.existsSync(absolutePath)) {
    try {
        const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));

        firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
        console.error('Error initializing Firebase Admin SDK:', error);
    }
} else {
    console.warn(
        'Firebase service account key not found. Push notifications will not work. ' +
        `Please add serviceAccountKey.json to: ${serviceAccountPath}`
    );
}

export default admin;
export { firebaseAdmin };
