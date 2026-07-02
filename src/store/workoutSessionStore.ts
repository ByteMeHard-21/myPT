import { create } from "zustand";

import {
    WorkoutSession,
    WorkoutSet,
} from "../feature/workoutSession/workoutSession.types";

interface PendingCommit {
    exerciseIndex: number;
    setNumber: number;
}

interface WorkoutSessionState {
    // Session
    session: WorkoutSession | null;

    // Navigation
    currentExerciseIndex: number;

    // Runtime Set Tracker
    sets: WorkoutSet[];

    // Workout Timer
    elapsedSeconds: number;

    // Rest Timer
    isResting: boolean;
    restSecondsRemaining: number;

    // Pause
    isPaused: boolean;

    // Undo
    pendingCommit: PendingCommit | null;

    // ----------------------------
    // Actions
    // ----------------------------

    setWorkoutSession: (session: WorkoutSession) => void;

    setSets: (sets: WorkoutSet[]) => void;

    updateWeight: (
        setNumber: number,
        weight: number | ""
    ) => void;

    updateReps: (
        setNumber: number,
        reps: number | ""
    ) => void;

    toggleCompleted: (setNumber: number) => void;

    nextExercise: (
        sets: WorkoutSet[]
    ) => void;

    previousExercise: (
        sets: WorkoutSet[]
    ) => void;

    startRest: (seconds: number) => void;

    tickRest: () => void;

    stopRest: () => void;

    tickWorkout: () => void;

    pauseSession: () => void;

    resumeSession: () => void;

    setPendingCommit: (
        commit: PendingCommit | null
    ) => void;

    clearWorkout: () => void;
}

export const useWorkoutSessionStore =
    create<WorkoutSessionState>((set) => ({
        // --------------------------------
        // State
        // --------------------------------

        session: null,

        currentExerciseIndex: 0,

        sets: [],

        elapsedSeconds: 0,

        isResting: false,

        restSecondsRemaining: 0,

        isPaused: false,

        pendingCommit: null,

        // --------------------------------
        // Session
        // --------------------------------

        setWorkoutSession: (session) =>
            set({
                session,
                currentExerciseIndex:
                    session.currentExerciseIndex,
                elapsedSeconds:
                    session.elapsedSeconds,
            }),

        // --------------------------------
        // Sets
        // --------------------------------

        setSets: (sets) =>
            set({
                sets,
            }),

        updateWeight: (
            setNumber,
            weight
        ) =>
            set((state) => ({
                sets: state.sets.map((item) =>
                    item.setNumber === setNumber
                        ? {
                            ...item,
                            enteredWeight: weight,
                        }
                        : item
                ),
            })),

        updateReps: (
            setNumber,
            reps
        ) =>
            set((state) => ({
                sets: state.sets.map((item) =>
                    item.setNumber === setNumber
                        ? {
                            ...item,
                            enteredReps: reps,
                        }
                        : item
                ),
            })),

        toggleCompleted: (setNumber) =>
            set((state) => ({
                sets: state.sets.map((item) =>
                    item.setNumber === setNumber
                        ? {
                            ...item,
                            completed: !item.completed,
                        }
                        : item
                ),
            })),

        // --------------------------------
        // Navigation
        // --------------------------------

        nextExercise: (sets) =>
            set((state) => {
                if (!state.session) return state;

                const nextIndex = Math.min(
                    state.currentExerciseIndex + 1,
                    state.session.exercises.length - 1
                );

                return {
                    currentExerciseIndex: nextIndex,

                    session: {
                        ...state.session,
                        currentExerciseIndex: nextIndex,
                        currentSetNumber: 1,
                    },

                    sets,
                };
            }),

        previousExercise: (sets) =>
            set((state) => {
                if (!state.session) return state;

                const previousIndex = Math.max(
                    state.currentExerciseIndex - 1,
                    0
                );

                return {
                    currentExerciseIndex: previousIndex,

                    session: {
                        ...state.session,
                        currentExerciseIndex: previousIndex,
                        currentSetNumber: 1,
                    },

                    sets,
                };
            }),
        // --------------------------------
        // Rest Timer
        // --------------------------------

        startRest: (seconds) =>
            set({
                isResting: true,
                restSecondsRemaining: seconds,
            }),

        tickRest: () =>
            set((state) => ({
                restSecondsRemaining:
                    state.restSecondsRemaining > 0
                        ? state.restSecondsRemaining - 1
                        : 0,
            })),

        stopRest: () =>
            set({
                isResting: false,
                restSecondsRemaining: 0,
            }),

        // --------------------------------
        // Workout Timer
        // --------------------------------

        tickWorkout: () =>
            set((state) => ({
                elapsedSeconds:
                    state.elapsedSeconds + 1,
            })),

        // --------------------------------
        // Pause
        // --------------------------------

        pauseSession: () =>
            set((state) => ({
                session: state.session
                    ? {
                        ...state.session,
                        status: "paused",
                        runningSince: null,
                    }
                    : null,
            })),

        resumeSession: () =>
            set((state) => ({
                session: state.session
                    ? {
                        ...state.session,
                        status: "in_progress",
                        runningSince:
                            new Date().toISOString(),
                    }
                    : null,
            })),

        // --------------------------------
        // Undo
        // --------------------------------

        setPendingCommit: (
            pendingCommit
        ) =>
            set({
                pendingCommit,
            }),

        // --------------------------------
        // Clear
        // --------------------------------

        clearWorkout: () =>
            set({
                session: null,

                currentExerciseIndex: 0,

                sets: [],

                elapsedSeconds: 0,

                isPaused: false,

                isResting: false,

                restSecondsRemaining: 0,

                pendingCommit: null,
            }),
    }));