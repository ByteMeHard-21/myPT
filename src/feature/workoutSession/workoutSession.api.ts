import { supabase } from "../../services/supabase";
import { WorkoutSessionExercise, WorkoutSet } from "./workoutSession.types";

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



export async function getSwapExercises(
    planExerciseId: string
): Promise<WorkoutSessionExercise[]> {

    const { data, error } = await supabase.rpc(
        "get_swap_exercises",
        {
            p_plan_exercise_id: planExerciseId,
        }
    );

    if (error) {
        throw error;
    }

    return (data ?? []).map((item: any) => ({

        planExerciseId: item.plan_exercise_id,

        exerciseId: item.exercise_id,

        name: item.name,

        thumbnailUrl: item.thumbnail_url,

        videoUrl: item.video_url,

        description: item.description,

        instructions: item.instructions,

        tips: item.tips,

        commonMistakes: item.common_mistakes,

        primaryMuscle: item.primary_muscle,

        secondaryMuscles: item.secondary_muscles ?? [],

        difficulty: item.difficulty,

        order: item.exercise_order,

        sets: item.sets,

        reps: item.reps,

        restSeconds: item.rest_seconds,

    }));

}

export async function swapWorkoutExercise(
    planExerciseId: string,
    exerciseId: string
) {

    const { error } = await supabase.rpc(
        "swap_workout_exercise",
        {
            p_plan_exercise_id: planExerciseId,
            p_new_exercise_id: exerciseId,
        }
    );

    if (error) {
        throw error;
    }

}