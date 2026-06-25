import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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



export default function ProfileSetupScreen() {
    const {
        fullName,
        gender,
        setFullName,
        setGender,
    } = useProfileSetupStore();

    const isValid =
        fullName.trim().length > 0 &&
        gender !== null;

    const handleContinue = () => {
        if (!isValid) return;

        router.push("/profileSetup/goal");
    };

    return (
        <ScreenContainer>
            {/* Step Indicator */}

            <ProgressHeader
                step={1}
                totalSteps={5}
            />

            {/* Header */}

            <Text style={styles.title}>
                Tell us about yourself
            </Text>

            <Text style={styles.subtitle}>
                Help us build your personalized
                fitness experience.
            </Text>

            {/* Name Input */}

            <Text style={styles.label}>
                Full Name
            </Text>

            <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#6B7280"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
            />

            {/* Gender */}

            <Text style={styles.label}>
                Gender
            </Text>

            <View style={styles.genderRow}>
                {/* Male */}

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setGender("male")}
                    style={[
                        styles.genderCard,
                        gender === "male" &&
                        styles.selectedCard,
                    ]}
                >
                    <Image
                        source={require("../../../../assets/images/male.png")}
                        style={styles.genderImage}
                    />

                    <View style={styles.genderFooter}>
                        <Ionicons
                            name="male"
                            size={18}
                            color={
                                gender === "male"
                                    ? COLORS.primary
                                    : "#9CA3AF"
                            }
                        />

                        <Text
                            style={styles.genderText}
                        >
                            Male
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Female */}

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setGender("female")}
                    style={[
                        styles.genderCard,
                        gender === "female" &&
                        styles.selectedCard,
                    ]}
                >
                    <Image
                        source={require("../../../../assets/images/female.png")}
                        style={styles.genderImage}
                    />

                    <View style={styles.genderFooter}>
                        <Ionicons
                            name="female"
                            size={18}
                            color={
                                gender === "female"
                                    ? COLORS.primary
                                    : "#9CA3AF"
                            }
                        />

                        <Text
                            style={styles.genderText}
                        >
                            Female
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }} />

            {/* Bottom Buttons */}

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

                <View style={{ flex: 1, marginLeft: 12 }}>
                    <PrimaryButton
                        title="Continue"
                        onPress={handleContinue}
                        disabled={!isValid}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    stepRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    stepText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
    },

    progressTrack: {
        height: 8,
        borderRadius: 50,
        backgroundColor: "#1A2421",
        marginTop: 10,
        marginBottom: 32,
        overflow: "hidden",
    },

    progressFill: {
        width: "20%",
        height: "100%",
        backgroundColor: COLORS.primary,
        borderRadius: 50,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: COLORS.white,
        marginBottom: 10,
    },

    subtitle: {
        color: COLORS.secondaryText,
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 30,
    },

    label: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 10,
    },

    input: {
        height: 58,
        borderRadius: 18,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 18,
        color: COLORS.white,
        fontSize: 16,
        marginBottom: 24,
    },

    genderRow: {
        flexDirection: "row",
        gap: 14,
    },

    genderCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 22,
        overflow: "hidden",
        paddingBottom: 14,
    },

    selectedCard: {
        borderColor: COLORS.primary,
        borderWidth: 2,
        backgroundColor:
            "rgba(163,230,53,0.12)",
    },

    genderImage: {
        width: "100%",
        height: 180,
        resizeMode: "cover",
    },

    genderFooter: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
        gap: 6,
    },

    genderText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: "600",
    },

    buttonRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },

    backButton: {
        height: 54,
        width: 95,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.disabled,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    backText: {
        color: COLORS.white,
        fontWeight: "600",
        marginLeft: 6,
    },

    continueButton: {
        flex: 1,
        marginLeft: 12,
        height: 54,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    disabledButton: {
        backgroundColor: COLORS.disabled,
        opacity: 0.6,
    },

    continueText: {
        color: "#0B1110",
        fontWeight: "700",
        fontSize: 15,
        marginRight: 8,
    },
});