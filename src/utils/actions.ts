"use client"

import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';


export const signOutAction = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/main');
};