import React from "react";
import {
    View,
    StyleSheet,
    ViewStyle,
} from "react-native";

import {
    Colors,
    Radius,
    Spacing,
} from "../../workout/theme";

interface Props {
    children: React.ReactNode;
    style?: ViewStyle;
}

export default function SectionCard({
    children,
    style,
}: Props) {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,

        borderRadius: Radius.xl,

        borderWidth: 1,

        borderColor: Colors.border,

        padding: Spacing.lg,

        marginBottom: Spacing.lg,
    },
});