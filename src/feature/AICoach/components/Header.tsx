import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    Colors,
    Spacing,
} from "../../workout/theme";

interface Props {
    onBack?: () => void;
    onSettings?: () => void;
}

export default function Header({
    onBack,
    onSettings,
}: Props) {
    return (
        <View style={styles.container}>

            <View style={styles.center}>

                <Text style={styles.title}>
                    Coach
                </Text>

                <Text style={styles.subtitle}>
                    Personal Training Coach
                </Text>

            </View>

            <TouchableOpacity
                onPress={onSettings}
            >
                <Ionicons
                    name="settings-outline"
                    size={20}
                    color={Colors.text}
                />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },

    center: {
        alignItems: "center",
    },

    title: {
        color: Colors.text,
        fontSize: 20,
        fontWeight: "700",
    },

    subtitle: {
        marginTop: 2,
        color: Colors.subText,
        fontSize: 11,
    },
});