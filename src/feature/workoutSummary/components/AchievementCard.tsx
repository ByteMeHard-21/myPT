import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface Props {
    personalRecords: number;
}

export default function AchievementCard({
    personalRecords,
}: Props) {
    return (
        <View style={styles.container}>

            <View style={styles.icon}>
                <Ionicons
                    name="trophy"
                    size={26}
                    color="#A3E635"
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>
                    Achievements
                </Text>

                <Text style={styles.subtitle}>
                    {personalRecords > 0
                        ? `${personalRecords} Personal Record${personalRecords > 1 ? "s" : ""}`
                        : "Workout Completed"}
                </Text>

                <Text style={styles.description}>
                    Keep showing up. Consistency builds strength.
                </Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        backgroundColor: "#102320",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },

    icon: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#17332F",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 18,
    },

    content: {
        flex: 1,
    },

    title: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "700",
    },

    subtitle: {
        color: "#A3E635",
        fontSize: 15,
        fontWeight: "600",
        marginTop: 4,
    },

    description: {
        marginTop: 8,
        color: "rgba(255,255,255,0.65)",
        lineHeight: 20,
    },

});