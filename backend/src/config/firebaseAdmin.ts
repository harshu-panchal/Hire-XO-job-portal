import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Path to service account key - will be provided by user
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.join(__dirname, '../../config/serviceAccountKey.json');


// Initialize Firebase Admin
let firebaseAdmin: admin.app.App | null = null;

try {
    let serviceAccount: any;

    // 1. Try parsing from environment variable first (Highest priority)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            console.log('Using Firebase credentials from environment variable');
        } catch (parseError) {
            console.error('Error parsing FIREBASE_SERVICE_ACCOUNT env variable:', parseError);
        }
    }

    // 2. Fallback to service account key file
    if (!serviceAccount) {
        // Use absolute path for consistency
        const absoluteKeyPath = path.isAbsolute(serviceAccountPath)
            ? serviceAccountPath
            : path.resolve(process.cwd(), serviceAccountPath);

        if (fs.existsSync(absoluteKeyPath)) {
            try {
                serviceAccount = JSON.parse(fs.readFileSync(absoluteKeyPath, 'utf8'));
                console.log('Using Firebase credentials from file:', absoluteKeyPath);
            } catch (fileError) {
                console.error('Error reading service account key file:', fileError);
            }
        }
    }

    // 3. Initialize Firebase if credentials found
    if (serviceAccount) {
        // Sanitize private key - handle both literal newlines and escaped versions
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key
                .replace(/\\n/g, '\n')
                .trim();
        }

        firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin SDK initialized successfully');
    } else {
        console.warn(
            'Firebase credentials not found (no env variable or valid key file). Push notifications will not work.'
        );
    }
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
}

export default admin;
export { firebaseAdmin };
