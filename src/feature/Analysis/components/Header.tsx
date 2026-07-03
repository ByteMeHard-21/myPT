import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import { Colors, Spacing } from "../../workout/theme";

export default function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Analysis
            </Text>

            <Text style={styles.subtitle}>
                Your fitness journey and consistency.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.xl,
    },

    title: {
        color: Colors.text,
        fontSize: 28,
        fontWeight: "700",
    },

    subtitle: {
        marginTop: Spacing.xs,

        color: Colors.subText,

        fontSize: 14,

        lineHeight: 20,
    },
});