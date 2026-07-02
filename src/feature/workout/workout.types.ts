export interface WorkoutExercise {
    id: string;
    name: string;
    thumbnailUrl: string | null;

    sets: number;
    reps: string;
    restSeconds: number;
    order: number;
}

export interface CurrentWorkout {
    planId: string;
    planDayId: string;

    title: string;
    subtitle: string;
    dayName: string;

    difficulty: string;

    estimatedDuration: number;

    exerciseCount: number;

    exercises: WorkoutExercise[];
}

export interface WorkoutOverview {

    status:
    | "available"
    | "completed_today"
    | "no_workout";

    workout: CurrentWorkout | null;

}