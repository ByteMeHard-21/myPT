import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Ionicons
                    name="fitness"
                    size={64}
                    color="#84CC16"
                />

                <Text style={styles.title}>
                    Welcome Home 👋
                </Text>

                <Text style={styles.subtitle}>
                    You have successfully logged in.
                </Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>
                        Start Workout
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B1110",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    card: {
        width: "100%",
        backgroundColor: "#111827",
        borderRadius: 24,
        padding: 32,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },
    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "700",
        marginTop: 16,
    },
    subtitle: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 16,
        textAlign: "center",
        marginTop: 8,
        marginBottom: 24,
    },
    button: {
        backgroundColor: "#84CC16",
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 14,
    },
    buttonText: {
        color: "#0B1110",
        fontSize: 16,
        fontWeight: "700",
    },
});