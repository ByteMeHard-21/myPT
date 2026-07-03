import React from "react";
import {
    View,
    StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import StatCard from "./StatCard";

import {
    Colors,
    Spacing,
} from "../../workout/theme";
import { AnalysisOverview } from "../analysis.types";

interface Props {
    overview: AnalysisOverview;
}
export default function StatsGrid({
    overview,
}: Props) {

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <StatCard
                    value={overview.totalWorkouts.toString()}
                    label="Workouts"
                    icon={
                        <Ionicons
                            name="barbell"
                            size={20}
                            color={Colors.primary}
                        />
                    }
                />

                <StatCard
                    value={overview.currentStreak.toString()}
                    label="Days"
                    icon={
                        <Ionicons
                            name="calendar"
                            size={20}
                            color={Colors.primary}
                        />
                    }
                />
            </View>

            <View style={styles.row}>
                <StatCard
                    value={`${overview.totalVolume.toLocaleString()} kg`}
                    label="Volume"
                    icon={
                        <Ionicons
                            name="fitness"
                            size={20}
                            color={Colors.primary}
                        />
                    }
                />


            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },

    row: {
        flexDirection: "row",

        gap: Spacing.md,
    },
});