import { create } from "zustand";

interface ProfileSetupState {
    fullName: string;
    gender: string;

    goal: string;

    age: number;
    heightCm: number;
    weightKg: number;

    heightUnit: "cm" | "ft";
    weightUnit: "kg" | "lb";

    experienceLevel: string;
    workoutDays: number;
    preferredSplit: string;

    dietPreference: string;

    setFullName: (value: string) => void;
    setGender: (value: string) => void;

    setGoal: (value: string) => void;

    setAge: (value: number) => void;
    setHeightCm: (value: number) => void;
    setWeightKg: (value: number) => void;

    setHeightUnit: (value: "cm" | "ft") => void;
    setWeightUnit: (value: "kg" | "lb") => void;

    setExperienceLevel: (value: string) => void;
    setWorkoutDays: (value: number) => void;
    setPreferredSplit: (value: string) => void;

    setDietPreference: (value: string) => void;

    reset: () => void;
}

export const useProfileSetupStore = create<ProfileSetupState>((set) => ({
    fullName: "",
    gender: "",

    goal: "",

    age: 25,
    heightCm: 175,
    weightKg: 70,

    heightUnit: "cm",
    weightUnit: "kg",

    experienceLevel: "",
    workoutDays: 0,
    preferredSplit: "",

    dietPreference: "",

    setFullName: (fullName) => set({ fullName }),
    setGender: (gender) => set({ gender }),

    setGoal: (goal) => set({ goal }),

    setAge: (age) => set({ age }),
    setHeightCm: (heightCm) => set({ heightCm }),
    setWeightKg: (weightKg) => set({ weightKg }),

    setHeightUnit: (heightUnit) => set({ heightUnit }),
    setWeightUnit: (weightUnit) => set({ weightUnit }),

    setExperienceLevel: (experienceLevel) =>
        set({ experienceLevel }),

    setWorkoutDays: (workoutDays) =>
        set({ workoutDays }),

    setPreferredSplit: (preferredSplit) =>
        set({ preferredSplit }),

    setDietPreference: (dietPreference) =>
        set({ dietPreference }),

    reset: () =>
        set({
            fullName: "",
            gender: "",
            goal: "",
            age: 25,
            heightCm: 175,
            weightKg: 70,
            heightUnit: "cm",
            weightUnit: "kg",
            experienceLevel: "",
            workoutDays: 0,
            preferredSplit: "",
            dietPreference: "",
        }),
}));