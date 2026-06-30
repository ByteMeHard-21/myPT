import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function RecoveryHeroCard() {
    return (
        <View style={styles.card}>
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>Recovery Day</Text>

                <Text style={styles.desc}>
                    Today is your scheduled recovery day. Rest is part of progress and
                    prepares your body for the next workout.
                </Text>
            </View>

            <Feather
                name="activity"
                size={48}
                color="rgba(255,255,255,0.18)"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 18,
        backgroundColor: "#19413C",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#2A4B45",
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
    },

    title: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "700",
        marginBottom: 10,
    },

    desc: {
        color: "rgba(255,255,255,0.65)",
        lineHeight: 22,
        fontSize: 14,
        paddingRight: 10,
    },
});