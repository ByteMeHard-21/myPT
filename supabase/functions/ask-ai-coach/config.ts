// supabase/functions/ask-ai-coach/config.ts

export const AI_CONFIG = {
    // Gemini
    MODEL: "gemini-2.5-flash",

    // Validation
    MAX_MESSAGE_LENGTH: 3000,

    // Context limits
    MAX_PERSONAL_RECORDS: 10,
    MAX_CONTEXT_EXERCISES: 12,
    DEFAULT_REST_SECONDS: 90,
    // AI generation
    TEMPERATURE: 0.4,
    MAX_OUTPUT_TOKENS: 512,
} as const;