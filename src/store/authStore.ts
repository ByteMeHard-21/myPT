import { create } from 'zustand';

import { Session } from '@supabase/supabase-js';

import { UserProfile } from '../feature/auth/auth.types';

interface AuthState {
    session: Session | null;

    profile: UserProfile | null;

    isLoading: boolean;

    hasSeenOnboarding: boolean;

    setSession: (session: Session | null) => void;

    setProfile: (profile: UserProfile | null) => void;

    setLoading: (loading: boolean) => void;

    setHasSeenOnboarding: (v: boolean) => void;

    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,

    profile: null,

    isLoading: true,

    setSession: (session) =>
        set({ session }),

    setProfile: (profile) =>
        set({ profile }),

    setLoading: (isLoading) =>
        set({ isLoading }),

    logout: () =>
        set({
            session: null,
            profile: null,
        }),

    hasSeenOnboarding: false,

    setHasSeenOnboarding: (value) =>
        set({ hasSeenOnboarding: value }),
}));