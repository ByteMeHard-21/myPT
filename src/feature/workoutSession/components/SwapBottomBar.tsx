import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { Colors, Radius, Spacing } from "../../workout/theme";

interface Props {
    onCancel: () => void;
    onSwap: () => void;
    disabled?: boolean;
}

export default function SwapBottomBar({
    onCancel,
    onSwap,
    disabled = false,
}: Props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.cancelButton}
                onPress={onCancel}
            >
                <Text style={styles.cancelText}>
                    Cancel
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.9}
                disabled={disabled}
                onPress={onSwap}
                style={[
                    styles.swapButton,
                    disabled && styles.disabled,
                ]}
            >
                <Text style={styles.swapText}>
                    SWAP EXERCISE
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const BUTTON_HEIGHT = 54;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: 28,

        gap: Spacing.md,

        backgroundColor: Colors.background,

        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },

    cancelButton: {
        flex: 1,

        height: BUTTON_HEIGHT,

        borderRadius: Radius.pill,

        backgroundColor: Colors.surface,

        borderWidth: 1,
        borderColor: Colors.border,

        justifyContent: "center",
        alignItems: "center",
    },

    swapButton: {
        flex: 2,

        height: BUTTON_HEIGHT,

        borderRadius: Radius.pill,

        backgroundColor: Colors.primary,

        justifyContent: "center",
        alignItems: "center",
    },

    disabled: {
        opacity: 0.45,
    },

    cancelText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: "600",
    },

    swapText: {
        color: Colors.background,
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 0.3,
    },
});