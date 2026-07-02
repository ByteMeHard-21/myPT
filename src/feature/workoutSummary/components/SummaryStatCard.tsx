import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

interface Props {
    icon: React.ReactNode;

    value: string;

    label: string;
}

export default function SummaryStatCard({
    icon,
    value,
    label,
}: Props) {
    return (
        <View style={styles.card}>

            <View style={styles.iconContainer}>
                {icon}
            </View>

            <Text style={styles.value}>
                {value}
            </Text>

            <Text style={styles.label}>
                {label}
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({

    card: {
        width: "48%",
        height: 140,
        backgroundColor: "#102320",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
        justifyContent: "space-between",
    },

    iconContainer: {
        width: 42,
        height: 42,

        borderRadius: 21,

        backgroundColor: "#1B3A34",

        alignItems: "center",
        justifyContent: "center",
    },

    value: {
        marginTop: 16,

        color: "#FFFFFF",

        fontSize: 24,

        fontWeight: "700",
    },

    label: {
        marginTop: 4,

        color: "rgba(255,255,255,0.65)",

        fontSize: 14,

        fontWeight: "500",
    },

});