// supabase/functions/ask-ai-coach/formatter.ts

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function successResponse(reply: string): Response {
    return new Response(
        JSON.stringify({
            success: true,
            reply,
        }),
        {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
            },
        }
    );
}

export function errorResponse(
    message: string,
    status: number = 400
): Response {
    return new Response(
        JSON.stringify({
            success: false,
            error: message,
        }),
        {
            status,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
            },
        }
    );
}

export { corsHeaders };