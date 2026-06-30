import { supabase } from "../../services/supabase";
import { CurrentWorkout, WorkoutExercise } from "./workout.types";

export async function getCurrentWorkout(
    userId: string
): Promise<CurrentWorkout | null> {
    // -------------------------------------------------
    // Query 1 : Get user's active workout plan
    // -------------------------------------------------

    const { data: plan, error: planError } = await supabase
        .from("user_workout_plans")
        .select(`
            id,
            experience_level,
            current_day_number
        `)
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

    if (planError) {
        throw planError;
    }

    if (!plan) {
        return null;
    }

    // -------------------------------------------------
    // Query 2 : Fetch today's workout only
    // -------------------------------------------------

    const { data: today, error: dayError } = await supabase
        .from("user_workout_plan_days")
        .select(`
            id,
            day_number,
            day_name,
            focus,
            workout_title,
estimated_duration_minutes,

            user_workout_plan_exercises (
                exercise_order,
                sets,
                reps,
                rest_seconds,

                exercises (
                    id,
                    name,
                    thumbnail_url
                )
            )
        `)
        .eq("plan_id", plan.id)
        .eq("day_number", plan.current_day_number)
        .single();

    if (dayError) {
        throw dayError;
    }

    if (!today) {
        return null;
    }

    const exercises: WorkoutExercise[] = (
        today.user_workout_plan_exercises ?? []
    )
        .sort(
            (a: any, b: any) =>
                a.exercise_order - b.exercise_order
        )
        .map((item: any) => ({
            id: item.exercises.id,
            name: item.exercises.name,
            thumbnailUrl:
                item.exercises.thumbnail_url,
            sets: item.sets,
            reps: item.reps,
            restSeconds: item.rest_seconds,
            order: item.exercise_order,
        }));

    // -------------------------------------------------
    // Estimate workout duration
    // -------------------------------------------------

    return {
        id: plan.id,

        title: today.workout_title,

        subtitle: today.focus,

        dayName: today.day_name,

        difficulty: plan.experience_level,

        estimatedDuration:
            today.estimated_duration_minutes,

        exerciseCount: exercises.length,

        exercises,
    };
}