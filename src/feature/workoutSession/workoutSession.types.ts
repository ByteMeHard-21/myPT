// ===========================================
// Workout Session Status
// ===========================================

export type WorkoutSessionStatus =
    | "idle"
    | "running"
    | "paused"
    | "resting"
    | "completed";

// ===========================================
// Exercise inside a Workout Session
// ===========================================

export interface WorkoutSessionExercise {
    // Plan Exercise
    planExerciseId: string;

    // Master Exercise
    exerciseId: string;

    name: string;

    thumbnailUrl: string | null;

    videoUrl: string | null;

    description: string | null;

    instructions: string | null;

    tips: string | null;

    commonMistakes: string | null;

    primaryMuscle: string;

    secondaryMuscles: string[];

    difficulty: string;

    // Workout Plan

    order: number;

    sets: number;

    reps: string;

    restSeconds: number;
}

// ===========================================
// Runtime Set
// ===========================================

export interface WorkoutSet {

    setNumber: number;
    targetReps: number | "";
    enteredWeight: number | "";
    enteredReps: number | "";
    completed: boolean;

}

// ===========================================
// Workout Session returned by Backend
// ===========================================

export interface WorkoutSession {

    sessionId: string;

    planId: string;

    planDayId: string;

    title: string;

    subtitle: string;

    startedAt: string;

    runningSince: string | null;

    status:
    | "in_progress"
    | "paused"
    | "completed"
    | "cancelled";

    elapsedSeconds: number;

    currentExerciseIndex: number;

    currentSetNumber: number;

    exercises: WorkoutSessionExercise[];

}

// ===========================================
// Commit Set
// ===========================================

export interface CommitSetRequest {

    sessionId: string;

    planExerciseId: string;

    exerciseId: string;

    setNumber: number;

    weightUsed: number;

    repsCompleted: number;

}

// ===========================================
// Pause Workout
// ===========================================

export interface PauseWorkoutRequest {

    sessionId: string;

    elapsedSeconds: number;

    currentPlanExerciseId: string;

    currentSetNumber: number;

}