import { supabase } from '../../services/supabase';

export const signUp = async (
    email: string,
    password: string
) => {
    const result =
        await supabase.auth.signUp({
            email,
            password,
        });

    return result;
};

export const signIn = async (
    email: string,
    password: string
) => {
    const result =
        await supabase.auth.signInWithPassword({
            email,
            password,
        });

    return result;
};

export const signOut = async () => {
    return supabase.auth.signOut();
};

export const forgotPassword = async (
    email: string
) => {
    return supabase.auth.resetPasswordForEmail(
        email
    );
};

export const getProfile = async (
    userId: string
) => {
    const { data, error } =
        await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

    if (error) throw error;

    return data;
};

