import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors, Radius, Spacing } from "../../workout/theme";

interface ProfileCardProps {
    image?: string | null;
    name?: string | null;
    goal?: string | null;
    experience?: string | null;
    onCameraPress: () => void;
}

export default function ProfileCard({
    image,
    name,
    goal,
    experience,
    onCameraPress,
}: ProfileCardProps) {
    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Image
                    source={
                        image
                            ? { uri: `${image}?t=${Date.now()}` }
                            : require("../../../../assets/images/placeholder_img.jpg")
                    }
                    style={styles.avatar}
                />

                <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={onCameraPress}
                    activeOpacity={0.9}
                >
                    <Ionicons
                        name="camera"
                        size={16}
                        color={Colors.background}
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.name}>
                {name ?? "User"}
            </Text>

            <View style={styles.badges}>
                <View style={styles.badge}>
                    <Ionicons
                        name="barbell-outline"
                        size={13}
                        color={Colors.primary}
                    />

                    <Text style={styles.badgeText}>
                        {goal
                            ?.replace("_", " ")
                            .replace(/\b\w/g, c => c.toUpperCase()) ?? "-"}
                    </Text>
                </View>

                <View style={styles.badge}>
                    <Ionicons
                        name="fitness-outline"
                        size={13}
                        color="#60A5FA"
                    />

                    <Text style={styles.badgeText}>
                        {experience
                            ?.replace("_", " ")
                            .replace(/\b\w/g, c => c.toUpperCase()) ?? "-"}
                    </Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View>
                    <Text style={styles.label}>
                        Current Streak
                    </Text>

                    <Text style={styles.value}>
                        12 days
                    </Text>
                </View>

                <View style={styles.right}>
                    <Text style={styles.label}>
                        Workouts
                    </Text>

                    <Text style={styles.value}>
                        58
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,

        borderRadius: Radius.xl,

        borderWidth: 1,

        borderColor: Colors.border,

        alignItems: "center",

        paddingVertical: 26,

        paddingHorizontal: 20,
    },

    avatarContainer: {
        position: "relative",

        marginBottom: 18,
    },

    avatar: {
        width: 116,

        height: 116,

        borderRadius: 58,

        borderWidth: 3,

        borderColor: Colors.border,
    },

    cameraButton: {
        position: "absolute",

        right: 0,

        bottom: 2,

        width: 32,

        height: 32,

        borderRadius: 16,

        backgroundColor: Colors.primary,

        justifyContent: "center",

        alignItems: "center",

        borderWidth: 2,

        borderColor: Colors.surface,
    },

    name: {
        color: Colors.text,

        fontSize: 24,

        fontWeight: "700",
    },

    badges: {
        flexDirection: "row",

        marginTop: 14,
    },

    badge: {
        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 12,

        height: 34,

        borderRadius: Radius.pill,

        backgroundColor: Colors.surfaceElevated,

        marginHorizontal: 5,
    },

    badgeText: {
        color: Colors.text,

        fontSize: 13,

        marginLeft: 5,

        fontWeight: "600",
    },

    statsRow: {
        flexDirection: "row",

        justifyContent: "space-between",

        width: "100%",

        marginTop: 24,
    },

    label: {
        color: Colors.muted,

        fontSize: 13,
    },

    value: {
        marginTop: 4,

        color: Colors.text,

        fontSize: 18,

        fontWeight: "700",
    },

    right: {
        alignItems: "flex-end",
    },
});