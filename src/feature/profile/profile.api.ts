import { supabase } from "../../services/supabase";
import { UserProfile } from "../auth/auth.types";

export async function getProfile(
    userId: string
): Promise<UserProfile> {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error) throw error;

    return data;
}

export async function updateAvatar(
    userId: string,
    avatarUrl: string | null
) {
    const { error } = await supabase
        .from("profiles")
        .update({
            avatar_url: avatarUrl,
        })
        .eq("user_id", userId);

    if (error) throw error;
}