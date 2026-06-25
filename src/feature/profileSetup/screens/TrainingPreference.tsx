import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScreenContainer from "../components/ScreenContainer";
import ProgressHeader from "../components/ProgressHeader";
import PrimaryButton from "../components/PrimaryButton";
import { useProfileSetupStore } from "../../../store/profileSetupStore";

const COLORS = {
    background: "#0B1110",
    surface: "#131A18",
    border: "#1F2A27",
    primary: "#A3E635",
    white: "#FFFFFF",
    secondaryText: "#9CA3AF",
    disabled: "#2A332F",
};

export default function TrainingPreferenceScreen() {
    const {
        experienceLevel,
        workoutDays,
        preferredSplit,

        setExperienceLevel,
        setWorkoutDays,
        setPreferredSplit,
    } = useProfileSetupStore();

    const isValid =
        experienceLevel &&
        workoutDays &&
        preferredSplit;

    const experiences = [
        { id: "beginner", label: "Beginner" },
        { id: "intermediate", label: "Intermediate" },
    ] as const;

    const workoutDayOptions = [3, 4, 5, 6];

    const trainingStyles = [
        {
            id: "recommended",
            title: "AI Smart Split",
            subtitle:
                "Adaptive plan based on your goals and schedule.",
            recommended: true,
            icon: "bulb-outline",
        },
        {
            id: "bro_split",
            title: "One Muscle Focus",
            subtitle:
                "Traditional bodybuilding split.",
            recommended: false,
            icon: "barbell-outline",
        },
        {
            id: "ppl",
            title: "Push Pull Legs",
            subtitle:
                "Efficient movement-based split.",
            recommended: false,
            icon: "grid-outline",
        },
    ];

    const handleContinue = () => {
        if (!isValid) return;

        router.push("/profileSetup/diet");
    };

    return (
        <ScreenContainer>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 20,
                }}
            >
                <ProgressHeader
                    step={4}
                    totalSteps={5}
                />

                <Text style={styles.title}>
                    Training Preferences
                </Text>

                <Text style={styles.subtitle}>
                    Help us customize your workout
                    plan for maximum efficiency and
                    results.
                </Text>

                {/* Experience */}

                <Text style={styles.sectionTitle}>
                    TRAINING EXPERIENCE
                </Text>

                <View style={styles.chipRow}>
                    {experiences.map((item) => {
                        const selected = experienceLevel === item.id;

                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setExperienceLevel(item.id)}
                                style={[
                                    styles.chip,
                                    selected && styles.selectedChip,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        selected && styles.selectedChipText,
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Workout Days */}

                <Text style={styles.sectionTitle}>
                    WORKOUT DAYS PER WEEK
                </Text>

                <View style={styles.daysRow}>
                    {workoutDayOptions.map((day) => {
                        const selected = workoutDays === day;

                        return (
                            <TouchableOpacity
                                key={day}
                                onPress={() => setWorkoutDays(day)}
                                style={[
                                    styles.dayCard,
                                    selected && styles.selectedDayCard,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        selected && styles.selectedDayText,
                                    ]}
                                >
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Training Style */}

                <Text style={styles.sectionTitle}>
                    TRAINING STYLE
                </Text>

                {trainingStyles.map((item) => {
                    const selected = preferredSplit === item.id;

                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => setPreferredSplit(item.id)}
                            style={[
                                styles.styleCard,
                                selected && styles.selectedStyleCard,
                            ]}
                        >
                            <View
                                style={styles.iconBox}
                            >
                                <Ionicons
                                    name={
                                        item.icon as any
                                    }
                                    size={20}
                                    color={
                                        COLORS.primary
                                    }
                                />
                            </View>

                            <View
                                style={{ flex: 1 }}
                            >
                                <Text
                                    style={
                                        styles.styleTitle
                                    }
                                >
                                    {item.title}
                                </Text>

                                <Text
                                    style={
                                        styles.styleSubtitle
                                    }
                                >
                                    {item.subtitle}
                                </Text>
                            </View>

                            {item.recommended && (
                                <View
                                    style={
                                        styles.recommendedBadge
                                    }
                                >
                                    <Text
                                        style={
                                            styles.recommendedText
                                        }
                                    >
                                        RECOMMENDED
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={18}
                        color="#FFFFFF"
                    />

                    <Text style={styles.backText}>
                        Back
                    </Text>
                </TouchableOpacity>

                <View
                    style={{
                        flex: 1,
                        marginLeft: 12,
                    }}
                >
                    <PrimaryButton
                        title="Continue"
                        disabled={!isValid}
                        onPress={handleContinue}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    title: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 10,
    },

    subtitle: {
        color: COLORS.secondaryText,
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 28,
    },

    sectionTitle: {
        color: COLORS.secondaryText,
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 12,
        letterSpacing: 1,
    },

    chipRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 28,
    },

    chip: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: "center",
    },

    selectedChip: {
        borderColor: COLORS.primary,
        backgroundColor:
            "rgba(163,230,53,0.12)",
    },

    chipText: {
        color: COLORS.white,
        fontWeight: "600",
    },

    selectedChipText: {
        color: COLORS.primary,
    },

    daysRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 28,
    },

    dayCard: {
        flex: 1,
        height: 72,
        borderRadius: 18,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: "center",
        alignItems: "center",
    },

    selectedDayCard: {
        borderColor: COLORS.primary,
        backgroundColor:
            "rgba(163,230,53,0.12)",
    },

    dayText: {
        color: COLORS.white,
        fontSize: 22,
        fontWeight: "700",
    },

    selectedDayText: {
        color: COLORS.primary,
    },

    styleCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
    },

    selectedStyleCard: {
        borderColor: COLORS.primary,
        backgroundColor:
            "rgba(163,230,53,0.12)",
    },

    iconBox: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor:
            "rgba(163,230,53,0.12)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    styleTitle: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 4,
    },

    styleSubtitle: {
        color: COLORS.secondaryText,
        fontSize: 13,
        lineHeight: 18,
    },

    recommendedBadge: {
        backgroundColor:
            "rgba(163,230,53,0.15)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },

    recommendedText: {
        color: COLORS.primary,
        fontSize: 10,
        fontWeight: "700",
    },

    buttonRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16,
        marginBottom: 20,
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
        color: COLORS.white,
        marginLeft: 6,
        fontWeight: "600",
    },
});