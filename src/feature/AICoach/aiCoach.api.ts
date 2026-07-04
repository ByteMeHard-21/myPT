import { supabase } from "../../services/supabase";

export interface AskCoachResponse {
    success: boolean;
    reply: string;
}

export async function askCoach(
    message: string
): Promise<AskCoachResponse> {

    const { data, error } =
        await supabase.functions.invoke(
            "ask-ai-coach",
            {
                body: {
                    message,
                },
            }
        );

    if (error) {
        throw error;
    }

    return data;
}

export interface CoachHistoryResponse {

    success: boolean;

    messages: {

        id: string;

        role: "user" | "assistant";

        message: string;

        created_at: string;

    }[];

}

export async function getCoachHistory():
    Promise<CoachHistoryResponse> {

    const { data, error } =
        await supabase.functions.invoke(
            "get-ai-chat-history"
        );

    if (error) {
        throw error;
    }

    return data;
}