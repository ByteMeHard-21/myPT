import { useAuthStore } from "../store/authStore";

export const getAuthRoute = () => {
    const { session, profile, isLoading } = useAuthStore.getState();

    if (isLoading) return "splash";

    if (!session) return "auth";

    if (!profile?.is_profile_completed) {
        return "profile_completion";
    }

    return "home";
};