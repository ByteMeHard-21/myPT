import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    GestureResponderEvent,
} from "react-native";

import { useRouter } from "expo-router";

import { Colors, Radius, Spacing } from "../theme";
interface StartWorkoutButtonProps {
    onPress: (event: GestureResponderEvent) => void;
    title?: string;
    disabled?: boolean;
}

const StartWorkoutButton = ({
    onPress,
    title = "Start Workout",
    disabled = false,
}: StartWorkoutButtonProps) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.button}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.text}>
                {title}
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