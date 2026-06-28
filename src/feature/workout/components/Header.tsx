import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors, Spacing, Radius } from "../theme";

const Header = () => {
    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <View style={styles.container}>
            {/* Profile */}
            <TouchableOpacity activeOpacity={0.8}>
                <Ionicons
                    name="person-circle-outline"
                    size={42}
                    color={Colors.text}
                />
            </TouchableOpacity>

            {/* Center Content */}
            <View style={styles.centerContainer}>
                <Text style={styles.hello}>Hello, Alex</Text>
                <Text style={styles.date}>{formattedDate}</Text>
            </View>

            {/* Notification */}
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.notificationButton}
            >
                <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={Colors.text}
                />
            </TouchableOpacity>
        </View>
    );
};

export default React.memo(Header);

const styles = StyleSheet.create({
    container: {
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    hello: {
        color: Colors.text,
        fontSize: 20,
        fontWeight: "700",
    },

    date: {
        marginTop: 3,
        color: Colors.subText,
        fontSize: 13,
        fontWeight: "500",
    },

    notificationButton: {
        width: 46,
        height: 46,
        borderRadius: 23,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
    },
});