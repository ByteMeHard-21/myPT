import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import SplashScreen from "../src/feature/Splash/screen/SplashScreen";
import { useAuthStore } from "../src/store/authStore";

export default function Index() {
    const router = useRouter();

    const session = useAuthStore((state) => state.session);
    const profile = useAuthStore((state) => state.profile);
    const hasSeenOnboarding = useAuthStore(
        (state) => state.hasSeenOnboarding
    );
    const isLoading = useAuthStore((state) => state.isLoading);

    const [splashFinished, setSplashFinished] =
        useState(false);

    useEffect(() => {
        if (!splashFinished) return;

        if (isLoading) return;

        // ----------------------------------
        // First app launch
        // ----------------------------------
        if (!hasSeenOnboarding) {
            router.replace("/onboarding/welcome");
            return;
        }

        // ----------------------------------
        // User not logged in
        // ----------------------------------
        if (!session) {
            router.replace("/auth/login");
            return;
        }

        // ----------------------------------
        // Profile setup pending
        // ----------------------------------
        if (!profile?.profile_completed) {
            router.replace("/profileSetup/userInfo");
            return;
        }

        // ----------------------------------
        // Everything complete
        // ----------------------------------
        router.replace("/tabs/workout");
    }, [
        splashFinished,
        isLoading,
        hasSeenOnboarding,
        session,
        profile,
    ]);

    useEffect(() => {
        console.log({
            isLoading,
            hasSeenOnboarding,
            session: !!session,
            profile,
        });
    }, [isLoading, hasSeenOnboarding, session, profile]);

    return (
        <SplashScreen
            onFinish={() => setSplashFinished(true)}
        />
    );
}