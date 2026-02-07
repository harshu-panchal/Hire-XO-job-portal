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
    async topUp(amount: number): Promise<{ message: string; balance: number }> {
        try {
            const response = await apiClient.post("/wallet/top-up", { amount });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};
