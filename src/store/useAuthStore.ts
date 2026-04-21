/**
 * PekalonganPay Auth Store (Zustand)
 * Manages authentication state with encrypted persistence
 */

import type { UserRow } from '@/types/database';
import { create } from 'zustand';

interface AuthState {
    user: UserRow | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    sessionToken: string | null;
    pinVerified: boolean;

    // Actions
    setUser: (user: UserRow | null) => void;
    setAuthenticated: (value: boolean) => void;
    setLoading: (value: boolean) => void;
    setSessionToken: (token: string | null) => void;
    setPinVerified: (value: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    sessionToken: null,
    pinVerified: false,

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setLoading: (isLoading) => set({ isLoading }),
    setSessionToken: (sessionToken) => set({ sessionToken }),
    setPinVerified: (pinVerified) => set({ pinVerified }),

    logout: () => set({
        user: null,
        isAuthenticated: false,
        sessionToken: null,
        pinVerified: false,
    }),
}));

export default useAuthStore;
