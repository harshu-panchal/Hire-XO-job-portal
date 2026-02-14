import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface Config {
    PORT: number;
    NODE_ENV: string;
    MONGO_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRY: string;
    FRONTEND_URL: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    FIREBASE_SERVICE_ACCOUNT_PATH: string;
}

const getEnvVar = (key: string, required: boolean = true): string => {
    const value = process.env[key];
    if (required && !value) {
        throw new Error(`FATAL: Environment variable ${key} is missing!`);
    }
    return value || '';
};

export const config: Config = {
    PORT: parseInt(getEnvVar('PORT', false) || '5000', 10),
    NODE_ENV: getEnvVar('NODE_ENV', false) || 'development',
    MONGO_URI: getEnvVar('MONGO_URI'),
    JWT_SECRET: getEnvVar('JWT_SECRET'),
    JWT_EXPIRY: getEnvVar('JWT_EXPIRY', false) || '24h',
    FRONTEND_URL: getEnvVar('FRONTEND_URL', false) || 'http://localhost:5173',
    CLOUDINARY_CLOUD_NAME: getEnvVar('CLOUDINARY_CLOUD_NAME', false),
    CLOUDINARY_API_KEY: getEnvVar('CLOUDINARY_API_KEY', false),
    CLOUDINARY_API_SECRET: getEnvVar('CLOUDINARY_API_SECRET', false),
    FIREBASE_SERVICE_ACCOUNT_PATH: getEnvVar('FIREBASE_SERVICE_ACCOUNT_PATH', false) || './src/config/serviceAccountKey.json'
};

// Validation for critical security vars
if (config.JWT_SECRET === 'secret') {
    console.warn('WARNING: Using insecure default JWT_SECRET "secret". Please change this in production!');
}
