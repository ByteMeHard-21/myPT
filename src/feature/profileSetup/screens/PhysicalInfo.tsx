import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
    Extrapolation,
    Easing,
} from "react-native-reanimated";

import ScreenContainer from "../components/ScreenContainer";
import PrimaryButton from "../components/PrimaryButton";
import AgeCard from "../components/AgeCard";
import MetricCard from "../components/merticCard";

import {
    HeightUnit,
    WeightUnit,
    buildHeightWheelValues,
    buildWeightWheelValues,
    cmToWheelValue,
    kgToWheelValue,
    wheelValueToCm,
    wheelValueToKg,
    formatHeightDisplay,
    formatWeightDisplay,
    heightUnitSuffix,
    weightUnitSuffix,
} from "../utils/units";
import { useProfileSetupStore } from "../../../store/profileSetupStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AGE_RANGE = { min: 18, max: 100 };

const COLORS = {
    background: "#0B1110",
    surface: "#131A18",
    border: "#1F2A27",
    primary: "#A3E635",
    white: "#FFFFFF",
    secondaryText: "#9CA3AF",
    disabled: "#2A332F",
};


export default function BodyMetricsScreen() {

    const {
        age,
        heightCm,
        weightKg,
        heightUnit,
        weightUnit,
        setAge,
        setHeightCm,
        setWeightKg,
        setHeightUnit,
        setWeightUnit,
    } = useProfileSetupStore();

    const ageValues = React.useMemo(() => {
        const out: number[] = [];
        for (let v = AGE_RANGE.min; v <= AGE_RANGE.max; v += 1) out.push(v);
        return out;
    }, []);

    const heightValues = React.useMemo(
        () => buildHeightWheelValues(heightUnit),
        [heightUnit]
    );
    const weightValues = React.useMemo(
        () => buildWeightWheelValues(weightUnit),
        [weightUnit]
    );

    const heightWheelValue = cmToWheelValue(heightCm, heightUnit);
    const weightWheelValue = kgToWheelValue(weightKg, weightUnit);

    const handleHeightWheelChange = useCallback(
        (value: number) => {
            setHeightCm(wheelValueToCm(value, heightUnit));
        },
        [heightUnit]
    );

    const handleWeightWheelChange = useCallback(
        (value: number) => {
            setWeightKg(wheelValueToKg(value, weightUnit));
        },
        [weightUnit]
    );

    const toggleHeightUnit = useCallback(() => {
        setHeightUnit(heightUnit === "cm" ? "ft" : "cm");
    }, [heightUnit, setHeightUnit]);

    const toggleWeightUnit = useCallback(() => {
        setWeightUnit(weightUnit === "kg" ? "lb" : "kg");
    }, [weightUnit, setWeightUnit]);

    // ---- Entrance choreography ----------------------------------------
    const revealProgress = useSharedValue(0);

    useEffect(() => {
        revealProgress.value = withTiming(1, {
            duration: 900,
            easing: Easing.out(Easing.cubic),
        });
    }, []);

    const progressBarStyle = useAnimatedStyle(() => {
        const widthPct = interpolate(
            revealProgress.value,
            [0, 0.15],
            [0, 100],
            Extrapolation.CLAMP
        );
        return { width: `${widthPct}%` };
    });

    const headerStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            revealProgress.value,
            [0.1, 0.35],
            [0, 1],
            Extrapolation.CLAMP
        );
        const translateY = interpolate(
            revealProgress.value,
            [0.1, 0.35],
            [14, 0],
            Extrapolation.CLAMP
        );
        return { opacity, transform: [{ translateY }] };
    });

    const footerStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            revealProgress.value,
            [0.7, 1],
            [0, 1],
            Extrapolation.CLAMP
        );
        const translateY = interpolate(
            revealProgress.value,
            [0.7, 1],
            [40, 0],
            Extrapolation.CLAMP
        );
        return { opacity, transform: [{ translateY }] };
    });

    const handleContinue = () => {
        router.push("/profileSetup/trainingPreferences");
    };

    return (
        <ScreenContainer>
            {/* Progress bar */}
            <View style={styles.progressTrack}>
                <Animated.View
                    style={[styles.progressFill, progressBarStyle]}
                />
            </View>
            <Text style={styles.stepLabel}>STEP 2 OF 6</Text>

            <Animated.View style={headerStyle}>
                <Text style={styles.title}>Tell us about yourself</Text>
                <Text style={styles.subtitle}>
                    Help us calculate your personalized fitness targets.
                </Text>
            </Animated.View>

            <AgeCard
                age={age}
                values={ageValues}
                onChange={setAge}
                revealProgress={revealProgress}
                revealStart={0.3}
                revealEnd={0.55}
            />

            <View style={styles.metricsRow}>
                <MetricCard
                    label="HEIGHT"
                    displayValue={formatHeightDisplay(heightCm, heightUnit)}
                    unitSuffix={heightUnitSuffix(heightUnit)}
                    values={heightValues}
                    selectedValue={heightWheelValue}
                    onChange={handleHeightWheelChange}
                    unitOptions={["cm", "ft"]}
                    activeUnit={heightUnit}
                    onToggleUnit={toggleHeightUnit}
                    revealProgress={revealProgress}
                    revealStart={0.45}
                    revealEnd={0.7}
                />

                <MetricCard
                    label="WEIGHT"
                    displayValue={formatWeightDisplay(weightKg, weightUnit)}
                    unitSuffix={weightUnitSuffix(weightUnit)}
                    values={weightValues}
                    selectedValue={weightWheelValue}
                    onChange={handleWeightWheelChange}
                    unitOptions={["kg", "lb"]}
                    activeUnit={weightUnit}
                    onToggleUnit={toggleWeightUnit}
                    revealProgress={revealProgress}
                    revealStart={0.55}
                    revealEnd={0.8}
                />
            </View>

            <View style={{ flex: 1 }} />

            <Animated.View style={[styles.buttonRow, footerStyle]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <View style={{ flex: 1, marginLeft: 12 }}>
                    <PrimaryButton title="Continue" onPress={handleContinue} />
                </View>
            </Animated.View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    progressTrack: {
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.border,
        overflow: "hidden",
        marginBottom: 10,
    },

    progressFill: {
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
    },

    stepLabel: {
        color: COLORS.primary,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1,
        textAlign: "center",
        marginBottom: 12,
    },

    title: {
        color: COLORS.white,
        fontSize: 26,
        fontWeight: "800",
        textAlign: "center",
    },

    subtitle: {
        color: COLORS.secondaryText,
        marginTop: 8,
        marginBottom: 22,
        lineHeight: 21,
        textAlign: "center",
        fontSize: 14,
    },

    metricsRow: {
        flexDirection: "row",
        gap: 12,
    },

    buttonRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 8,
    },

    backButton: {
        width: 95,
        height: 54,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.disabled,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    backText: {
        color: "#FFFFFF",
        marginLeft: 6,
        fontWeight: "600",
    },
});