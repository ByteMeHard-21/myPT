import { supabase } from "../../services/supabase";
import { CurrentWorkout, WorkoutExercise, WorkoutOverview } from "./workout.types";
import {
    WorkoutSession,
    WorkoutSessionExercise,
} from "../workoutSession/workoutSession.types";

export async function getCurrentWorkout(
    userId: string
): Promise<WorkoutOverview> {
    // -------------------------------------------------
    // Query 1 : Get user's active workout plan
    // -------------------------------------------------

    const { data: plan, error: planError } = await supabase
        .from("user_workout_plans")
        .select(`
    id,
    experience_level,
    current_day_number,
    last_completed_workout_date
`)
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

    if (planError) {
        throw planError;
    }

    if (!plan) {
        return {
            status: "no_workout",
            workout: null,
        };
    }


    const todayDate =
        new Date().toISOString().split("T")[0];

    if (
        plan.last_completed_workout_date === todayDate
    ) {
        return {
            status: "completed_today",
            workout: null,
        };
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
        return {
            status: "no_workout",
            workout: null,
        };
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
        status: "available",
        workout: {
            planId: plan.id,
            planDayId: today.id,
            title: today.workout_title,
            subtitle: today.focus,
            dayName: today.day_name,
            difficulty:
                plan.experience_level,
            estimatedDuration:
                today.estimated_duration_minutes,
            exerciseCount:
                exercises.length,
            exercises,
        },

    };

}

export async function startWorkout(
    userId: string,
    workout: CurrentWorkout
): Promise<WorkoutSession> {
    try {
        // -------------------------------------------------
        // 1. Check for existing active session
        // -------------------------------------------------


        const { data: existingSession, error: sessionError } =
            await supabase
                .from("workout_sessions")
                .select("*")
                .eq("user_id", userId)
                .in("status", ["in_progress", "paused"])
                .maybeSingle();

        if (sessionError) {
            throw sessionError;
        }

        let session = existingSession;

        // -------------------------------------------------
        // 2. Fetch all exercises for today's workout
        // -------------------------------------------------

        const { data: day, error: dayError } = await supabase
            .from("user_workout_plan_days")
            .select(`
                id,

                user_workout_plan_exercises (
                    id,
                    exercise_order,
                    sets,
                    reps,
                    rest_seconds,

                    exercises (
                        id,
                        name,
                        thumbnail_url,
                        video_url,
                        description,
                        instructions,
                        tips,
                        common_mistakes,
                        primary_muscle,
                        secondary_muscles,
                        difficulty
                    )
                )
            `)
            .eq("id", workout.planDayId)
            .single();

        if (dayError) {
            throw dayError;
        }

        const exercises: WorkoutSessionExercise[] =
            (day.user_workout_plan_exercises ?? [])
                .sort(
                    (a: any, b: any) =>
                        a.exercise_order - b.exercise_order
                )
                .map((item: any) => ({
                    planExerciseId: item.id,

                    exerciseId: item.exercises.id,

                    name: item.exercises.name,

                    thumbnailUrl:
                        item.exercises.thumbnail_url,

                    videoUrl:
                        item.exercises.video_url,

                    description:
                        item.exercises.description,

                    instructions:
                        item.exercises.instructions,

                    tips:
                        item.exercises.tips,

                    commonMistakes:
                        item.exercises.common_mistakes,

                    primaryMuscle:
                        item.exercises.primary_muscle,

                    secondaryMuscles:
                        item.exercises.secondary_muscles ?? [],

                    difficulty:
                        item.exercises.difficulty,

                    order: item.exercise_order,

                    sets: item.sets,

                    reps: item.reps,

                    restSeconds: item.rest_seconds,
                }));

        if (exercises.length === 0) {
            throw new Error(
                "Workout contains no exercises."
            );
        }

        // -------------------------------------------------
        // 3. Create session if none exists
        // -------------------------------------------------

        if (!session) {
            const { data: newSession, error: createError } =
                await supabase
                    .from("workout_sessions")
                    .insert({
                        user_id: userId,
                        plan_id: workout.planId,
                        plan_day_id: workout.planDayId,

                        status: "in_progress",

                        elapsed_seconds: 0,

                        running_since: new Date().toISOString(),

                        current_set_number: 1,

                        current_plan_exercise_id:
                            exercises[0].planExerciseId,
                    })
                    .select()
                    .single();

            if (createError) {
                throw createError;
            }

            session = newSession;
        }

        // -------------------------------------------------
        // 4. Find current exercise index
        // -------------------------------------------------

        let currentExerciseIndex = exercises.findIndex(
            (exercise) =>
                exercise.planExerciseId ===
                session.current_plan_exercise_id
        );

        if (currentExerciseIndex === -1) {
            currentExerciseIndex = 0;
        }

        // -------------------------------------------------
        // 5. Return runtime model
        // -------------------------------------------------

        return {
            sessionId: session.id,

            planId: workout.planId,

            planDayId: workout.planDayId,

            title: workout.title,

            subtitle: workout.subtitle,

            startedAt: session.started_at,

            runningSince:
                session.running_since,

            elapsedSeconds:
                session.elapsed_seconds ?? 0,

            status:
                session.status,

            currentExerciseIndex,

            currentSetNumber:
                session.current_set_number ?? 1,

            exercises,
        };
    } catch (error) {
        console.error("startWorkout()", error);

        throw error;
    }
}

export async function advanceWorkoutDay(
    userId: string
) {
    const { error } = await supabase.rpc(
        "advance_workout_day",
        {
            p_user_id: userId,
        }
    );

    if (error) throw error;
}

export async function getActiveWorkoutSession(
    userId: string
): Promise<WorkoutSession | null> {

    //---------------------------------------------------
    // Find active session
    //---------------------------------------------------

    const { data: session, error } =
        await supabase
            .from("workout_sessions")
            .select(`
                *,
                user_workout_plan_days(
                    workout_title,
                    focus
                )
            `)
            .eq("user_id", userId)
            .in("status", ["paused", "in_progress"])
            .maybeSingle();

    if (error) {
        throw error;
    }

    if (!session) {
        return null;
    }

    //---------------------------------------------------
    // Load exercises
    //---------------------------------------------------

    const { data: day, error: dayError } =
        await supabase
            .from("user_workout_plan_days")
            .select(`
                user_workout_plan_exercises(
                    id,
                    exercise_order,
                    sets,
                    reps,
                    rest_seconds,

                    exercises(
                        id,
                        name,
                        thumbnail_url,
                        video_url,
                        description,
                        instructions,
                        tips,
                        common_mistakes,
                        primary_muscle,
                        secondary_muscles,
                        difficulty
                    )
                )
            `)
            .eq("id", session.plan_day_id)
            .single();

    if (dayError) {
        throw dayError;
    }

    const exercises: WorkoutSessionExercise[] =
        (day.user_workout_plan_exercises ?? [])
            .sort(
                (a: any, b: any) =>
                    a.exercise_order -
                    b.exercise_order
            )
            .map((item: any) => ({
                planExerciseId: item.id,

                exerciseId:
                    item.exercises.id,

                name:
                    item.exercises.name,

                thumbnailUrl:
                    item.exercises.thumbnail_url,

                videoUrl:
                    item.exercises.video_url,

                description:
                    item.exercises.description,

                instructions:
                    item.exercises.instructions,

                tips:
                    item.exercises.tips,

                commonMistakes:
                    item.exercises.common_mistakes,

                primaryMuscle:
                    item.exercises.primary_muscle,

                secondaryMuscles:
                    item.exercises.secondary_muscles ?? [],

                difficulty:
                    item.exercises.difficulty,

                order:
                    item.exercise_order,

                sets:
                    item.sets,

                reps:
                    item.reps,

                restSeconds:
                    item.rest_seconds,
            }));

    //---------------------------------------------------
    // Current Exercise
    //---------------------------------------------------

    let currentExerciseIndex =
        exercises.findIndex(
            (exercise) =>
                exercise.planExerciseId ===
                session.current_plan_exercise_id
        );

    if (currentExerciseIndex === -1) {
        currentExerciseIndex = 0;
    }

    //---------------------------------------------------
    // Runtime Model
    //---------------------------------------------------

    return {

        sessionId: session.id,

        planId: session.plan_id,

        planDayId: session.plan_day_id,

        title:
            session.user_workout_plan_days
                .workout_title,

        subtitle:
            session.user_workout_plan_days
                .focus,

        startedAt:
            session.started_at,

        runningSince:
            session.running_since,

        elapsedSeconds:
            session.elapsed_seconds,

        status:
            session.status,

        currentExerciseIndex,

        currentSetNumber:
            session.current_set_number,

        exercises,
    };

}
