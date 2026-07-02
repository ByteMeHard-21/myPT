import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface Props {
    onPress: () => void;
}

export default function WorkoutShareCard({
    onPress,
}: Props) {

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            style={styles.container}
            onPress={onPress}
        >
            <Ionicons
                name="share-social"
                size={22}
                color="#082320"
            />

            <Text style={styles.text}>
                Share Workout
            </Text>

        </TouchableOpacity>
    );

}

const styles = StyleSheet.create({

    container: {
        height: 58,
        borderRadius: 16,
        backgroundColor: "#A3E635",

        alignItems: "center",
        justifyContent: "center",

        flexDirection: "row",
    },

    text: {
        marginLeft: 10,
        color: "#082320",
        fontSize: 16,
        fontWeight: "700",
    },

});