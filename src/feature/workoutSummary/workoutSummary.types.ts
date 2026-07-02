export interface MuscleDistribution {
    muscle: string;
    percentage: number;
}

export interface WorkoutStats {
    durationSeconds: number;

    totalExercises: number;

    completedExercises: number;

    totalSets: number;

    totalVolume: number;

    calories: number;

    xpEarned: number;
}

export interface WorkoutAchievements {
    personalRecords: number;

    streakDays: number;

    levelUp: boolean;
}

export interface WorkoutMessage {
    title: string;

    subtitle: string;
}


export interface WorkoutSummary {

    workoutTitle: string;

    durationSeconds: number;

    totalExercises: number;

    completedExercises: number;

    totalSets: number;

    totalVolume: number;

    calories: number;

    xpEarned: number;

    personalRecords: number;

    streakDays: number;

    levelUp: boolean;

    musclesWorked: MuscleDistribution[];

    congratulationsTitle: string;

    congratulationsMessage: string;

}

interface WorkoutSummaryResponse {
    workoutTitle: string;

    durationSeconds: number;

    totalExercises: number;

    completedExercises: number;

    totalSets: number;

    totalVolume: number;

    calories: number;

    xpEarned: number;

    personalRecords: number;

    musclesWorked: {
        muscle: string;
        percentage: number;
    }[];
}