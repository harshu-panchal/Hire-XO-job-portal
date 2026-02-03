/**
 * Token Manager
 * Handles JWT token storage, retrieval, and validation
 */

const TOKEN_KEY = 'hire_xo_auth_token';

export const tokenManager = {
    /**
     * Store JWT token in localStorage
     */
    setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    },

    /**
     * Retrieve JWT token from localStorage
     */
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Remove JWT token from localStorage
     */
    removeToken(): void {
        localStorage.removeItem(TOKEN_KEY);
    },

    /**
     * Check if token exists
     */
    hasToken(): boolean {
        return !!this.getToken();
    },

    /**
     * Decode JWT token to extract payload
     * Note: This does NOT validate the token signature
     */
    decodeToken(): any | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    },

    /**
     * Check if token is expired
     */
    isTokenExpired(): boolean {
        const decoded = this.decodeToken();
        if (!decoded || !decoded.exp) return true;

        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    },

    /**
     * Check if token is valid (exists and not expired)
     */
    isTokenValid(): boolean {
        return this.hasToken() && !this.isTokenExpired();
    },

    /**
     * Get user info from token
     */
    getUserFromToken(): { id: string; email: string; role: string } | null {
        const decoded = this.decodeToken();
        if (!decoded) return null;

        return {
            id: decoded.id || decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
    },
};
