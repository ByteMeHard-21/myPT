import { User } from "npm:@supabase/supabase-js";
import { SupabaseClient } from "npm:@supabase/supabase-js";

export interface AskAIRequest {
    message: string;
}

export interface UserProfile {
    full_name: string | null;
    age: number | null;
    gender: string | null;
    height_cm: number | null;
    weight_kg: number | null;
    goal: string | null;
    experience_level: string | null;
    workout_days: number | null;
    preferred_split: string | null;
    diet_preference: string | null;
}

export interface UserStats {
    current_streak: number;
    longest_streak: number;
    total_workouts: number;
    total_volume: number;
}

export interface ActivePlan {
    id: string;
    goal: string;
    experience_level: string;
    days_per_week: number;
    current_day_number: number;
    template_id: string;
}

export interface WorkoutExercise {
    name: string;
    primary_muscle: string;
    sets: number;
    reps: string;
    rest_seconds: number;
}

export interface TodayWorkout {
    day_name: string;
    focus: string;
    workout_title: string;
    estimated_duration_minutes: number;
    exercises: WorkoutExercise[];
}

export interface PersonalRecord {
    exercise_name: string;
    max_weight: number | null;
    max_reps: number | null;
    max_volume: number | null;
}


export interface UserContext {
    userId: string;
    profile: UserProfile | null;
    stats: UserStats | null;
    activePlan: ActivePlan | null;
    todayWorkout: TodayWorkout | null;
    personalRecords: PersonalRecord[];
}

export interface GeminiResponse {
    reply: string;
}

export interface APIResponse {
    success: boolean;
    reply?: string;
    error?: string;
}

export interface AuthResult {
    user: User;
    supabase: SupabaseClient;
}