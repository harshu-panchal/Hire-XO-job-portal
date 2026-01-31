import bcrypt from 'bcryptjs';

/**
 * Password Utility Functions
 * Centralized password hashing and verification
 */

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

/**
 * Compare plain text password with hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns true if passwords match, false otherwise
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with isValid flag and error message
 */
export const validatePasswordStrength = (password: string): { isValid: boolean; message: string } => {
    if (!password || password.length < 6) {
        return {
            isValid: false,
            message: 'Password must be at least 6 characters long'
        };
    }

    if (password.length > 128) {
        return {
            isValid: false,
            message: 'Password must be less than 128 characters'
        };
    }

    // Optional: Add more strength requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Basic validation (at least one letter and one number)
    if (!hasLowerCase && !hasUpperCase) {
        return {
            isValid: false,
            message: 'Password must contain at least one letter'
        };
    }

    return {
        isValid: true,
        message: 'Password is valid'
    };
};

/**
 * Generate a random password
 * @param length - Length of password (default: 12)
 * @returns Random password string
 */
export const generateRandomPassword = (length: number = 12): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
};

/**
 * Check if password needs rehashing (e.g., if salt rounds changed)
 * @param hashedPassword - Current hashed password
 * @returns true if needs rehashing, false otherwise
 */
export const needsRehash = (hashedPassword: string): boolean => {
    try {
        const rounds = bcrypt.getRounds(hashedPassword);
        return rounds !== SALT_ROUNDS;
    } catch (error) {
        return true; // If we can't get rounds, assume it needs rehashing
    }
};
