import { CoachSuggestion } from "../coach.types";

interface Input {
    workoutTitle?: string;
    focus?: string;
    isRecoveryDay: boolean;

}

export function buildSuggestions({
    workoutTitle,
    focus,
    isRecoveryDay,
}: Input): CoachSuggestion[] {

    if (isRecoveryDay) {

        return [
            {
                id: "1",
                title: "Recovery Tips",
                prompt:
                    "Give me recovery tips for today.",
            },

            {
                id: "2",
                title: "Nutrition Today",
                prompt:
                    "What should I eat today?",
            },

            {
                id: "3",
                title: "Mobility Routine",
                prompt:
                    "Suggest a mobility routine.",
            },

            {
                id: "4",
                title: "Weekly Progress",
                prompt:
                    "Review my weekly progress.",
            },
        ];
    }

    return [
        {
            id: "1",
            title: "Today's Workout",
            prompt:
                `Explain today's ${workoutTitle}.`,
        },

        {
            id: "2",
            title: `${focus} Form Tips`,
            prompt:
                `Give me form tips for today's ${focus} workout.`,
        },

        {
            id: "3",
            title: "Recovery Advice",
            prompt:
                "How should I recover after today's workout?",
        },

        {
            id: "4",
            title: "Post Workout Meal",
            prompt:
                "Suggest my post workout meal.",
        },
    ];
}