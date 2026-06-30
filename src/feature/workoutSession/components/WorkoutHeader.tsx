import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WorkoutHeaderProps {
    workoutName: string;
    currentExercise: number;
    totalExercises: number;
    onBackPress: () => void;
}

export default function WorkoutHeader({
    workoutName,
    currentExercise,
    totalExercises,
    onBackPress,
}: WorkoutHeaderProps) {
    const progress = currentExercise / totalExercises;
    const percentage = Math.round(progress * 100);

    return (
        <View style={styles.container}>
            {/* Top Row */}

            <View style={styles.topRow}>
                <TouchableOpacity
                    style={styles.backButton}
                    activeOpacity={0.8}
                    onPress={onBackPress}
                >
                    <Ionicons
                        name="arrow-back"
                        size={20}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        {workoutName}
                    </Text>
                </View>

                <Text style={styles.exerciseText}>
                    Exercise {currentExercise} of {totalExercises}
                </Text>
            </View>

            {/* Progress Section */}

            <View style={styles.progressSection}>
                <View style={styles.progressBackground}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${percentage}%`,
                            },
                        ]}
                    />
                </View>

                <Text style={styles.progressText}>
                    {percentage}% Complete
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#102E2C",
        paddingHorizontal: 18,
        paddingTop: 12,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2A4B45",
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,

        backgroundColor: "rgba(23,60,56,0.75)",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",

        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },

    titleContainer: {
        flex: 1,
        marginLeft: 14,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "700",
    },

    exerciseText: {
        color: "rgba(255,255,255,0.65)",
        fontSize: 13,
        fontWeight: "600",
    },

    progressSection: {
        marginTop: 14,
    },

    progressBackground: {
        height: 6,
        borderRadius: 10,
        backgroundColor: "#21504A",
        overflow: "hidden",
    },

    progressFill: {
        height: 6,
        borderRadius: 10,
        backgroundColor: "#A3E635",
    },

    progressText: {
        marginTop: 8,
        alignSelf: "flex-end",
        color: "#A3E635",
        fontSize: 12,
        fontWeight: "700",
    },
});