import * as ImageManipulator from "expo-image-manipulator";
import { decode } from "base64-arraybuffer";

import { supabase } from "./supabase";

/**
 * Uploads an image URI to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadAvatar(
    userId: string,
    imageUri: string
): Promise<string> {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [
            {
                resize: {
                    width: 512,
                    height: 512,
                },
            },
        ],
        {
            compress: 0.8,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
        }
    );

    const filePath = `${userId}/profile.jpg`;

    const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, decode(manipulatedImage.base64!), {
            contentType: "image/jpeg",
            upsert: true,
        });

    if (error) throw error;

    const {
        data: { publicUrl },
    } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

    return publicUrl;
}

export async function deleteProfileImage(userId: string) {
    const { error } = await supabase.storage
        .from("avatars")
        .remove([`${userId}/profile.jpg`]);

    if (error) throw error;
}

