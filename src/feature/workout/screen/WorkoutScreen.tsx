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
} from "react-native";
import { Activity, Dumbbell, Clock3 } from "lucide-react-native";

import Header from "../components/Header";
import Calendar from "../components/Calendar";
import ExerciseCards from "../components/ExerciseCards";
import StartWorkoutButton from "../components/StartWorkoutButton";
import { useAuthStore } from "../../../store/authStore";
import { getCurrentWorkout } from "../workout.api";
import { CurrentWorkout } from "../workout.types";
import RecoveryScreen from "./EmptyWorkoutScreen";

import { Colors, Radius, Spacing } from "../theme";

const workout = {
    title: "Push Day",
    subtitle: "Chest • Shoulders • Triceps",

    duration: "58 min",
    exercises: 8,
    difficulty: "Moderate",
};

export default function WorkoutScreen() {
    const profile = useAuthStore(state => state.profile);
    const user = useAuthStore((state) => state.session);
    const [workout, setWorkout] =
        useState<CurrentWorkout | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const userId = user.user.id;

        async function loadWorkout() {
            try {
                const data = await getCurrentWorkout(userId);

                setWorkout(data);
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

    if (!workout) {
        return <RecoveryScreen />;
    }

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
                                color={Colors.text}
                                strokeWidth={2.2}
                            />
                            <Text style={styles.chipText}>
                                {workout.estimatedDuration}
                            </Text>
                        </View>

                        <View style={styles.chip}>
                            <Dumbbell
                                size={16}
                                color={Colors.text}
                                strokeWidth={2.2}
                            />
                            <Text style={styles.chipText}>
                                {workout.exerciseCount} Exercises
                            </Text>
                        </View>

                        <View style={styles.chip}>
                            <Activity
                                size={16}
                                color={Colors.text}
                                strokeWidth={2.2}
                            />
                            <Text style={styles.chipText}>
                                {workout.difficulty}
                            </Text>
                        </View>
                    </View>


                    {/* Exercise Grid */}
                    <ExerciseCards
                        exercises={workout.exercises}
                    />


                    {/* CTA */}
                    <View style={{ height: 28 }} />
                    <StartWorkoutButton />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B2D2A",
    },

    content: {
        paddingHorizontal: 7,
        paddingBottom: 10,
    },

    heroContainer: {
        marginTop: 24,
        backgroundColor: "#143532",
        borderRadius: 28,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 8,
    },

    sectionTitle: {
        color: "#A3E635",
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 2,
    },

    workoutTitle: {
        marginTop: 12,

        color: "#FFFFFF",

        fontSize: 34,

        fontWeight: "700",
    },

    subtitle: {
        marginTop: 8,

        color: "#B7CBC6",

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
        paddingHorizontal: 16,
        backgroundColor: "#19413C",
        borderRadius: Radius.pill,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        marginRight: 10,
        marginBottom: 10,
    },

    chipText: {
        marginLeft: 6,
        color: Colors.text,
        fontSize: 13,
        fontWeight: "600",
    },

});