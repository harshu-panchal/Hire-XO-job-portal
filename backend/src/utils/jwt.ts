import jwt from 'jsonwebtoken';

/**
 * JWT Utility Functions
 * Centralized JWT token generation and verification
 */

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

export interface JWTPayload {
    id: string;
    email: string;
    role: string;
}

/**
 * Generate a JWT token
 * @param payload - User data to encode in token
 * @param expiresIn - Token expiry time (default: 24h)
 * @returns JWT token string
 */
export const generateToken = (payload: JWTPayload, expiresIn: string = JWT_EXPIRY): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
};

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export const verifyToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};

/**
 * Decode token without verification (useful for debugging)
 * @param token - JWT token string
 * @returns Decoded payload or null
 */
export const decodeToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.decode(token) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1];
};

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns true if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded || !(decoded as any).exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return (decoded as any).exp < currentTime;
};
