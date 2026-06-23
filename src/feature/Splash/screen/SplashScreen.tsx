import React, { useEffect } from "react";
import {
    AccessibilityInfo,
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Animated, {
    Easing,
    cancelAnimation,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

export interface SplashScreenProps {
    onFinish?: () => void;
    durationMs?: number;
}

const { width } = Dimensions.get("window");

const LOGO_SIZE = Math.min(150, width * 0.38);

const TOTAL_DURATION_MS = 1500;
const REDUCED_MOTION_DURATION_MS = 800;

const ANIMATION = {
    logoFade: 400,
    logoScale: 450,
    glowFade: 500,
    wordmarkFade: 350,
    taglineFade: 300,
    breath: 1200,
};

export default function SplashScreen({
    onFinish,
    durationMs = TOTAL_DURATION_MS,
}: SplashScreenProps) {
    const reduceMotion = useReducedMotion();

    const logoOpacity = useSharedValue(0);
    const logoScale = useSharedValue(0.9);

    const glowOpacity = useSharedValue(0);

    const wordOpacity = useSharedValue(0);
    const wordY = useSharedValue(10);

    const tagOpacity = useSharedValue(0);
    const tagY = useSharedValue(8);

    const breath = useSharedValue(1);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        if (Platform.OS !== "web") {
            AccessibilityInfo.announceForAccessibility("myPT is loading");
        }

        if (reduceMotion) {
            logoOpacity.value = 1;
            logoScale.value = 1;
            glowOpacity.value = 0.4;
            wordOpacity.value = 1;
            tagOpacity.value = 1;

            timeoutId = setTimeout(() => {
                onFinish?.();
            }, REDUCED_MOTION_DURATION_MS);

            return () => clearTimeout(timeoutId);
        }

        logoOpacity.value = withTiming(1, {
            duration: ANIMATION.logoFade,
        });

        logoScale.value = withTiming(1, {
            duration: ANIMATION.logoScale,
        });

        glowOpacity.value = withTiming(0.35, {
            duration: ANIMATION.glowFade,
        });

        wordOpacity.value = withDelay(
            250,
            withTiming(1, {
                duration: ANIMATION.wordmarkFade,
            })
        );

        wordY.value = withDelay(
            250,
            withTiming(0, {
                duration: ANIMATION.wordmarkFade,
            })
        );

        tagOpacity.value = withDelay(
            450,
            withTiming(1, {
                duration: ANIMATION.taglineFade,
            })
        );

        tagY.value = withDelay(
            450,
            withTiming(0, {
                duration: ANIMATION.taglineFade,
            })
        );

        breath.value = withDelay(
            400,
            withRepeat(
                withSequence(
                    withTiming(1.02, {
                        duration: ANIMATION.breath,
                        easing: Easing.inOut(Easing.sin),
                    }),
                    withTiming(1, {
                        duration: ANIMATION.breath,
                        easing: Easing.inOut(Easing.sin),
                    })
                ),
                -1
            )
        );

        timeoutId = setTimeout(() => {
            onFinish?.();
        }, durationMs);

        return () => {
            clearTimeout(timeoutId);
            cancelAnimation(breath);
        };
    }, [durationMs, onFinish, reduceMotion]);

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value * breath.value }],
    }));

    const glowAnimatedStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const wordmarkAnimatedStyle = useAnimatedStyle(() => ({
        opacity: wordOpacity.value,
        transform: [{ translateY: wordY.value }],
    }));

    const taglineAnimatedStyle = useAnimatedStyle(() => ({
        opacity: tagOpacity.value,
        transform: [{ translateY: tagY.value }],
    }));

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={["#0B1110", "#050707", "#000000"]}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.center}>
                <View style={styles.logoContainer}>
                    <Animated.View
                        style={[styles.glow, glowAnimatedStyle]}
                    />

                    <Animated.View style={logoAnimatedStyle}>
                        <Image
                            source={require("../../../../assets/images/logo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </Animated.View>
                </View>

                <Animated.Text
                    style={[styles.wordmark, wordmarkAnimatedStyle]}
                >
                    <Text style={styles.wordmarkPrimary}>my</Text>
                    <Text style={styles.wordmarkAccent}>PT</Text>
                </Animated.Text>

                <Animated.Text
                    style={[styles.tagline, taglineAnimatedStyle]}
                >
                    Your Trainer • Your Progress
                </Animated.Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#0B1110",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },

    logoContainer: {
        width: LOGO_SIZE * 1.7,
        height: LOGO_SIZE * 1.7,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },

    glow: {
        position: "absolute",
        width: LOGO_SIZE * 1.7,
        height: LOGO_SIZE * 1.7,
        borderRadius: 999,
        backgroundColor: "#84CC16",
        shadowColor: "#84CC16",
        shadowOpacity: 0.2,
        shadowRadius: 40,
    },

    logo: {
        width: LOGO_SIZE,
        height: LOGO_SIZE,
    },

    wordmark: {
        fontSize: 40,
        fontWeight: "800",
        letterSpacing: -1,
        marginBottom: 10,
    },

    wordmarkPrimary: {
        color: "#FFFFFF",
    },

    wordmarkAccent: {
        color: "#84CC16",
    },

    tagline: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 2,
        color: "rgba(255,255,255,0.6)",
    },
});