// supabase/functions/ask-ai-coach/auth.ts

import {
    createClient,
} from "npm:@supabase/supabase-js";

import { AuthResult } from "./types.ts";

export async function authenticate(
    req: Request
): Promise<AuthResult> {

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
        throw new Error("Missing Authorization header.");
    }

    const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error("Unauthorized.");
    }

    return {
        user,
        supabase,
    };
}