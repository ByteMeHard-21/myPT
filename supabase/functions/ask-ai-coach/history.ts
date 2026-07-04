import { SupabaseClient } from "npm:@supabase/supabase-js@2";

export interface ChatMessage {
    role: "user" | "assistant";
    message: string;
}

const MAX_HISTORY_MESSAGES = 10;

/**
 * Loads the most recent chat history for the user.
 * Returns messages in chronological order (oldest → newest)
 * so they can be directly appended to the LLM prompt.
 */
export async function loadChatHistory(
    supabase: SupabaseClient,
    userId: string
): Promise<ChatMessage[]> {

    const { data, error } = await supabase
        .from("ai_chat_messages")
        .select("role, message")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(MAX_HISTORY_MESSAGES);

    if (error) {
        console.error("Failed to load chat history:", error);

        // Never fail the request because of history.
        // AI can still answer without previous messages.
        return [];
    }

    if (!data || data.length === 0) {
        return [];
    }

    // Database returns newest → oldest.
    // Gemini expects oldest → newest.
    return data.reverse() as ChatMessage[];
}