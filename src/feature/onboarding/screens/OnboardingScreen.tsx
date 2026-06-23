import React, { useState } from "react";
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { router } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SlideToStart from "../component/SlideToStart";

const { width, height } = Dimensions.get("window");

const TRACK_WIDTH = width - 50;

const ONBOARDING_SLIDES = [
    {
        key: "1",
        title: "Train With A Plan",
        description:
            "Personalized AI workout plans built around your goals, schedule, and fitness level.",
        image: require("../../../../assets/images/onboarding_Screen1.png"),
    },
    {
        key: "2",
        title: "Your AI Fitness Coach",
        description:
            "Get instant answers, guidance, and motivation whenever you need it.",
        image: require("../../../../assets/images/onboarding_Screen2.png"),
    },
    {
        key: "3",
        title: "Master Every Rep",
        description:
            "Analyze your form and improve technique with AI-powered feedback.",
        image: require("../../../../assets/images/onboarding_Screen3.png"),
    },
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentSlide = ONBOARDING_SLIDES[currentIndex];

    const handleNext = () => {
        if (currentIndex < ONBOARDING_SLIDES.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleSkip = () => {
        setCurrentIndex(ONBOARDING_SLIDES.length - 1);
    };

    const handleFinish = () => {
        AsyncStorage.setItem("hasSeenOnboarding", "true");
        router.replace("/auth/login");
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={currentSlide.image}
                resizeMode="cover"
                style={styles.image}
            >
                <LinearGradient
                    colors={[
                        "transparent",
                        "rgba(0,0,0,0.45)",
                        "rgba(0,0,0,0.95)",
                    ]}
                    style={styles.gradient}
                />

                <View style={styles.header}>
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Go to previous slide"
                        onPress={handleBack}
                        disabled={currentIndex === 0}
                        style={[
                            styles.circleButton,
                            currentIndex === 0 &&
                            styles.disabledButton,
                        ]}
                    >
                        <BlurView
                            intensity={35}
                            tint="dark"
                            style={styles.blur}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={25}
                                color="#FFFFFF"
                            />
                        </BlurView>
                    </TouchableOpacity>

                    <View style={styles.progressContainer}>
                        {ONBOARDING_SLIDES.map((slide, index) => (
                            <View
                                key={slide.key}
                                style={[
                                    styles.progress,
                                    index === currentIndex &&
                                    styles.activeProgress,
                                ]}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Skip onboarding"
                        onPress={handleSkip}
                        style={styles.skipButton}
                    >
                        <BlurView
                            intensity={35}
                            tint="dark"
                            style={styles.blurPill}
                        >
                            <Text style={styles.skipText}>
                                Skip
                            </Text>
                        </BlurView>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>
                        {currentSlide.title}
                    </Text>

                    <Text style={styles.description}>
                        {currentSlide.description}
                    </Text>
                </View>

                {currentIndex !==
                    ONBOARDING_SLIDES.length - 1 ? (
                    <View style={styles.footer}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel="Next onboarding slide"
                            onPress={handleNext}
                            style={styles.nextButton}
                        >
                            <Ionicons
                                name="arrow-forward"
                                size={25}
                                color="#0B1110"
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.sliderWrapper}>
                        <SlideToStart
                            trackWidth={TRACK_WIDTH}
                            onComplete={handleFinish}
                        />
                    </View>
                )}
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },

    image: {
        flex: 1,
        width,
        height,
    },

    gradient: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "50%",
    },

    header: {
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
        flexDirection: "row",
        alignItems: "center",
    },

    circleButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: "hidden",
    },

    disabledButton: {
        opacity: 0.3,
    },

    blur: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.08)",
    },

    progressContainer: {
        flex: 1,
        flexDirection: "row",
        gap: 6,
        marginHorizontal: 14,
    },

    progress: {
        flex: 1,
        height: 6,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.25)",
    },

    activeProgress: {
        backgroundColor: "#84CC16",
    },

    skipButton: {
        height: 38,
        borderRadius: 20,
        overflow: "hidden",
    },

    blurPill: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 18,
        backgroundColor: "rgba(255,255,255,0.10)",
        borderRadius: 18,
    },

    skipText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },

    content: {
        position: "absolute",
        left: 28,
        right: 28,
        bottom: 130,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 34,
        fontWeight: "800",
        marginBottom: 12,
    },

    description: {
        color: "rgba(255,255,255,0.82)",
        fontSize: 18,
        lineHeight: 26,
    },

    footer: {
        position: "absolute",
        right: 28,
        bottom: 45,
    },

    nextButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#84CC16",
        justifyContent: "center",
        alignItems: "center",
    },

    sliderWrapper: {
        position: "absolute",
        left: 25,
        right: 25,
        bottom: 45,
    },
});