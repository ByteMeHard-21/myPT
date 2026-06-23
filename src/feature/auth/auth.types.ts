export interface UserProfile {
    id: string;
    user_id: string;
    email: string;

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

    is_profile_completed: boolean;
}