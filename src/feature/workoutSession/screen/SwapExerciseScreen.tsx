import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,

} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import { getSwapExercises, swapWorkoutExercise } from "../workoutSession.api";
import { useWorkoutSessionStore } from "../../../store/workoutSessionStore";
import SwapExerciseCard from "../components/SwapExerciseCard";

import {
    Colors,
    Radius,
    Spacing,
} from "../../workout/theme";
import { WorkoutSessionExercise } from "../workoutSession.types";

export default function SwapExerciseScreen() {
    const {
        planExerciseId,
        exerciseName,
    } = useLocalSearchParams<{
        planExerciseId: string;
        exerciseName: string;
    }>();
    const replaceCurrentExercise =
        useWorkoutSessionStore(
            (state) => state.replaceCurrentExercise
        );

    const [loading, setLoading] = useState(true);

    const [selectedId, setSelectedId] =
        useState<string>();

    const [exercises, setExercises] =
        useState<WorkoutSessionExercise[]>([]);

    // data/mockExercises.ts

    // const MOCK_EXERCISES = [
    //     {
    //         id: "1",
    //         name: "Bench Press",
    //         thumbnail: require("../../../../assets/workout/bench-dip.jpg"),
    //     },
    //     {
    //         id: "2",
    //         name: "Lat Row",
    //         thumbnail: require("../../../../assets/workout/bench-dip.jpg"),
    //     },
    //     {
    //         id: "3",
    //         name: "Jogging",
    //         thumbnail: require("../../../../assets/workout/bench-dip.jpg"),
    //     },
    //     {
    //         id: "4",
    //         name: "Box Jumps",
    //         thumbnail: require("../../../../assets/workout/bench-dip.jpg"),
    //     },
    // ];

    useEffect(() => {

        loadExercises();

    }, []);

    async function loadExercises() {

        if (!planExerciseId) {

            setLoading(false);

            return;

        }

        try {

            const response =
                await getSwapExercises(
                    planExerciseId
                );


            setExercises(response);

        } catch (error) {

            console.log(error);

            Alert.alert(
                "Error",
                "Unable to load swap exercises."
            );

        } finally {

            setLoading(false);

        }

    }

    async function handleSwapExercise() {

        if (!selectedId) {
            return;
        }

        const selectedExercise =
            exercises.find(
                (item) =>
                    item.exerciseId === selectedId
            );

        if (!selectedExercise) {
            return;
        }

        try {

            //-------------------------------------------------
            // Persist swap
            //-------------------------------------------------

            await swapWorkoutExercise(
                planExerciseId,
                selectedExercise.exerciseId
            );

            //-------------------------------------------------
            // Update runtime session
            //-------------------------------------------------

            replaceCurrentExercise(
                selectedExercise
            );

            //-------------------------------------------------
            // Return to workout session
            //-------------------------------------------------

            router.back();

        } catch (error) {

            console.log(error);

            Alert.alert(
                "Error",
                "Unable to swap exercise."
            );

        }

    }

    if (loading) {

        return (

            <SafeAreaView
                style={styles.container}
            >

                <ActivityIndicator
                    size="large"
                    color="#A3E635"
                    style={{ flex: 1 }}
                />

            </SafeAreaView>

        );

    }


    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}

            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={Colors.text}
                    />
                </TouchableOpacity>

                <Text style={styles.title}>
                    Swap Exercise
                </Text>

                <View style={{ width: 24 }} />
            </View>

            {/* Subtitle */}

            <Text style={styles.replaceText}>
                Replacing:
                <Text style={styles.exercise}>
                    {" "}
                    {exerciseName}
                </Text>
            </Text>

            <FlatList
                data={exercises}
                keyExtractor={(item) => item.exerciseId}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (

                    <SwapExerciseCard

                        item={{
                            id: item.exerciseId,

                            name: item.name,

                            thumbnail: item.thumbnailUrl,
                        }}

                        selected={
                            selectedId ===
                            item.exerciseId
                        }

                        onPress={() =>
                            setSelectedId(
                                item.exerciseId
                            )
                        }

                    />

                )}
            />

            {/* Bottom Bar */}

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.cancelButton} onPress={() => { router.back() }}
                >
                    <Text style={styles.cancelText}>
                        Cancel
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.9}
                    disabled={!selectedId}
                    onPress={handleSwapExercise}
                    style={[
                        styles.swapButton,
                        !selectedId && {
                            opacity: 0.45,
                        },
                    ]}
                >
                    <Text style={styles.swapText}>
                        SWAP EXERCISE
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: Colors.background,
    },

    header: {
        flexDirection: "row",
        marginTop: 15,
        alignItems: "center",

        paddingHorizontal: Spacing.lg,

        paddingVertical: Spacing.lg,
    },

    title: {
        flex: 1,

        color: Colors.text,

        fontSize: 22,

        fontWeight: "700",

        marginLeft: 14,
    },

    replaceText: {
        color: Colors.subText,

        paddingHorizontal: Spacing.lg,

        marginBottom: 20,
    },

    exercise: {
        color: Colors.primary,

        fontWeight: "700",
    },

    list: {
        paddingHorizontal: Spacing.lg,

        paddingBottom: 120,
    },

    row: {
        justifyContent: "space-between",

        gap: Spacing.md,
    },

    bottomBar: {
        position: "absolute",

        bottom: 0,

        left: 0,

        right: 0,

        flexDirection: "row",

        borderTopWidth: 1,

        borderTopColor: Colors.border,

        backgroundColor: Colors.background,

        padding: Spacing.lg,

        gap: 14,
    },

    cancelButton: {
        flex: 1,

        height: 54,

        borderRadius: Radius.pill,

        backgroundColor: Colors.surface,

        borderWidth: 1,

        borderColor: Colors.border,

        justifyContent: "center",

        alignItems: "center",
    },

    swapButton: {
        flex: 2,

        height: 54,

        borderRadius: Radius.pill,

        backgroundColor: Colors.primary,

        justifyContent: "center",

        alignItems: "center",
    },

    cancelText: {
        color: Colors.text,

        fontWeight: "600",

        fontSize: 16,
    },

    swapText: {
        color: Colors.background,

        fontWeight: "800",

        fontSize: 15,
    },
});