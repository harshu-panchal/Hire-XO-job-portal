import apiClient, { getErrorMessage } from "../lib/apiConfig";

export interface Transaction {
    _id: string;
    type: 'topup' | 'deduction';
    amount: number;
    description: string;
    createdAt: string;
}

export interface WalletData {
    balance: number;
    transactions: Transaction[];
}

export const walletService = {
    /**
     * Get wallet balance and history
     */
    async getWallet(): Promise<WalletData> {
        try {
            const response = await apiClient.get<WalletData>("/wallet");
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Top up wallet
     */
    async topUp(amount: number): Promise<{ message: string; balance: number; transaction?: Transaction }> {
        try {
            const response = await apiClient.post("/wallet/top-up", { amount });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Get full transaction history
     */
    async getTransactions(page: number = 1, limit: number = 20): Promise<{ data: Transaction[]; pagination: any }> {
        try {
            const response = await apiClient.get<any>("/wallet/transactions", {
                params: { page, limit }
            });
            // Handle both old array format (fallback) and new paginated format
            if (Array.isArray(response.data)) {
                return { data: response.data, pagination: { total: response.data.length, page: 1, limit: response.data.length, pages: 1 } };
            }
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};
