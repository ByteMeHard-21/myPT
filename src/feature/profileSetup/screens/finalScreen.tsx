import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS,
    cancelAnimation,
    useAnimatedReaction,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { router } from "expo-router";

import { supabase } from "../../../services/supabase";

import { useProfileSetupStore } from "../../../store/profileSetupStore";

import { completeProfile } from "../../../services/profileService";

const COLORS = {
    bg: "#0B1110",
    primary: "#A3E635",
    border: "#1F2A27",
    text: "#fff",
    subtext: "rgba(255,255,255,0.6)",
};

const STEPS = [
    "Analyzing Profile",
    "Calculating Calories",
    "Selecting Exercises",
    "Designing Workout Split",
];

const STEP_DURATION = 1200;
const TOTAL_TIME = STEPS.length * STEP_DURATION;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AIPlanGenerationScreen({ onComplete }: any) {
    // progress is 0 → 1 (IMPORTANT)
    const progress = useSharedValue(0);

    const [progressLabel, setProgressLabel] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [dbDone, setDbDone] = useState(false);
    const [loading, setLoading] = useState(true);

    const [stepStatus, setStepStatus] = useState(
        STEPS.map(() => "pending")
    );

    const timeouts = useRef<any[]>([]);

    // ---------------- CIRCLE CONFIG ----------------
    const radius = 85;
    const stroke = 12;
    const circumference = 2 * Math.PI * radius;

    // ✅ CIRCLE ANIMATION (fully correct)
    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: circumference * (1 - progress.value),
        };
    });

    // ---------------- SAFE SYNC (fixes warning) ----------------
    useAnimatedReaction(
        () => progress.value,
        (current) => {
            runOnJS(setProgressLabel)(Math.round(current * 100));
        }
    );

    // ---------------- STEP TIMING ----------------
    const startSteps = () => {
        let time = 0;

        STEPS.forEach((_, i) => {
            const start = time;
            const end = time + STEP_DURATION;

            const t1 = setTimeout(() => {
                setStepStatus((prev) => {
                    const copy = [...prev];
                    copy[i] = "active";
                    return copy;
                });
            }, start);

            const t2 = setTimeout(() => {
                setStepStatus((prev) => {
                    const copy = [...prev];
                    copy[i] = "done";
                    return copy;
                });
            }, end);

            timeouts.current.push(t1, t2);

            time += STEP_DURATION;
        });
    };

    const profile = useProfileSetupStore();

    const saveProfile = async () => {
        try {
            setLoading(true);

            const { data } = await supabase.auth.getUser();
            const userId = data.user?.id;

            if (!userId) throw new Error("No user logged in");

            await completeProfile(userId, {
                full_name: profile.fullName,
                gender: profile.gender,
                goal: profile.goal,
                age: profile.age,
                height_cm: profile.heightCm,
                weight_kg: profile.weightKg,
                experience_level: profile.experienceLevel,
                workout_days: profile.workoutDays,
                preferred_split: profile.preferredSplit,
                diet_preference: profile.dietPreference,
            });

            setDbDone(true);
        } catch (e) {
            console.log("Profile save failed", e);
        } finally {
            setLoading(false);
        }
    };

    // ---------------- MAIN EFFECT ----------------
    useEffect(() => {
        let animationDone = false;
        let dbDoneLocal = false;

        const checkDone = () => {
            if (animationDone && dbDoneLocal) {
                setIsComplete(true);
            }
        };

        progress.value = withTiming(
            1,
            {
                duration: TOTAL_TIME,
                easing: Easing.linear,
            },
            (finished) => {
                if (finished) {
                    runOnJS(() => {
                        animationDone = true;
                        checkDone();
                    })();
                }
            }
        );

        startSteps();

        saveProfile().then(() => {
            dbDoneLocal = true;
            checkDone();
        });

        return () => {
            timeouts.current.forEach(clearTimeout);
            cancelAnimation(progress);
        };
    }, []);

    const canProceed = isComplete && dbDone;
    useEffect(() => {
        if (isComplete && dbDone) {
            router.replace("/tabs/home");
        }
    }, [isComplete, dbDone]);

    // ---------------- UI ----------------
    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    {isComplete ? "Plan Ready" : "Creating your plan"}
                </Text>

                <Text style={styles.subtitle}>
                    We're analyzing your profile to build your{"\n"}
                    personalized fitness plan
                </Text>
            </View>

            {/* CIRCLE */}
            <View style={styles.circleWrapper}>
                <Svg width={220} height={220}>
                    {/* background */}
                    <Circle
                        cx="110"
                        cy="110"
                        r={radius}
                        stroke={COLORS.border}
                        strokeWidth={stroke}
                        fill="none"
                    />

                    {/* progress */}
                    <AnimatedCircle
                        cx="110"
                        cy="110"
                        r={radius}
                        stroke={COLORS.primary}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={circumference}
                        animatedProps={animatedProps}
                    />
                </Svg>

                {/* CENTER TEXT (SAFE) */}
                <View style={styles.centerText}>
                    <Text style={styles.percent}>
                        {progressLabel}%
                    </Text>

                    <Text style={styles.completeText}>
                        {isComplete ? "Complete" : "Progress"}
                    </Text>
                </View>
            </View>

            {/* STEPS */}
            <View style={styles.steps}>
                {STEPS.map((step, i) => (
                    <View key={i} style={styles.stepRow}>
                        {stepStatus[i] === "done" ? (
                            <View style={styles.tick}>
                                <Text style={{ color: "#0B1110", fontSize: 10 }}>
                                    ✓
                                </Text>
                            </View>
                        ) : stepStatus[i] === "active" ? (
                            <View style={styles.activeDot} />
                        ) : (
                            <View style={styles.dot} />
                        )}

                        <Text style={styles.stepText}>{step}</Text>
                    </View>
                ))}
            </View>

            {/* BUTTON */}
            {canProceed && (
                <Pressable style={styles.button} onPress={onComplete}>
                    <Text style={styles.buttonText}>View Plan</Text>
                </Pressable>
            )}
        </View>
    );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingTop: 80,
        alignItems: "center",
        paddingHorizontal: 24,
    },

    header: {
        alignItems: "center",
        marginBottom: 30,
    },

    title: {
        color: COLORS.text,
        fontSize: 24,
        fontWeight: "700",
    },

    subtitle: {
        color: COLORS.subtext,
        textAlign: "center",
        marginTop: 10,
        lineHeight: 20,
    },

    circleWrapper: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 30,
    },

    centerText: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },

    percent: {
        fontSize: 42,
        color: COLORS.text,
        fontWeight: "700",
    },

    completeText: {
        color: COLORS.subtext,
        marginTop: 4,
        fontSize: 12,
    },

    steps: {
        width: "100%",
        marginTop: 20,
    },

    stepRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.border,
        marginRight: 10,
    },

    activeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
        marginRight: 10,
    },

    tick: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    stepText: {
        color: COLORS.text,
        fontSize: 14,
    },

    button: {
        marginTop: 30,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
    },

    buttonText: {
        color: "#000",
        fontWeight: "700",
    },
});