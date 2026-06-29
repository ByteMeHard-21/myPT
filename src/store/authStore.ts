import { create } from "zustand";
import { Session } from "@supabase/supabase-js";

import { UserProfile } from "../feature/auth/auth.types";

interface AuthState {
    session: Session | null;
    profile: UserProfile | null;

    isLoading: boolean;
    hasSeenOnboarding: boolean;

    setSession: (session: Session | null) => void;

    setProfile: (profile: UserProfile | null) => void;

    updateProfile: (updates: Partial<UserProfile>) => void;

    clearProfile: () => void;

    setLoading: (loading: boolean) => void;

    setHasSeenOnboarding: (value: boolean) => void;

    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,

    profile: null,

    isLoading: true,

    hasSeenOnboarding: false,

    setSession: (session) =>
        set({ session }),

    setProfile: (profile) =>
        set({ profile }),

    updateProfile: (updates) =>
        set((state) => ({
            profile: state.profile
                ? {
                    ...state.profile,
                    ...updates,
                }
                : null,
        })),

    clearProfile: () =>
        set({
            profile: null,
        }),

    setLoading: (isLoading) =>
        set({ isLoading }),

    setHasSeenOnboarding: (value) =>
        set({
            hasSeenOnboarding: value,
        }),

    logout: () =>
        set({
            session: null,
            profile: null,
        }),
}));