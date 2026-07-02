import React, { useState, useRef, useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal
} from "react-native";
import { Animated, Easing } from "react-native";
import { Fullscreen } from "lucide-react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from 'expo-video';
import { WorkoutSessionExercise } from "./workoutSession.types";
import { WorkoutSet } from "./workoutSession.types"
import { router } from "expo-router";

import WorkoutHeader from "./components/WorkoutHeader";
import SetTracker from "./components/SetTracker";
import WorkoutAccordion from "./components/WorkoutAccordion";
import { useWorkoutSessionStore } from "../../store/workoutSessionStore";
import RestTimerOverlay from "./components/RestTimerOverlay";
import { completeExercise, finishWorkout, pauseWorkout } from "../workoutSession/workoutSession.api";
import { useAuthStore } from "../../store/authStore";
import { getWorkoutElapsedSeconds } from "../../utils/workoutTimer";


export default function WorkoutSessionScreen() {

    const {
        session,
        currentExerciseIndex,
        sets,
        updateWeight,
        updateReps,
        toggleCompleted,
        nextExercise,

        isResting,
        restSecondsRemaining,
        startRest,
        stopRest,
        pauseSession,
        tickRest,
    } = useWorkoutSessionStore();

    const [showFullscreenGif, setShowFullscreenGif] = useState(false);
    const [undoVisible, setUndoVisible] = useState(false);
    const [undoSet, setUndoSet] = useState<number | null>(null);
    const toastAnim = useRef(new Animated.Value(0)).current;
    const [initialRestSeconds, setInitialRestSeconds] = useState(0);
    const [elapsed, setElapsed] = useState(0);

    const user = useAuthStore(
        (state) => state.session
    );

    const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    const buildRuntimeSets = (
        exercise: WorkoutSessionExercise
    ): WorkoutSet[] => {
        const recommendedReps =
            Number(exercise.reps.split("-")[0]) || 0;

        return Array.from(
            { length: exercise.sets },
            (_, index) => ({
                setNumber: index + 1,

                targetReps: recommendedReps,

                enteredWeight: "",

                enteredReps: "",

                completed: false,
            })
        );
    };

    const toggleSet = (setNumber: number) => {
        toggleCompleted(setNumber);
        setInitialRestSeconds(exercise.restSeconds);

        startRest(exercise.restSeconds);

        setUndoSet(setNumber);
        setUndoVisible(true);

        Animated.spring(toastAnim, {
            toValue: 1,
            useNativeDriver: true,
            damping: 14,
            stiffness: 180,
        }).start();

        if (undoTimer.current) {
            clearTimeout(undoTimer.current);
        }

        undoTimer.current = setTimeout(() => {
            setUndoVisible(false);
            setUndoSet(null);
        }, 5000);
    };

    const undoComplete = () => {
        if (undoSet == null) return;

        // Unmark the set
        toggleCompleted(undoSet);

        // Stop the active rest timer
        stopRest();

        // Reset local timer state
        setInitialRestSeconds(0);

        if (undoTimer.current) {
            clearTimeout(undoTimer.current);
        }

        hideToast();
    };

    const onWeightChange = (setNumber: number, value: string) => {
        updateWeight(setNumber, value === "" ? "" : Number(value));
    };

    const onRepsChange = (setNumber: number, value: string) => {
        updateReps(setNumber, value === "" ? "" : Number(value));
    };

    const hideToast = () => {
        Animated.timing(toastAnim, {
            toValue: 0,
            duration: 220,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            setUndoVisible(false);
            setUndoSet(null);
        });
    };

    const addThirtySeconds = () => {
        setInitialRestSeconds(prev => prev + 30);

        startRest(restSecondsRemaining + 30);
    };

    const skipRest = () => {
        stopRest();
        hideToast();
    };

    if (!session) return null;

    const exercise = session.exercises?.[currentExerciseIndex];

    if (!exercise) return null;

    const progressText =
        `${currentExerciseIndex + 1} / ${session.exercises.length}`;

    const player = useVideoPlayer(exercise.videoUrl, player => {
        player.loop = true;
        player.play();
        player.muted = true;
    });

    const fullscreenPlayer = useVideoPlayer(exercise.videoUrl, (player) => {
        player.loop = true;
        player.muted = true;
    });

    useEffect(() => {
        if (showFullscreenGif) {
            player.pause();
            fullscreenPlayer.play();
        } else {
            fullscreenPlayer.pause();
            player.play();
        }
    }, [showFullscreenGif]);

    useEffect(() => {
        if (!isResting) return;
        const timer = setInterval(() => {
            tickRest();
        }, 1000);
        return () => clearInterval(timer);
    }, [isResting]);

    useEffect(() => {
        if (!isResting) return;
        if (restSecondsRemaining <= 0) {
            stopRest();
            if (undoVisible) {
                hideToast();
            }
        }
    }, [restSecondsRemaining]);

    useEffect(() => {
        scrollViewRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
    }, [currentExerciseIndex]);

    useEffect(() => {

        if (!session) return;

        const timer = setInterval(() => {

            setElapsed(
                getWorkoutElapsedSeconds(
                    session.elapsedSeconds,
                    session.runningSince
                )
            );

        }, 1000);

        return () => clearInterval(timer);

    }, [
        session
    ]);


    async function handleNextExercise() {

        if (!session || !user) return;

        //---------------------------------------------------
        // Validate
        //---------------------------------------------------

        const allCompleted = sets.every(
            (set) => set.completed
        );

        if (!allCompleted) {
            // TODO:
            // show snackbar
            // "Complete all sets first"
            return;
        }

        //---------------------------------------------------
        // Current Exercise
        //---------------------------------------------------

        const currentExercise =
            session.exercises[currentExerciseIndex];

        const nextExerciseData =
            session.exercises[currentExerciseIndex + 1];

        try {

            //---------------------------------------------------
            // Commit Exercise
            //---------------------------------------------------

            await completeExercise(
                session.sessionId,
                user.user.id,
                currentExercise.planExerciseId,
                currentExercise.exerciseId,
                sets,
                nextExerciseData
                    ? nextExerciseData.planExerciseId
                    : null
            );

            //---------------------------------------------------
            // Pause Exercise?
            //---------------------------------------------------


            //---------------------------------------------------
            // Last Exercise?
            //---------------------------------------------------

            if (!nextExerciseData) {
                console.log("1. About to finish workout");

                await finishWorkout(session.sessionId);

                console.log("2. finishWorkout completed");

                console.log("3. Navigating to summary");

                router.replace({
                    pathname: "/workoutsummary",
                    params: {
                        sessionId: session.sessionId,
                    },
                });

                console.log("4. Navigation called");

                return;
            }

            //---------------------------------------------------
            // Build runtime sets
            //---------------------------------------------------

            const runtimeSets =
                buildRuntimeSets(nextExerciseData);

            //---------------------------------------------------
            // Next Exercise
            //---------------------------------------------------

            nextExercise(runtimeSets);

        } catch (error) {

            console.log(error);

        }

    }

    async function handlePauseWorkout() {

        if (!session) return;

        try {

            await pauseWorkout(
                session.sessionId
            );

            pauseSession();

            router.back();

        } catch (error) {

            console.log(error);

        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <WorkoutHeader
                workoutName={session?.title ?? ""}
                currentExercise={currentExerciseIndex + 1}
                totalExercises={session.exercises.length}
                onBackPress={() => { }}
            />

            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Exercise Card */}

                <View style={styles.exerciseCard}>
                    <View style={styles.imageContainer}>
                        <VideoView
                            style={styles.image}
                            player={player}
                            contentFit="contain"
                            nativeControls={false}
                        />

                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => setShowFullscreenGif(true)}
                        >
                            <Fullscreen
                                size={22}
                                color="#FFFFFF"
                                strokeWidth={2.2}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.exerciseInfo}>
                        <View style={styles.titleRow}>
                            <Text style={styles.exerciseName}>
                                {exercise.name}
                            </Text>

                            <View style={styles.levelBadge}>
                                <Text style={styles.levelText}>
                                    {exercise.difficulty}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.tags}>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>{exercise.primaryMuscle}</Text>
                            </View>

                            <View style={styles.tag}>
                                <Text style={styles.tagText}>Front Delts</Text>
                            </View>

                            <View style={styles.tag}>
                                <Text style={styles.tagText}>Triceps</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Coach */}

                <View style={styles.coachCard}>
                    <View style={styles.coachHeader}>
                        <View style={styles.coachIcon}>
                            <MaterialCommunityIcons
                                name="lightbulb-outline"
                                size={16}
                                color="#082320"
                            />
                        </View>

                        <Text style={styles.coachTitle}>
                            Coach Tip
                        </Text>
                    </View>

                    <Text style={styles.coachText}>
                        {exercise.tips}
                    </Text>
                </View>

                {/* Sets */}

                <SetTracker
                    sets={sets}
                    activeUndoSet={undoSet}
                    onToggleSet={toggleSet}
                    onWeightChange={onWeightChange}
                    onRepsChange={onRepsChange}
                />

                {/* Accordions */}

                <WorkoutAccordion
                    title="Instructions"
                    content={exercise.instructions ?? ""}
                />

                <WorkoutAccordion
                    title="Common Mistakes"
                    content={exercise.commonMistakes ?? ""}
                />

                {/* Bottom Buttons */}

                {/* Secondary Actions */}
                <View style={styles.sectionDivider} />

                <View style={styles.controlPanel}>

                    <View style={styles.controlHeader}>
                        <Ionicons
                            name="fitness"
                            size={18}
                            color="#A3E635"
                        />

                        <Text style={styles.controlTitle}>
                            Workout Controls
                        </Text>
                    </View>

                    <View style={styles.coachStatus}>
                        <Ionicons
                            name="flash"
                            size={16}
                            color="#A3E635"
                        />

                        <Text style={styles.coachStatusText}>
                            Great pace! Only 2 exercises remaining.
                        </Text>
                    </View>

                    {/* Feature Cards */}

                    <View style={styles.featureRow}>

                        <TouchableOpacity style={styles.featureCard}>
                            <View style={styles.featureIcon}>
                                <Ionicons
                                    name="sparkles"
                                    size={24}
                                    color="#A3E635"
                                />
                            </View>

                            <Text style={styles.featureTitle}>
                                Ask Coach
                            </Text>

                            <Text style={styles.featureSubtitle}>
                                AI Guidance
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.featureCard}>
                            <View style={styles.featureIcon}>
                                <Ionicons
                                    name="swap-horizontal"
                                    size={24}
                                    color="#A3E635"
                                />
                            </View>

                            <Text style={styles.featureTitle}>
                                Swap Exercise
                            </Text>

                            <Text style={styles.featureSubtitle}>
                                Same Muscle
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {/* Primary Actions */}

                    <View style={styles.primaryActionRow}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.skipButton}
                        >
                            <Ionicons
                                name="play-skip-forward-outline"
                                size={20}
                                color="rgba(255,255,255,0.75)"
                            />

                            <Text style={styles.skipText}>
                                Skip
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.nextButton}
                            onPress={handleNextExercise} >
                            <Text style={styles.nextText}>
                                Next Exercise
                            </Text>

                            <Ionicons
                                name="arrow-forward"
                                size={22}
                                color="#082320"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Pause */}

                    <TouchableOpacity
                        style={styles.endWorkoutBtn}
                        activeOpacity={0.8}
                        onPress={handlePauseWorkout}
                    >
                        <Ionicons name="pause-circle-outline" size={20} color="#EF4444" />
                        <Text style={styles.endWorkoutText}> Pause & End Workout </Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={showFullscreenGif}
                    animationType="fade"
                    transparent={false}
                >
                    <View style={styles.fullscreenContainer}>
                        <View style={styles.fullscreenHeader}>
                            <TouchableOpacity
                                onPress={() => setShowFullscreenGif(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="#FFFFFF"
                                />
                            </TouchableOpacity>

                            <Text style={styles.fullscreenTitle}>
                                Bench Press
                            </Text>
                        </View>

                        <VideoView
                            player={fullscreenPlayer}
                            style={styles.fullscreenVideo}
                            nativeControls={false}
                            contentFit="contain"
                        />
                    </View>
                </Modal>

            </ScrollView>
            <RestTimerOverlay
                visible={isResting}
                remainingSeconds={restSecondsRemaining}
                initialSeconds={initialRestSeconds}
                onAdd30={addThirtySeconds}
                onSkip={skipRest}
            />

            {undoVisible && (
                <Animated.View
                    style={[
                        styles.toast,
                        {
                            opacity: toastAnim,
                            transform: [
                                {
                                    translateY: toastAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [40, 0],
                                    }),
                                },
                                {
                                    scale: toastAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.95, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <View style={styles.toastIcon}>
                        <Ionicons
                            name="checkmark"
                            size={18}
                            color="#082320"
                        />
                    </View>

                    <View style={styles.toastContent}>
                        <Text style={styles.toastTitle}>
                            Set {undoSet} Completed
                        </Text>

                        <Text style={styles.toastSubtitle}>
                            Tap Undo to restore this set.
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={undoComplete}
                        style={styles.undoButton}
                    >
                        <Text style={styles.undoText}>
                            UNDO
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            )}


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#082320",
    },

    content: {
        padding: 10,
        paddingTop: 30,
        paddingBottom: 40,
    },

    exerciseCard: {
        backgroundColor: "#173C38",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#2A4B45",
        overflow: "hidden",
    },

    imageContainer: {
        height: 260,
        backgroundColor: "#102E2C",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#2A4B45",
        position: "relative",
    },

    image: {
        width: "100%",
        height: "100%",
    },

    menuButton: {
        position: "absolute",
        top: 16,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(23,60,56,0.80)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        justifyContent: "center",
        alignItems: "center",
    },

    exerciseInfo: {
        paddingHorizontal: 10,
        paddingVertical: 18,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },


    exerciseName: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
        marginRight: 12,
    },


    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 16,
    },

    tag: {
        height: 32,
        backgroundColor: "#21504A",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2A4B45",
        justifyContent: "center",
        paddingHorizontal: 14,
        marginRight: 10,
        marginBottom: 10,
    },

    tagText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },

    levelBadge: {
        backgroundColor: "rgba(163,230,53,0.15)",
        borderColor: "#A3E635",
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 30,
    },
    levelText: {
        color: "#A3E635",
        fontSize: 12,
        fontWeight: "700",
    },

    coachCard: {
        marginTop: 18,
        backgroundColor: "#173C38",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#2A4B45",
        padding: 16,
    },

    coachHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },

    sectionDivider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
        marginTop: 26,
        marginBottom: 26,
    },
    coachIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#A3E635",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    coachTitle: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 16,
    },

    coachText: {
        color: "rgba(255,255,255,0.65)",
        lineHeight: 22,
    },

    controlPanel: {
        marginTop: 8,
        backgroundColor: "#102E2C",
        borderRadius: 28,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(163,230,53,.08)",
    },

    controlHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    controlTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 10,
    },

    coachStatus: {
        marginTop: 18,
        backgroundColor: "rgba(163,230,53,.06)",
        borderRadius: 16,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
    },

    coachStatusText: {
        marginLeft: 10,
        color: "#FFFFFF",
        fontSize: 14,
        flex: 1,
    },

    featureRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },

    featureCard: {
        width: "48%",
        backgroundColor: "#21504A",
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(163,230,53,.12)",
    },

    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(163,230,53,.08)",
        justifyContent: "center",
        alignItems: "center",
    },

    featureTitle: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 15,
        marginTop: 14,
    },

    featureSubtitle: {
        color: "rgba(255,255,255,.55)",
        fontSize: 12,
        marginTop: 5,
    },

    nextButton: {
        width: "71%",
        height: 56,

        borderRadius: 18,

        backgroundColor: "#A3E635",

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#A3E635",
        shadowOpacity: 0.18,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 8,
        },

        elevation: 6,
    },

    nextText: {
        color: "#082320",
        fontWeight: "700",
        fontSize: 16,
        marginRight: 8,
    },

    endWorkoutBtn: {
        marginTop: 20,
        height: 56,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: "rgba(239,68,68,0.25)",
        backgroundColor: "rgba(239,68,68,0.12)",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },

    endWorkoutText: {
        color: "#EF4444",
        fontSize: 15,
        fontWeight: "700",
    },

    fullscreenContainer: {
        flex: 1,
        backgroundColor: "#082320",
    },

    fullscreenHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        gap: 12,
    },

    closeButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
        alignItems: "center",
    },

    fullscreenTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },

    fullscreenVideo: {
        flex: 1,
        width: "100%",
    },

    primaryActionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginTop: 22,
    },

    skipButton: {
        width: "25%",
        height: 54,

        borderRadius: 18,

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",

        backgroundColor: "transparent",

        justifyContent: "center",
        alignItems: "center",
    },

    skipText: {
        marginTop: 2,
        color: "rgba(255,255,255,0.75)",
        fontSize: 12,
        fontWeight: "600",
    },


    toast: {
        position: "absolute",

        left: 16,
        right: 16,
        bottom: 22,

        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#21504A",

        borderRadius: 22,

        paddingHorizontal: 16,
        paddingVertical: 16,

        borderWidth: 1,
        borderColor: "rgba(163,230,53,.25)",

        shadowColor: "#000",
        shadowOpacity: 0.30,
        shadowRadius: 18,
        shadowOffset: {
            width: 0,
            height: 8,
        },

        zIndex: 9999,
        elevation: 999,
    },

    toastIcon: {
        width: 42,
        height: 42,

        borderRadius: 21,

        backgroundColor: "#A3E635",

        justifyContent: "center",
        alignItems: "center",
    },

    toastContent: {
        flex: 1,
        marginHorizontal: 14,
    },

    toastTitle: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },

    toastSubtitle: {
        marginTop: 2,

        color: "rgba(255,255,255,.65)",

        fontSize: 12,
    },

    undoButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,

        borderRadius: 999,

        backgroundColor: "rgba(163,230,53,.12)",

        borderWidth: 1,

        borderColor: "rgba(163,230,53,.25)",
    },

    undoText: {
        color: "#A3E635",

        fontSize: 12,

        fontWeight: "700",
    },
});