import {
    useEffect,
    useState,
} from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { Activity, Dumbbell, Clock3 } from "lucide-react-native";
import { router } from "expo-router";

import Header from "../components/Header";
import Calendar from "../components/Calendar";
import ExerciseCards from "../components/ExerciseCards";
import StartWorkoutButton from "../components/StartWorkoutButton";
import { useAuthStore } from "../../../store/authStore";
import { getCurrentWorkout, advanceWorkoutDay } from "../workout.api";
import { CurrentWorkout, WorkoutExercise, WorkoutOverview } from "../workout.types";
import RecoveryScreen from "./EmptyWorkoutScreen";
import { useWorkoutSessionStore } from "../../../store/workoutSessionStore";
import { startWorkout, getActiveWorkoutSession } from "../workout.api";
import { WorkoutSession, WorkoutSet } from "../../workoutSession/workoutSession.types";

import { Colors, Radius, Spacing } from "../theme";
import WorkoutCompletedScreen from "./WorkoutCompletedScreen";
import { resumeWorkout } from "../../workoutSession/workoutSession.api";

export default function WorkoutScreen() {
    const profile = useAuthStore(state => state.profile);
    const user = useAuthStore((state) => state.session);
    const [overview, setOverview] =
        useState<WorkoutOverview | null>(null);

    const [activeSession, setActiveSession] =
        useState<WorkoutSession | null>(null);

    const setWorkoutSession = useWorkoutSessionStore(
        (state) => state.setWorkoutSession
    );

    const setSets = useWorkoutSessionStore(
        (state) => state.setSets
    );

    const handleGetChatHistory = async () => {
        try {
            const res = await fetch(
                "https://mgyiaoyxyqwdprgflhma.supabase.co/functions/v1/get-ai-chat-history",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`,
                    },
                }
            );

            const data = await res.json();

            console.log("CHAT HISTORY:", data);
        } catch (err) {
            console.log("FULL ERROR:", err);
        }
    };

    const [loading, setLoading] = useState(true);

    async function handleResumeWorkout() {

        if (!activeSession) return;

        try {

            await resumeWorkout(
                activeSession.sessionId
            );

            const exercise =
                activeSession.exercises[
                activeSession.currentExerciseIndex
                ];

            const recommendedReps =
                Number(
                    exercise.reps.split("-")[0]
                ) || 0;

            const runtimeSets: WorkoutSet[] =
                Array.from(
                    {
                        length: exercise.sets,
                    },
                    (_, index) => ({
                        setNumber:
                            index + 1,

                        targetReps:
                            recommendedReps,

                        enteredWeight: "",

                        enteredReps: "",

                        completed: false,
                    })
                );

            activeSession.status =
                "in_progress";

            activeSession.runningSince =
                new Date().toISOString();

            setWorkoutSession(
                activeSession
            );

            setSets(runtimeSets);

            router.push(
                "/workoutsession"
            );

        } catch (error) {

            console.log(error);

        }

    }

    async function handleStartWorkout() {
        if (!user || !workout) return;

        try {
            const session = await startWorkout(
                user.user.id,
                workout
            );

            const currentExercise =
                session.exercises[
                session.currentExerciseIndex
                ];

            const recommendedReps =
                Number(
                    currentExercise.reps.split("-")[0]
                ) || 0;

            const runtimeSets: WorkoutSet[] = Array.from(
                {
                    length: currentExercise.sets,
                },
                (_, index) => ({
                    setNumber: index + 1,


                    targetReps: recommendedReps,

                    enteredWeight: "",

                    enteredReps: "",

                    completed: false,
                })
            );

            setWorkoutSession(session);

            setSets(runtimeSets);

            router.push("/workoutsession");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!user) return;

        const userId = user.user.id;

        async function loadWorkout() {
            try {
                await advanceWorkoutDay(userId);

                const existing =
                    await getActiveWorkoutSession(
                        userId
                    );

                if (existing) {

                    setActiveSession(existing);

                }

                const data = await getCurrentWorkout(userId);

                setOverview(data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        loadWorkout();
    }, [user]);

    if (loading) {
        return null;
    }

    if (!overview) {
        return null;
    }

    if (
        overview.status === "no_workout"
    ) {
        return <RecoveryScreen />;
    }

    if (
        overview.status === "completed_today"
    ) {
        return <WorkoutCompletedScreen />;
    }

    const workout = overview.workout!;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ marginTop: 20 }}>
                    <Header />
                </View>

                {/* Calendar */}

                <Calendar />

                {/* Hero */}

                <View style={styles.heroContainer}>
                    <Text style={styles.sectionTitle}>
                        TODAY'S WORKOUT
                    </Text>

                    <Text style={styles.workoutTitle}>
                        {workout.title}
                    </Text>

                    <Text style={styles.subtitle}>
                        {workout.subtitle}
                    </Text>

                    <View style={styles.chipsContainer}>
                        <View style={styles.chip}>
                            <Clock3
                                size={16}
                                color={Colors.primary}
                                strokeWidth={2.2}
                            />
                            <Text style={styles.chipText}>
                                {workout.estimatedDuration}
                            </Text>
                        </View>

                        <View style={styles.chip}>
                            <Dumbbell
                                size={16}
                                color={Colors.primary}
                                strokeWidth={2.2}
                            />
                            <Text style={styles.chipText}>
                                {workout.exerciseCount} Exercises
                            </Text>
                        </View>

                        <View style={styles.chip}>
                            <Activity
                                size={16}
                                color={Colors.primary}
                                strokeWidth={2.2}
                            />
                            <Text style={styles.chipText}>
                                {workout.difficulty}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />
                    {/* Exercise Grid */}
                    <ExerciseCards
                        exercises={workout.exercises}
                    />


                    {/* CTA */}
                    <View style={{ height: Spacing.xl }} />
                    <StartWorkoutButton
                        title={
                            activeSession
                                ? "Resume Workout"
                                : "Start Workout"
                        }
                        onPress={
                            activeSession
                                ? handleResumeWorkout
                                : handleStartWorkout
                        }
                    />
                </View>
                <TouchableOpacity onPress={handleGetChatHistory}>
                    <Text>Get Chat History</Text>
                </TouchableOpacity>

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
        paddingHorizontal: Spacing.sm,
        paddingBottom: Spacing.md,
    },

    heroContainer: {
        marginTop: Spacing.xl,
        backgroundColor: Colors.surface,
        borderRadius: 28,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.18,
        shadowRadius: 20,
        elevation: 8,
    },

    sectionTitle: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.8,
    },

    workoutTitle: {
        marginTop: 12,
        color: Colors.text,
        fontSize: 34,
        fontWeight: "700",
    },

    subtitle: {
        marginTop: 8,
        color: Colors.subText,
        fontSize: 16,
    },

    chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",

        marginTop: 24,
        marginBottom: 32,
    },

    chip: {
        height: 36,
        paddingHorizontal: 14,
        borderRadius: Radius.pill,
        backgroundColor: Colors.surfaceElevated,
        borderWidth: 1,
        borderColor: Colors.border,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
        marginBottom: 10,
    },

    chipText: {
        marginLeft: 6,
        color: Colors.text,
        fontSize: 13,
        fontWeight: "600",
    },

    divider: {
        height: 1,
        backgroundColor: Colors.divider,
        marginBottom: 24,
    },
});