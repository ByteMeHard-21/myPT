import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import SectionCard from "./SectionCard";

import {
    Colors,
    Radius,
    Spacing,
} from "../../workout/theme";
import { Achievement } from "../analysis.types";



interface Props {
    achievements: Achievement[];
}


export default function AchievementCard({
    achievements,
}: Props) {
    return (
        <SectionCard>
            <Text style={styles.title}>
                Achievements
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {achievements.map((item) => (
                    <View
                        key={item.title}
                        style={styles.card}
                    >
                        <View style={styles.icon}>
                            <Ionicons
                                name={
                                    item.icon as keyof typeof Ionicons.glyphMap
                                }
                                size={28}
                                color={Colors.primary}
                            />
                        </View>

                        <Text style={styles.text}>
                            {item.title}
                        </Text>

                        <Text
                            style={{
                                color: Colors.primary,
                                marginTop: 6,
                                fontWeight: "700",
                                fontSize: 13,
                            }}
                        >
                            {item.value}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </SectionCard>
    );
}

const styles = StyleSheet.create({
    title: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: Spacing.lg,
    },

    scrollContent: {
        paddingRight: Spacing.md,
    },

    card: {
        width: 150,
        backgroundColor: Colors.surfaceElevated,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.md,
        alignItems: "center",
        marginRight: Spacing.md,
    },

    locked: {
        opacity: 0.45,
    },

    icon: {
        width: 56,
        height: 56,
        borderRadius: Radius.pill,
        backgroundColor: Colors.primaryGlow,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: Spacing.md,
    },

    text: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
        lineHeight: 20,
    },
});