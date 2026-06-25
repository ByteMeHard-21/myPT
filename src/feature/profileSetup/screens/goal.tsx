import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
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



export default function GoalScreen() {
    const {
        goal,
        setGoal,
    } = useProfileSetupStore();

    const goals = [
        {
            id: "muscle_gain",
            title: "Build Muscle",
            subtitle: "Increase strength and lean muscle mass",
            image: require("../../../../assets/images/musucle_gain.png"),
        },
        {
            id: "weight_loss",
            title: "Lose Weight",
            subtitle: "Burn fat and achieve a healthier body",
            image: require("../../../../assets/images/weight_loss.png"),
        },
        {
            id: "stay_fit",
            title: "Stay Fit",
            subtitle: "Improve overall health and endurance",
            image: require("../../../../assets/images/stayFit.png"),
        },
    ];

    const handleContinue = () => {
        if (!goal) return;

        router.push("/profileSetup/physicalInfo");
    };

    return (
        <ScreenContainer>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 30,
                }}
            >
                <ProgressHeader
                    step={2}
                    totalSteps={5}
                />

                <Text style={styles.title}>
                    What is your primary goal?
                </Text>

                <Text style={styles.subtitle}>
                    Choose the fitness journey that best
                    matches your objective.
                </Text>

                {goals.map((item) => {
                    const isSelected =
                        goal === item.id

                    return (
                        <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.85}
                            onPress={() => setGoal(item.id)}

                            style={[
                                styles.goalCard,
                                isSelected &&
                                styles.selectedCard,
                            ]}
                        >
                            <Image
                                source={item.image}
                                style={styles.goalImage}
                            />

                            <View
                                style={
                                    styles.goalContent
                                }
                            >
                                <Text
                                    style={
                                        styles.goalTitle
                                    }
                                >
                                    {item.title}
                                </Text>

                                <Text
                                    style={
                                        styles.goalSubtitle
                                    }
                                >
                                    {item.subtitle}
                                </Text>
                            </View>

                            {isSelected && (
                                <View
                                    style={
                                        styles.checkContainer
                                    }
                                >
                                    <Ionicons
                                        name="checkmark"
                                        size={16}
                                        color="#0B1110"
                                    />
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
                        disabled={!goal}
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
        marginBottom: 24,
    },

    goalCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
        overflow: "hidden",
    },

    selectedCard: {
        borderColor: COLORS.primary,
        borderWidth: 2,
        backgroundColor:
            "rgba(163,230,53,0.12)",
    },

    goalImage: {
        width: "100%",
        height: 170,
        resizeMode: "cover",
    },

    goalContent: {
        padding: 18,
    },

    goalTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
    },

    goalSubtitle: {
        color: COLORS.secondaryText,
        fontSize: 13,
        lineHeight: 20,
    },

    checkContainer: {
        position: "absolute",
        top: 14,
        right: 14,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
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