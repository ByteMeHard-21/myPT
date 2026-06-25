import "react-native-reanimated";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider } from "../src/providers/AuthProvider"

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: "fade",
                    }}
                />
            </AuthProvider>
        </GestureHandlerRootView>
    );
}