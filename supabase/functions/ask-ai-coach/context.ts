import { SupabaseClient } from "npm:@supabase/supabase-js";
import {
    UserProfile,
    UserContext,
    UserStats,
    ActivePlan,
    TodayWorkout,
    PersonalRecord,
} from "./types.ts";
import { AI_CONFIG } from "./config.ts";

async function loadProfile(
    supabase: SupabaseClient,
    userId: string
): Promise<UserProfile | null> {

    const { data, error } = await supabase
        .from("profiles")
        .select(`
      full_name,
      age,
      gender,
      height_cm,
      weight_kg,
      goal,
      experience_level,
      workout_days,
      preferred_split,
      diet_preference
    `)
        .eq("user_id", userId)
        .single();

    if (error) {
        throw new Error(
            `Failed to load profile: ${error.message}`
        );
    }

    return data;
}

async function loadStats(
    supabase: SupabaseClient,
    userId: string
): Promise<UserStats | null> {
    try {
        const { data, error } = await supabase
            .from("user_stats")
            .select(`
        current_streak,
        longest_streak,
        total_workouts,
        total_volume
      `)
            .eq("user_id", userId)
            .single();

        if (error) {
            console.error("loadStats:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("loadStats:", error);
        return null;
    }
}

async function loadActivePlan(
    supabase: SupabaseClient,
    userId: string
): Promise<ActivePlan | null> {
    try {
        const { data, error } = await supabase
            .from("user_workout_plans")
            .select(`
        id,
        template_id,
        goal,
        experience_level,
        days_per_week,
        current_day_number
      `)
            .eq("user_id", userId)
            .eq("is_active", true)
            .maybeSingle();

        if (error) {
            console.error("loadActivePlan:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("loadActivePlan:", error);
        return null;
    }
}

async function loadTodayWorkout(
    supabase: SupabaseClient,
    activePlan: ActivePlan | null
): Promise<TodayWorkout | null> {

    if (!activePlan) {
        return null;
    }

    try {

        const { data, error } = await supabase
            .from("user_workout_plan_days")
            .select(`
        day_name,
        focus,
        workout_title,
        estimated_duration_minutes,

        user_workout_plan_exercises(
          sets,
          reps,
          rest_seconds,

          exercises(
            name,
            primary_muscle
          )
        )
      `)
            .eq("plan_id", activePlan.id)
            .eq("day_number", activePlan.current_day_number)
            .maybeSingle();

        if (error) {
            console.error("loadTodayWorkout:", error);
            return null;
        }

        if (!data) {
            return null;
        }

        return {
            day_name: data.day_name,
            focus: data.focus,
            workout_title: data.workout_title,
            estimated_duration_minutes:
                data.estimated_duration_minutes,

            exercises:
                data.user_workout_plan_exercises.map(
                    (exercise: any) => ({
                        name: exercise.exercises.name,
                        primary_muscle:
                            exercise.exercises.primary_muscle,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        rest_seconds:
                            exercise.rest_seconds ??
                            AI_CONFIG.DEFAULT_REST_SECONDS
                    })
                ),
        };

    } catch (error) {

        console.error("loadTodayWorkout:", error);
        return null;
    }
}

async function loadPersonalRecords(
    supabase: SupabaseClient,
    userId: string
): Promise<PersonalRecord[]> {

    try {

        const { data, error } = await supabase
            .from("personal_records")
            .select(`
        max_weight,
        max_reps,
        max_volume,

        exercises(
          name
        )
      `)
            .eq("user_id", userId)
            .order("max_weight", {
                ascending: false,
            })
            .limit(AI_CONFIG.MAX_PERSONAL_RECORDS);

        if (error) {
            console.error("loadPersonalRecords:", error);
            return [];
        }

        return (data ?? []).map((record: any) => ({
            exercise_name: record.exercises.name,
            max_weight: record.max_weight,
            max_reps: record.max_reps,
            max_volume: record.max_volume,
        }));

    } catch (error) {

        console.error("loadPersonalRecords:", error);

        return [];
    }
}

export async function loadUserContext(
    supabase: SupabaseClient,
    userId: string
): Promise<UserContext> {

    const [
        profile,
        stats,
        activePlan,
        personalRecords,
    ] = await Promise.all([
        loadProfile(supabase, userId),
        loadStats(supabase, userId),
        loadActivePlan(supabase, userId),
        loadPersonalRecords(supabase, userId),
    ]);

    const todayWorkout = activePlan
        ? await loadTodayWorkout(supabase, activePlan)
        : null;

    return {
        userId,
        profile,
        stats,
        activePlan,
        todayWorkout,
        personalRecords,
    };
}