import React, { useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../../store/authStore";

import { Colors, Spacing, Radius } from "../theme";


const Header = () => {
    const today = new Date();

    const formattedDate = useMemo(() =>
        new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
        }),
        []);
    const profile = useAuthStore((s) => s.profile);

    return (
        <View style={styles.container}>
            {/* Profile */}
            <View style={{ marginLeft: 12 }}>
                <TouchableOpacity activeOpacity={0.8} >
                    <Image
                        source={
                            profile?.avatar_url
                                ? {
                                    uri: `${profile.avatar_url}?v=${Date.now()}`,
                                }
                                : require("../../../../assets/images/placeholder_img.jpg")
                        }
                        style={styles.avatar}
                    />
                </TouchableOpacity>
            </View>

            {/* Center Content */}
            <View style={styles.centerContainer}>
                <Text style={styles.hello}> Hello, {profile?.full_name?.split(" ")[0] ?? "Athlete"}</Text>
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
    avatar: {
        width: 52,
        height: 52,

        borderRadius: 26,

        borderWidth: 2,
        borderColor: Colors.border,

        backgroundColor: Colors.surface,
    },
});