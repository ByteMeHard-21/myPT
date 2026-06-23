import { useRouter } from "expo-router";

import SplashScreen from "../src/feature/Splash/screen/SplashScreen";

export default function Index() {
    const router = useRouter();

    const handleFinish = () => {
        router.replace("/onboarding/welcome");
    };

    return (
        <SplashScreen
            onFinish={handleFinish}
        />
    );
}