/**
 * PekalonganPay Wallet Store (Zustand)
 * Manages balance, transactions, and wallet state
 */

import type { TransactionRow } from '@/types/database';
import { create } from 'zustand';

interface WalletState {
    balance: number;
    transactions: TransactionRow[];
    isLoadingBalance: boolean;
    isLoadingTransactions: boolean;
    dailySpent: number;

    // Actions
    setBalance: (balance: number) => void;
    setTransactions: (transactions: TransactionRow[]) => void;
    addTransaction: (transaction: TransactionRow) => void;
    setLoadingBalance: (value: boolean) => void;
    setLoadingTransactions: (value: boolean) => void;
    setDailySpent: (amount: number) => void;
    reset: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
    balance: 0,
    transactions: [],
    isLoadingBalance: false,
    isLoadingTransactions: false,
    dailySpent: 0,

    setBalance: (balance) => set({ balance }),
    setTransactions: (transactions) => set({ transactions }),
    addTransaction: (transaction) =>
        set((state) => ({
            transactions: [transaction, ...state.transactions],
        })),
    setLoadingBalance: (isLoadingBalance) => set({ isLoadingBalance }),
    setLoadingTransactions: (isLoadingTransactions) => set({ isLoadingTransactions }),
    setDailySpent: (dailySpent) => set({ dailySpent }),
    reset: () => set({
        balance: 0,
        transactions: [],
        dailySpent: 0,
    }),
}));

export default useWalletStore;
