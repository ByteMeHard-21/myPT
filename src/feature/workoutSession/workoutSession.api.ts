import { supabase } from "../../services/supabase";
import { WorkoutSet } from "./workoutSession.types";

export async function completeExercise(
    sessionId: string,
    userId: string,
    planExerciseId: string,
    exerciseId: string,
    sets: WorkoutSet[],
    nextPlanExerciseId: string | null
) {
    const completedSets = sets.map((set) => ({
        setNumber: set.setNumber,
        enteredReps: set.enteredReps,
        enteredWeight: set.enteredWeight === ""
            ? 0
            : set.enteredWeight,
    }));

    const { error } = await supabase.rpc(
        "complete_workout_exercise",
        {
            p_session_id: sessionId,
            p_user_id: userId,
            p_plan_exercise_id: planExerciseId,
            p_exercise_id: exerciseId,
            p_sets: completedSets,
            p_next_plan_exercise_id:
                nextPlanExerciseId,
        }
    );

    if (error) {
        throw error;
    }
}

export async function pauseWorkout(
    sessionId: string
) {

    const { error } = await supabase.rpc(
        "pause_workout",
        {
            p_session_id: sessionId,
        }
    );

    if (error) {
        throw error;
    }

}

export async function resumeWorkout(
    sessionId: string
) {

    const { error } = await supabase.rpc(
        "resume_workout",
        {
            p_session_id: sessionId,
        }
    );

    if (error) {
        throw error;
    }

}


export async function finishWorkout(
    sessionId: string
) {
    const { error } = await supabase.rpc(
        "finish_workout",
        {
            p_session_id: sessionId,
        }
    );

    if (error) {
        throw error;
    }
}