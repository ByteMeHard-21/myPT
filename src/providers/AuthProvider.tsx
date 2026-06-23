import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../services/supabase";
import { useAuthStore } from "../store/authStore";
import { getProfile } from "../feature/auth/auth.api";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const setSession = useAuthStore((s) => s.setSession);
    const setProfile = useAuthStore((s) => s.setProfile);
    const setLoading = useAuthStore((s) => s.setLoading);

    const loadUserProfile = async (userId: string) => {
        try {
            const profile = await getProfile(userId);
            setProfile(profile);
        } catch {
            setProfile(null);
        }
    };

    const setHasSeenOnboarding =
        useAuthStore((s) => s.setHasSeenOnboarding);


    const initAuth = async () => {
        setLoading(true);

        // 1. Load onboarding flag
        const onboarding = await AsyncStorage.getItem(
            "hasSeenOnboarding"
        );

        setHasSeenOnboarding(onboarding === "true");

        // 2. Load session
        const { data } =
            await supabase.auth.getSession();

        const session = data.session;
        setSession(session);

        // 3. Load profile
        if (session?.user) {
            await loadUserProfile(session.user.id);
        }

        setLoading(false);
    };

    useEffect(() => {
        initAuth();

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);

                if (session?.user) {
                    await loadUserProfile(session.user.id);
                } else {
                    setProfile(null);
                }
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return <>{children}</>;
};