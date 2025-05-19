// src/utils/auth.ts
import { SupabaseClient, Session } from '@supabase/supabase-js';

export async function getSessionOrThrow(supabase: SupabaseClient): Promise<Session | null> {
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    // if (error || !session) {
    //     throw new Error('로그인이 필요합니다.');
    // }

    return session;
}
