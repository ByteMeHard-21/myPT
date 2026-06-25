import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
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

export default function DietPreferenceScreen() {
    const {
        dietPreference,
        setDietPreference,
    } = useProfileSetupStore();

    const diets = [
        {
            id: "vegetarian",
            title: "Vegetarian",
            subtitle: "Plant-based meals",
            image: require("../../../../assets/images/vegetarian.png"),
        },
        {
            id: "non_vegetarian",
            title: "Non Vegetarian",
            subtitle: "Includes meat & fish",
            image: require("../../../../assets/images/non-veg.png"),
        },
        {
            id: "vegetarian_with_eggs",
            title: "Eggetarian",
            subtitle: "Vegetarian + Eggs",
            image: require("../../../../assets/images/Egiterian.png"),
        },
    ];

    const handleCreatePlan = () => {
        if (!dietPreference) return;

        // Submit onboarding data
        console.log({
            diet: dietPreference,
        });

        // Navigate to next screen
        router.replace("/profileSetup/finalScreen");
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
                    step={5}
                    totalSteps={5}
                />

                <Text style={styles.title}>
                    Diet Preference
                </Text>

                <Text style={styles.subtitle}>
                    Choose the nutrition style
                    that matches your lifestyle.
                </Text>

                {diets.map((diet) => {
                    const selected =
                        dietPreference === diet.id;

                    return (
                        <TouchableOpacity
                            key={diet.id}
                            activeOpacity={0.85}
                            onPress={() =>
                                setDietPreference(
                                    diet.id
                                )
                            }
                            style={[
                                styles.card,
                                selected &&
                                styles.selectedCard,
                            ]}
                        >
                            <Image
                                source={diet.image}
                                style={styles.image}
                            />

                            <View
                                style={
                                    styles.content
                                }
                            >
                                <View
                                    style={
                                        styles.titleRow
                                    }
                                >
                                    <View>
                                        <Text
                                            style={
                                                styles.cardTitle
                                            }
                                        >
                                            {
                                                diet.title
                                            }
                                        </Text>

                                        <Text
                                            style={
                                                styles.cardSubtitle
                                            }
                                        >
                                            {
                                                diet.subtitle
                                            }
                                        </Text>
                                    </View>

                                    {selected && (
                                        <View
                                            style={
                                                styles.checkCircle
                                            }
                                        >
                                            <Ionicons
                                                name="checkmark"
                                                size={
                                                    16
                                                }
                                                color="#0B1110"
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() =>
                        router.back()
                    }
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
                        title="Create Plan"
                        disabled={!dietPreference}
                        onPress={
                            handleCreatePlan
                        }
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

    card: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 16,
    },

    selectedCard: {
        borderColor: COLORS.primary,
        borderWidth: 2,
        backgroundColor:
            "rgba(163,230,53,0.12)",
    },

    image: {
        width: "100%",
        height: 140,
        resizeMode: "cover",
    },

    content: {
        padding: 16,
    },

    titleRow: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        alignItems: "center",
    },

    cardTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "700",
    },

    cardSubtitle: {
        color: COLORS.secondaryText,
        marginTop: 4,
        fontSize: 13,
    },

    checkCircle: {
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