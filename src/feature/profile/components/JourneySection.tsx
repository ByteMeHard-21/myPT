import React from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors, Radius, Spacing } from "../../workout/theme";

const journeyData = [
    {
        id: "1",
        icon: "flame-outline",
        title: "Day Streak",
        value: "12",
        subtitle: "Current",
        color: "#F97316",
    },
    {
        id: "2",
        icon: "star-outline",
        title: "Best Streak",
        value: "29",
        subtitle: "Personal Best",
        color: Colors.primary,
    },
    {
        id: "3",
        icon: "barbell-outline",
        title: "Workouts",
        value: "58",
        subtitle: "Completed",
        color: "#60A5FA",
    },
    {
        id: "4",
        icon: "trophy-outline",
        title: "PRs Set",
        value: "16",
        subtitle: "Unlocked",
        color: "#FACC15",
    },
];

export default function JourneySection() {
    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor: `${item.color}20`,
                    },
                ]}
            >
                <Ionicons
                    name={item.icon}
                    size={22}
                    color={item.color}
                />
            </View>

            <Text style={styles.value}>
                {item.value}
            </Text>

            <Text style={styles.title}>
                {item.title}
            </Text>

            <Text style={styles.subtitle}>
                {item.subtitle}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                YOUR JOURNEY
            </Text>

            <FlatList
                horizontal
                data={journeyData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => (
                    <View style={{ width: 14 }} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Spacing.xxl,
    },

    heading: {
        color: Colors.muted,
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.2,
        marginBottom: Spacing.md,
    },

    list: {
        paddingRight: Spacing.lg,
    },

    card: {
        width: 145,
        backgroundColor: Colors.surface,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: "center",
    },

    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14,
    },

    value: {
        color: Colors.text,
        fontSize: 34,
        fontWeight: "800",
    },

    title: {
        color: Colors.text,
        fontSize: 15,
        fontWeight: "700",
        marginTop: 4,
        textAlign: "center",
    },

    subtitle: {
        color: Colors.subText,
        fontSize: 12,
        marginTop: 4,
        textAlign: "center",
    },
});