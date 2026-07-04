import { serve } from "https://deno.land/std/http/server.ts";

import {
  corsHeaders,
  errorResponse,
} from "./formatter.ts";

import { authenticate } from "./auth.ts";
import { validateRequest } from "./validation.ts";
import { isOptionsRequest } from "./utils.ts";

import { loadUserContext } from "./context.ts";
import { loadChatHistory } from "./history.ts";
import {
  saveUserMessage,
  saveAssistantMessage,
} from "./save.ts";

import { buildPrompt } from "./prompt.ts";
import { generateReply } from "./gemini.ts";

serve(async (req) => {
  if (isOptionsRequest(req)) {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    // Authenticate user
    const { user, supabase } = await authenticate(req);

    // Validate request body
    const { message } = await validateRequest(req);

    // Load fitness context
    const context = await loadUserContext(
      supabase,
      user.id
    );

    // Load previous conversation
    const history = await loadChatHistory(
      supabase,
      user.id
    );

    // Build prompt
    const prompt = buildPrompt({
      ...context,
      history,
      userMessage: message,
    });

    console.log("Generated Prompt:\n", prompt);

    // Generate AI response
    const reply = await generateReply(prompt);

    // Persist chat messages
    await saveUserMessage(
      supabase,
      user.id,
      message
    );

    await saveAssistantMessage(
      supabase,
      user.id,
      reply
    );

    // Return response
    return new Response(
      JSON.stringify({
        success: true,
        reply,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
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