import { supabase } from "./supabase";

export async function generateWorkoutPlan(userId: string) {
    try {
        // 1. Fetch User Profile
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (profileError || !profile) {
            throw new Error("Profile not found");
        }

        if (!profile.profile_completed) {
            throw new Error("Complete profile first");
        }

        // 2. Find Matching Template
        const { data: template, error: templateError } = await supabase
            .from("workout_templates")
            .select("*")
            .eq("goal", profile.goal)
            .eq("experience_level", profile.experience_level)
            .eq("days_per_week", profile.workout_days)
            .eq("split_type", profile.preferred_split)
            .eq("is_active", true)
            .single();

        if (templateError || !template) {
            throw new Error("No matching workout template found");
        }

        // 3. SAFELY deactivate existing active plan
        await supabase
            .from("user_workout_plans")
            .update({
                is_active: false,
                completed_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .eq("is_active", true);

        // 4. Create NEW single active plan
        const { data: userPlan, error: userPlanError } = await supabase
            .from("user_workout_plans")
            .insert({
                user_id: userId,
                template_id: template.id,
                goal: template.goal,
                experience_level: template.experience_level,
                days_per_week: template.days_per_week,
                is_active: true,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (userPlanError || !userPlan) {
            throw new Error("Failed to create workout plan");
        }

        // 5. Fetch template days
        const { data: templateDays, error: templateDaysError } =
            await supabase
                .from("workout_template_days")
                .select("*")
                .eq("template_id", template.id)
                .order("day_number");

        if (templateDaysError) throw templateDaysError;

        // 6. Copy days + exercises
        for (const templateDay of templateDays ?? []) {
            const { data: userDay, error: userDayError } =
                await supabase
                    .from("user_workout_plan_days")
                    .insert({
                        plan_id: userPlan.id,
                        day_number: templateDay.day_number,
                        day_name: templateDay.day_name,
                        focus: templateDay.focus,
                    })
                    .select()
                    .single();

            if (userDayError || !userDay) {
                throw new Error("Failed to create workout day");
            }

            const { data: exercises, error: exercisesError } =
                await supabase
                    .from("workout_template_exercises")
                    .select("*")
                    .eq("template_day_id", templateDay.id)
                    .order("exercise_order");

            if (exercisesError) throw exercisesError;

            if (exercises?.length) {
                const copied = exercises.map((ex) => ({
                    plan_day_id: userDay.id,
                    exercise_id: ex.exercise_id,
                    exercise_order: ex.exercise_order,
                    sets: ex.default_sets,
                    reps: ex.default_reps,
                    rest_seconds: ex.rest_seconds,
                }));

                const { error: insertError } = await supabase
                    .from("user_workout_plan_exercises")
                    .insert(copied);

                if (insertError) throw insertError;
            }
        }

        return {
            success: true,
            planId: userPlan.id,
        };
    } catch (error) {
        console.error("generateWorkoutPlan error:", error);

        return {
            success: false,
            error,
        };
    }
}