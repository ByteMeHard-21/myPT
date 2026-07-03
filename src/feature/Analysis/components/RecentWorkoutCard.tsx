import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import SectionCard from "./SectionCard";

import {
    Colors,
    Spacing,
    Radius,
} from "../../workout/theme";
import { RecentWorkout } from "../analysis.types";

interface Workout {
    name: string;
    duration: string;
    date: string;
}

interface Props {
    workouts: RecentWorkout[];
}

const DEFAULT_WORKOUTS: Workout[] = [
    {
        name: "Push Day",
        duration: "58 min",
        date: "Today",
    },
    {
        name: "Leg Power",
        duration: "64 min",
        date: "Yesterday",
    },
];

export default function RecentWorkoutCard({
    workouts,
}: Props) {
    function formatDate(date: string) {
        const completed = new Date(date);

        const today = new Date();
        const yesterday = new Date();

        yesterday.setDate(today.getDate() - 1);

        // Remove time portion for comparison
        const completedOnly = new Date(
            completed.getFullYear(),
            completed.getMonth(),
            completed.getDate()
        );

        const todayOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const yesterdayOnly = new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate()
        );

        if (completedOnly.getTime() === todayOnly.getTime()) {
            return "Today";
        }

        if (completedOnly.getTime() === yesterdayOnly.getTime()) {
            return "Yesterday";
        }

        return completed.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    return (
        <SectionCard>
            <Text style={styles.title}>
                Recent Workouts
            </Text>

            {workouts.map((workout, index) => (
                <View
                    key={index}
                    style={[
                        styles.item,
                        index !== workouts.length - 1 &&
                        styles.spacing,
                    ]}
                >
                    <View style={styles.icon}>
                        <Ionicons
                            name="barbell"
                            size={20}
                            color={Colors.primary}
                        />
                    </View>

                    <View style={styles.info}>
                        <Text style={styles.name}>
                            {workout.workoutTitle}
                        </Text>

                        <Text style={styles.date}>
                            {formatDate(workout.completedAt)}

                        </Text>
                    </View>

                    <Text style={styles.duration}>
                        {workout.durationMinutes}
                    </Text>
                </View>
            ))}
        </SectionCard>
    );
}

const styles = StyleSheet.create({
    title: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: Spacing.lg,
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
    },

    spacing: {
        marginBottom: Spacing.lg,
    },

    icon: {
        width: 42,
        height: 42,
        borderRadius: Radius.pill,
        backgroundColor: Colors.surfaceElevated,
        justifyContent: "center",
        alignItems: "center",
    },

    info: {
        flex: 1,
        marginLeft: Spacing.md,
    },

    name: {
        color: Colors.text,
        fontSize: 15,
        fontWeight: "600",
    },

    date: {
        color: Colors.subText,
        marginTop: 2,
        fontSize: 13,
    },

    duration: {
        color: Colors.primary,
        fontWeight: "700",
        fontSize: 15,
    },
});