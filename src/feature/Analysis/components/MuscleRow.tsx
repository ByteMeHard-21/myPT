import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import ProgressBar from "./ProgressBar";

import {
    Colors,
    Spacing,
} from "../../workout/theme";

interface Props {
    muscle: string;
    percentage: number;
}

export default function MuscleRow({
    muscle,
    percentage,
}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.name}>
                    {muscle}
                </Text>

                <Text style={styles.percent}>
                    {percentage}%
                </Text>
            </View>

            <ProgressBar
                progress={percentage / 100}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },

    header: {
        flexDirection: "row",

        justifyContent: "space-between",

        marginBottom: Spacing.sm,
    },

    name: {
        color: Colors.text,

        fontSize: 14,

        fontWeight: "600",
    },

    percent: {
        color: Colors.primary,

        fontSize: 14,

        fontWeight: "700",
    },
});