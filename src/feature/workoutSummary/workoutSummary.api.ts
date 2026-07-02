import { supabase } from "../../services/supabase";

import { WorkoutSummary } from "./workoutSummary.types";

export async function getWorkoutSummary(
    sessionId: string
): Promise<WorkoutSummary> {

    const { data, error } = await supabase.rpc(
        "get_workout_summary",
        {
            p_session_id: sessionId,
        }
    );

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error("Workout summary not found.");
    }

    return data as WorkoutSummary;
}