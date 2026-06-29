import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors, Radius, Spacing } from "../../workout/theme";

interface AccountItem {
    id: string;
    title: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    onPress: () => void;
}

const accountItems: AccountItem[] = [

    {
        id: "1",
        title: "Notifications",
        icon: "notifications-outline",
        onPress: () => console.log("Notifications"),
    },
    {
        id: "2",
        title: "Privacy & Security",
        icon: "shield-checkmark-outline",
        onPress: () => console.log("Privacy"),
    },
    {
        id: "3",
        title: "Help & Support",
        icon: "help-circle-outline",
        onPress: () => console.log("Support"),
    },
    {
        id: "4",
        title: "About MyPT",
        icon: "information-circle-outline",
        onPress: () => console.log("About"),
    },
];

export default function AccountSection() {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                ACCOUNT
            </Text>

            <View style={styles.card}>
                {accountItems.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.row,
                            index !== accountItems.length - 1 &&
                            styles.rowBorder,
                        ]}
                        activeOpacity={0.75}
                        onPress={item.onPress}
                    >
                        <View style={styles.left}>
                            <View style={styles.iconContainer}>
                                <Ionicons
                                    name={item.icon}
                                    size={20}
                                    color={Colors.primary}
                                />
                            </View>

                            <Text style={styles.title}>
                                {item.title}
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={Colors.subText}
                        />
                    </TouchableOpacity>
                ))}
            </View>
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

    card: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: "hidden",
    },

    row: {
        height: 64,

        paddingHorizontal: 18,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",
    },

    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 36,
        height: 36,

        borderRadius: 18,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: Colors.primaryGlow,

        marginRight: 14,
    },

    title: {
        color: Colors.text,
        fontSize: 15,
        fontWeight: "600",
    },
});