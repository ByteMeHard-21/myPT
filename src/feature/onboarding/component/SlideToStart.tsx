import React from "react";
import { StyleSheet } from "react-native";

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface SlideToStartProps {
    onComplete: () => void;
    trackWidth: number;
}

const TRACK_HEIGHT = 65;
const THUMB_SIZE = 60;

export default function SlideToStart({
    onComplete,
    trackWidth,
}: SlideToStartProps) {
    const maxSlide = trackWidth - THUMB_SIZE - 16;

    const slideX = useSharedValue(0);
    const textOpacity = useSharedValue(1);
    const hapticTriggered = useSharedValue(false);

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            const value = Math.max(
                0,
                Math.min(event.translationX, maxSlide)
            );

            slideX.value = value;

            textOpacity.value = interpolate(
                value,
                [0, maxSlide * 0.4],
                [1, 0],
                Extrapolation.CLAMP
            );

            if (
                value > maxSlide * 0.8 &&
                !hapticTriggered.value
            ) {
                hapticTriggered.value = true;

                runOnJS(Haptics.impactAsync)(
                    Haptics.ImpactFeedbackStyle.Medium
                );
            }
        })
        .onEnd(() => {
            if (slideX.value > maxSlide * 0.9) {
                slideX.value = withSpring(maxSlide);

                runOnJS(onComplete)();
                return;
            }

            slideX.value = withSpring(0);
            textOpacity.value = withTiming(1);
            hapticTriggered.value = false;
        });

    const thumbAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: slideX.value }],
    }));

    const trailAnimatedStyle = useAnimatedStyle(() => ({
        width: slideX.value + THUMB_SIZE,
    }));

    const textAnimatedStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
    }));

    return (
        <Animated.View style={styles.container}>
            <Animated.View style={styles.trackBackground} />

            <Animated.View
                style={[styles.trail, trailAnimatedStyle]}
            >
                <LinearGradient
                    colors={["#84CC16", "#A3E635", "#B7F35A"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            <Animated.Text
                style={[styles.slideText, textAnimatedStyle]}
            >
                Slide to Get Started
            </Animated.Text>

            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={[
                        styles.sliderThumb,
                        thumbAnimatedStyle,
                    ]}
                >
                    <Ionicons
                        name="chevron-forward"
                        size={30}
                        color="#0B1110"
                    />
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: TRACK_HEIGHT,
        borderRadius: 45,
        backgroundColor: "rgba(20,20,20,0.9)",
        justifyContent: "center",
        overflow: "hidden",
    },

    trackBackground: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: 45,
    },

    trail: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        borderRadius: 45,
        overflow: "hidden",
    },

    slideText: {
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
    },

    sliderThumb: {
        position: "absolute",
        left: 0,
        top: 0,
        width: THUMB_SIZE,
        height: TRACK_HEIGHT,
        borderRadius: TRACK_HEIGHT / 2,
        backgroundColor: "#84CC16",
        justifyContent: "center",
        alignItems: "center",
    },
});