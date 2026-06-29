import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
} from "react-native";

import { Colors, Radius, Spacing } from "../../workout/theme";

interface FitnessSnapshotData {
    goal: string;
    experience: string;
    height: string;
    weight: string;
}

interface FitnessSnapshotProps {
    snapshot: FitnessSnapshotData;
    onEditPress?: () => void;
}



export default function FitnessSnapshot({
    snapshot,
    onEditPress,
}: FitnessSnapshotProps) {

    const DATA = [
        {
            title: "Goal",
            value: snapshot.goal,
        },
        {
            title: "Experience",
            value: snapshot.experience,
        },
        {
            title: "Height",
            value: snapshot.height,
        },
        {
            title: "Weight",
            value: snapshot.weight,
        },
    ];



    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                FITNESS SNAPSHOT
            </Text>

            <View style={styles.grid}>
                {DATA.map((item) => (
                    <View
                        key={item.title}
                        style={styles.infoCard}
                    >
                        <Text style={styles.label}>
                            {item.title}
                        </Text>

                        <Text style={styles.value}>
                            {item.value}
                        </Text>
                    </View>
                ))}
            </View>

            <Pressable
                onPress={onEditPress}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                ]}
            >
                {({ pressed }) => (
                    <Text
                        style={[
                            styles.buttonText,
                            pressed && styles.buttonTextPressed,
                        ]}
                    >
                        Edit Fitness Profile
                    </Text>
                )}
            </Pressable>
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

    grid: {
        flexDirection: "row",

        flexWrap: "wrap",

        justifyContent: "space-between",
    },

    infoCard: {
        width: "48.5%",

        backgroundColor: Colors.surface,

        borderRadius: Radius.lg,

        borderWidth: 1,

        borderColor: Colors.border,

        padding: 16,

        marginBottom: 12,
    },

    label: {
        color: Colors.muted,

        fontSize: 12,

        marginBottom: 8,
    },

    value: {
        color: Colors.text,

        fontSize: 15,

        fontWeight: "700",
    },

    button: {
        marginTop: 6,

        height: 52,

        borderRadius: Radius.lg,

        borderWidth: 1,

        borderColor: Colors.primary,

        justifyContent: "center",

        alignItems: "center",

        backgroundColor: "transparent",
    },

    buttonPressed: {
        backgroundColor: Colors.primary,
    },

    buttonText: {
        color: Colors.primary,

        fontSize: 15,

        fontWeight: "700",
    },

    buttonTextPressed: {
        color: Colors.background,
    },
});