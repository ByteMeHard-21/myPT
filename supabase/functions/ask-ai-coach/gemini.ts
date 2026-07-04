import { AI_CONFIG } from "./config.ts";

/**
 * Sends a prompt to Gemini and returns only the generated reply.
 */
export async function generateReply(
    prompt: string
): Promise<string> {
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
        throw new Error("Missing GEMINI_API_KEY");
    }

    const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature: AI_CONFIG.TEMPERATURE,
                maxOutputTokens: AI_CONFIG.MAX_OUTPUT_TOKENS,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API Error: ${error}`);
    }

    const data = await response.json();

    const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
        throw new Error("Gemini returned an empty response.");
    }

    return reply.trim();
}