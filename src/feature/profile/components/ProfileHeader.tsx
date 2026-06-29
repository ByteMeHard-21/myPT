import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors, Radius, Spacing } from "../../workout/theme";

interface ProfileHeaderProps {
    onSettingsPress?: () => void;
}

export default function ProfileHeader({
    onSettingsPress,
}: ProfileHeaderProps) {
    return (
        <View style={styles.container}>
            {/* Empty view keeps title perfectly centered */}
            <View style={styles.placeholder} />

            <Text style={styles.title}>My Profile</Text>

            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.settingsButton}
                onPress={onSettingsPress}
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
        height: 64,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginTop: Spacing.lg,
        marginBottom: Spacing.xl,
    },

    placeholder: {
        width: 44,
        height: 44,
    },

    title: {
        flex: 1,

        textAlign: "center",

        color: Colors.text,

        fontSize: 24,

        fontWeight: "700",
    },

    settingsButton: {
        width: 44,
        height: 44,

        borderRadius: Radius.pill,

        backgroundColor: Colors.surface,

        borderWidth: 1,
        borderColor: Colors.border,

        justifyContent: "center",
        alignItems: "center",
    },
});