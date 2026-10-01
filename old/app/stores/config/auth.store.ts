//-Path: "Vite-React-Router-TypeScript/src/stores/authStore.ts"
import { create } from 'zustand';
import type { User } from '~/types/auth';

interface AuthState {
    open: boolean;
    user: User | null | undefined;
    error: Error | null;
    loading: boolean;
    setUser: (user: User | null | undefined) => void;
    setError: (error: Error | null) => void;
    setLoading: (loading: boolean) => void;
    setOpen: (open: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    open: false,
    user: undefined,
    error: null,
    loading: true,
    setOpen: (open) => set({ open }),
    setUser: (user) => set({ user }),
    setError: (error) => set({ error }),
    setLoading: (loading) => set({ loading }),
}));
