import React, { useState, useEffect } from "react";

import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import {
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

import SummaryStatCard from "./components/SummaryStatCard";
import AchievementCard from "./components/AchievementCard";
import MuscleChart from "./components/MuscleChart";
import WorkoutShareCard from "./components/WorkoutShareCard";

import { WorkoutSummary } from "./workoutSummary.types";
import { getWorkoutSummary } from "./workoutSummary.api";
import {
    formatCalories,
    formatDuration,
    formatVolume,
    formatXP,
} from "./workoutSummary.utils";

export default function WorkoutSummaryScreen() {

    const { sessionId } = useLocalSearchParams<{
        sessionId: string;
    }>();

    const [loading, setLoading] = useState(true);

    const [summary, setSummary] =
        useState<WorkoutSummary | null>(null);


    // Replace with API later
    // const summary: WorkoutSummary = {
    //     workoutTitle: "Push Day",

    //     stats: {
    //         durationSeconds: 3240,
    //         totalExercises: 8,
    //         completedExercises: 8,
    //         totalSets: 27,
    //         totalVolume: 8420,
    //         calories: 426,
    //         xpEarned: 120,
    //     },

    //     achievements: {
    //         personalRecords: 2,
    //         streakDays: 5,
    //         levelUp: false,
    //     },

    //     musclesWorked: [
    //         {
    //             muscle: "Chest",
    //             percentage: 45,
    //         },
    //         {
    //             muscle: "Shoulders",
    //             percentage: 30,
    //         },
    //         {
    //             muscle: "Triceps",
    //             percentage: 25,
    //         },
    //     ],

    //     message: {
    //         title: "Amazing Work!",
    //         subtitle: "You showed up and got stronger today.",
    //     },
    // };


    useEffect(() => {
        loadSummary();
    }, []);

    async function loadSummary() {

        if (!sessionId) {
            Alert.alert(
                "Error",
                "Workout session not found."
            );

            router.replace("/(tabs)/workout");

            return;
        }

        try {

            setLoading(true);

            const response =
                await getWorkoutSummary(sessionId);

            setSummary(response);

        } catch (error) {

            console.log(error);

            Alert.alert(
                "Error",
                "Unable to load workout summary."
            );

            router.replace("/(tabs)/workout");

        } finally {

            setLoading(false);

        }

    }

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#A3E635"
                />
            </SafeAreaView>
        );
    }

    if (!summary) {
        return null;
    }

    const statCards = [

        {
            label: "Duration",
            value: formatDuration(summary.durationSeconds),
            icon: (
                <Ionicons
                    name="time-outline"
                    size={22}
                    color="#A3E635"
                />
            ),
        },

        {
            label: "Exercises",
            value: `${summary.completedExercises}/${summary.totalExercises}`,
            icon: (
                <MaterialCommunityIcons
                    name="arm-flex"
                    size={22}
                    color="#A3E635"
                />
            ),
        },

        {
            label: "Sets",
            value: `${summary.totalSets}`,
            icon: (
                <Ionicons
                    name="barbell-outline"
                    size={22}
                    color="#A3E635"
                />
            ),
        },

        {
            label: "Volume",
            value: formatVolume(summary.totalVolume),
            icon: (
                <MaterialCommunityIcons
                    name="weight-kilogram"
                    size={22}
                    color="#A3E635"
                />
            ),
        },

        {
            label: "Calories",
            value: formatCalories(summary.calories),
            icon: (
                <Ionicons
                    name="flame-outline"
                    size={22}
                    color="#A3E635"
                />
            ),
        },

        {
            label: "XP",
            value: formatXP(summary.xpEarned),
            icon: (
                <Ionicons
                    name="star"
                    size={22}
                    color="#A3E635"
                />
            ),
        },

    ];

    return (


        <SafeAreaView style={styles.container}>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                {/* Header */}

                <View style={styles.header}>

                    <View style={styles.successIcon}>

                        <Ionicons
                            name="checkmark"
                            size={34}
                            color="#082320"
                        />

                    </View>

                    <Text style={styles.title}>
                        {summary.congratulationsTitle}
                    </Text>

                    <Text style={styles.workoutTitle}>
                        {summary.workoutTitle}
                    </Text>

                    <Text style={styles.subtitle}>
                        {summary.congratulationsMessage}
                    </Text>

                </View>

                {/* Stats */}

                <View style={styles.grid}>
                    {statCards.map((item) => (
                        <SummaryStatCard
                            key={item.label}
                            icon={item.icon}
                            value={item.value}
                            label={item.label}
                        />
                    ))}
                </View>


                {/* Achievement */}

                <AchievementCard
                    personalRecords={summary.personalRecords}
                />

                {/* Muscle Chart */}

                <MuscleChart
                    data={summary.musclesWorked}
                />

                {/* Share */}

                <WorkoutShareCard
                    onPress={() => {

                        Alert.alert(
                            "Coming Soon",
                            "Workout sharing will be available soon."
                        );

                    }}
                />

                {/* Home */}

                <TouchableOpacity
                    style={styles.homeButton}
                    activeOpacity={0.9}
                    onPress={() => {
                        router.dismissAll();
                        router.replace("/(tabs)/workout");
                    }}
                >

                    <Text style={styles.homeText}>
                        Back to Home
                    </Text>

                </TouchableOpacity>

            </ScrollView>

        </SafeAreaView>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#071A17",
    },

    content: {
        padding: 22,
        paddingBottom: 50,
    },

    header: {
        alignItems: "center",
        marginBottom: 30,
    },

    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#A3E635",

        justifyContent: "center",
        alignItems: "center",

        marginBottom: 20,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "800",
    },

    workoutTitle: {
        marginTop: 10,

        color: "#A3E635",

        fontSize: 22,

        fontWeight: "700",
    },

    subtitle: {
        marginTop: 10,

        color: "rgba(255,255,255,0.7)",

        textAlign: "center",

        lineHeight: 22,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: 16,
    },

    homeButton: {
        marginTop: 22,

        height: 58,

        borderRadius: 16,

        backgroundColor: "#17332F",

        justifyContent: "center",
        alignItems: "center",
    },

    homeText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "#071A17",
        justifyContent: "center",
        alignItems: "center",
    },
});