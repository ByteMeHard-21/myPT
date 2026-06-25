import { supabase } from "./supabase";

export async function completeProfile(
    userId: string,
    profile: any
) {
    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: profile.fullName,
            gender: profile.gender,
            age: profile.age,
            height_cm: profile.heightCm,
            weight_kg: profile.weightKg,
            goal: profile.goal,
            experience_level: profile.experienceLevel,
            workout_days: profile.workoutDays,
            preferred_split: profile.preferredSplit,
            diet_preference: profile.dietPreference,
            is_profile_completed: true,
        })
        .eq("user_id", userId); // <-- IMPORTANT

    if (error) throw error;
}