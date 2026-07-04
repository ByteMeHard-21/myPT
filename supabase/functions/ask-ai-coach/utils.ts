// supabase/functions/ask-ai-coach/utils.ts

export function logError(
    error: unknown
) {
    console.error(error);
}

export function isOptionsRequest(
    req: Request
) {
    return req.method === "OPTIONS";
}