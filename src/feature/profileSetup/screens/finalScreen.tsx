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
import { generateWorkoutPlan } from "../../../services/workoutGeneration";
import { useAuthStore } from "../../../store/authStore";

const COLORS = {
    bg: "#0B1110",
    primary: "#A3E635",
    border: "#1F2A27",
    text: "#fff",
    subtext: "rgba(255,255,255,0.6)",
};

const STEPS = [
    "Analyzing Profile",
    "Saving Profile",
    "Analyzing Goals",
    "Selecting Exercises",
    "Designing Workout Split",
    "Generating Workout Plan",
];

const STEP_DURATION = 700;
const PRE_GENERATION_PROGRESS = 0.85;

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
    const updateProfile = useAuthStore((s) => s.updateProfile);

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

        // Animate only the first 5 steps
        for (let i = 0; i < STEPS.length - 1; i++) {
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
        }

        // Start last step but don't complete it yet
        const last = setTimeout(() => {
            setStepStatus((prev) => {
                const copy = [...prev];
                copy[STEPS.length - 1] = "active";
                return copy;
            });
        }, time);

        timeouts.current.push(last);
    };

    const profile = useProfileSetupStore();

    const saveProfile = async () => {
        try {
            setLoading(true);

            const { data } = await supabase.auth.getUser();
            const userId = data.user?.id;

            if (!userId) {
                throw new Error("No user logged in");
            }

            progress.value = withTiming(PRE_GENERATION_PROGRESS, {
                duration: (STEPS.length - 1) * STEP_DURATION,
                easing: Easing.linear,
            });

            // Step 1
            await completeProfile(userId, {
                fullName: profile.fullName,
                gender: profile.gender,
                age: profile.age,
                heightCm: profile.heightCm,
                weightKg: profile.weightKg,
                goal: profile.goal,
                experienceLevel: profile.experienceLevel,
                workoutDays: profile.workoutDays,
                preferredSplit: profile.preferredSplit,
                dietPreference: profile.dietPreference,
            });

            // Step 2
            const result = await generateWorkoutPlan(userId);

            if (!result.success) {
                throw result.error;
            }

            // Mark last step complete
            const { error } = await supabase
                .from("profiles")
                .update({ profile_completed: true })
                .eq("id", userId);

            if (error) {
                throw error;
            }

            // Animate from 85% -> 100%
            progress.value = withTiming(
                1,
                {
                    duration: 700,
                    easing: Easing.out(Easing.ease),
                },
                (finished) => {
                    if (finished) {
                        runOnJS(setIsComplete)(true);
                    }
                }
            );
            updateProfile({
                profile_completed: true,
            });
            setDbDone(true);
        } catch (e) {
            console.error("Profile setup failed:", e);
        } finally {
            setLoading(false);
        }
    };

    // ---------------- MAIN EFFECT ----------------
    useEffect(() => {
        startSteps();
        saveProfile();

        return () => {
            timeouts.current.forEach(clearTimeout);
            cancelAnimation(progress);
        };
    }, []);

    const canProceed = isComplete;
    useEffect(() => {
        if (isComplete) {
            router.replace("/tabs/workout");
        }
    }, [isComplete]);

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