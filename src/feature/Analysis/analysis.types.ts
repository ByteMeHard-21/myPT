export interface AnalysisOverview {
    totalWorkouts: number;
    currentStreak: number;
    longestStreak: number;
    totalVolume: number;
}

export interface VolumePoint {
    label: string;
    volume: number;
}

export interface CalendarDay {
    date: string;
    completed: boolean;
}

export interface MuscleDistribution {
    muscle: string;
    percentage: number;
}

export interface PersonalRecord {
    exercise: string;
    value: string;
}

export interface RecentWorkout {
    workoutTitle: string;
    completedAt: string;
    durationMinutes: number;
}

export interface Achievement {
    title: string;
    value: string;
    icon: string;
}


export interface AnalysisDashboard {
    overview: AnalysisOverview;

    volumeTrend: VolumePoint[];

    calendar: CalendarDay[];

    muscleDistribution: MuscleDistribution[];

    personalRecords: PersonalRecord[];

    recentWorkouts: RecentWorkout[];

    achievements: Achievement[];

}