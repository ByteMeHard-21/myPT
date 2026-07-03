import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
} from "react-native";

import StatsGrid from "./components/StatsGrid";
import WeeklyGoalCard from "./components/WeeklyGoalCard";
import MuscleDistributionCard from "./components/MuscleDistributionCard";
import PersonalRecordCard from "./components/PersonalRecordCard";
import RecentWorkoutCard from "./components/RecentWorkoutCard";
import AchievementCard from "./components/AchievementCard";
import Header from "../workout/components/Header";
import { Colors, Spacing, } from "../workout/theme";
import WorkoutConsistencyCalendar from "./components/WorkoutCalendar";
import { useAuthStore } from "../../store/authStore";
import { AnalysisDashboard } from "./analysis.types";
import { getActiveWorkoutSession } from "../workout/workout.api";
import { getAnalysisDashboard } from "./analysis.api";


export default function AnalysisScreen() {
    const user = useAuthStore(
        (state) => state.session
    );

    const [period, setPeriod] = useState<
        "week" | "month"
    >("week");

    const [loading, setLoading] =
        useState(true);

    const [dashboard, setDashboard] =
        useState<AnalysisDashboard | null>(
            null
        );

    useEffect(() => {
        loadDashboard();
    }, [period]);

    async function loadDashboard() {
        if (!user?.user.id) {
            return;
        }
        try {
            setLoading(true);
            const response =
                await getAnalysisDashboard(
                    user.user.id,
                    period
                );

            setDashboard(response);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {

        return (

            <ActivityIndicator
                size="large"
                color="#A3E635"
                style={{ flex: 1 }}
            />

        );

    }

    if (!dashboard) {
        return null;
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <View style={{ marginTop: 10 }} />
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Analysis
                    </Text>

                    <Text style={styles.subtitle}>
                        Your fitness journey and consistency.
                    </Text>
                </View>

                <StatsGrid overview={dashboard.overview} />

                <WeeklyGoalCard period={period}
                    setPeriod={setPeriod}
                    volumeTrend={dashboard.volumeTrend} />
                <WorkoutConsistencyCalendar calendar={dashboard.calendar} />

                <MuscleDistributionCard data={dashboard.muscleDistribution} />

                <PersonalRecordCard
                    records={dashboard.personalRecords}
                />

                <RecentWorkoutCard
                    workouts={
                        dashboard?.recentWorkouts ?? []
                    }
                />

                <AchievementCard
                    achievements={
                        dashboard?.achievements ?? []
                    }
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    content: {
        marginTop: 10,
        padding: Spacing.lg,
    },
    title: {
        color: Colors.text,
        fontSize: 28,
        fontWeight: "700",
    },

    subtitle: {
        marginTop: Spacing.xs,

        color: Colors.subText,

        fontSize: 14,

        lineHeight: 20,
    },
});