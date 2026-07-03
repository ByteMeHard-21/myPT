import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import SectionCard from "./SectionCard";

import {
    Colors,
    Spacing,
} from "../../workout/theme";

interface Props {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

export default function StatCard({
    value,
    label,
    icon,
}: Props) {
    return (
        <SectionCard style={styles.card}>
            {icon && (
                <View style={styles.iconContainer}>
                    {icon}
                </View>
            )}

            <Text style={styles.value}>
                {value}
            </Text>

            <Text style={styles.label}>
                {label}
            </Text>
        </SectionCard>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,

        minHeight: 120,

        justifyContent: "space-between",
    },

    iconContainer: {
        marginBottom: Spacing.sm,
    },

    value: {
        color: Colors.text,

        fontSize: 28,

        fontWeight: "700",
    },

    label: {
        marginTop: Spacing.xs,

        color: Colors.subText,

        fontSize: 14,

        fontWeight: "500",
    },
});