import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";

import { useRouter } from "expo-router";

import { Colors, Radius, Spacing } from "../theme";

const StartWorkoutButton = () => {
    const router = useRouter();

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.button}
            onPress={() =>
                router.push("/tabs/startworkout")
            }
        >
            <Text style={styles.text}>
                Start Workout
            </Text>
        </TouchableOpacity>
    );
};

export default React.memo(StartWorkoutButton);

const styles = StyleSheet.create({
    button: {
        marginTop: Spacing.xxl,
        marginBottom: Spacing.xxl,

        height: 56,

        borderRadius: Radius.pill,

        backgroundColor: Colors.primary,

        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        color: Colors.background,

        fontSize: 17,

        fontWeight: "700",
    },
});