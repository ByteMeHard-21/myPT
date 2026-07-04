// supabase/functions/ask-ai-coach/validation.ts

import { AskAIRequest } from "./types.ts";
import { AI_CONFIG } from "./config.ts";

export async function validateRequest(
    req: Request
): Promise<AskAIRequest> {

    const body = await req.json();

    if (!body.message) {
        throw new Error("Message is required.");
    }

    if (typeof body.message !== "string") {
        throw new Error("Message must be a string.");
    }

    const message = body.message.trim();

    if (message.length === 0) {
        throw new Error("Message cannot be empty.");
    }

    if (message.length > AI_CONFIG.MAX_MESSAGE_LENGTH) {
        throw new Error(
            `Message must be less than ${AI_CONFIG.MAX_MESSAGE_LENGTH} characters.`
        );
    }

    return {
        message,
    };
}