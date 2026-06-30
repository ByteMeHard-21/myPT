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
    id: string;

    title: string;

    subtitle: string;

    dayName: string;

    difficulty: string;

    estimatedDuration: number;

    exerciseCount: number;

    exercises: WorkoutExercise[];
}