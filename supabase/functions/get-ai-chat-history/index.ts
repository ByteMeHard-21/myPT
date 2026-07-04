import { serve } from "https://deno.land/std/http/server.ts";

import {
    corsHeaders,
    errorResponse,
} from "../ask-ai-coach/formatter.ts";

import { authenticate } from "../ask-ai-coach/auth.ts";
import { isOptionsRequest } from "../ask-ai-coach/utils.ts";

serve(async (req) => {

    if (isOptionsRequest(req)) {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    try {

        const { user, supabase } =
            await authenticate(req);

        const { data, error } =
            await supabase
                .from("ai_chat_messages")
                .select(`
                    id,
                    role,
                    message,
                    created_at
                `)
                .eq("user_id", user.id)
                .order("created_at", {
                    ascending: true,
                });

        if (error) {
            throw error;
        }

        return new Response(
            JSON.stringify({
                success: true,
                messages: data,
            }),
            {
                headers: {
                    ...corsHeaders,
                    "Content-Type":
                        "application/json",
                },
            }
        );

    } catch (error) {

        console.error(error);

        return errorResponse(
            error instanceof Error
                ? error.message
                : "Unknown error",
            400
        );

    }

});