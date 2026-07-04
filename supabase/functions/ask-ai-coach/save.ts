import { SupabaseClient } from "npm:@supabase/supabase-js@2";

/**
 * Saves a user message.
 */
export async function saveUserMessage(
    supabase: SupabaseClient,
    userId: string,
    message: string
): Promise<void> {

    const { error } = await supabase
        .from("ai_chat_messages")
        .insert({
            user_id: userId,
            role: "user",
            message: message.trim(),
        });

    if (error) {
        console.error("Failed to save user message:", error);
    }
}

/**
 * Saves an AI response.
 */
export async function saveAssistantMessage(
    supabase: SupabaseClient,
    userId: string,
    message: string
): Promise<void> {

    const { error } = await supabase
        .from("ai_chat_messages")
        .insert({
            user_id: userId,
            role: "assistant",
            message: message.trim(),
        });

    if (error) {
        console.error("Failed to save assistant message:", error);
    }
}