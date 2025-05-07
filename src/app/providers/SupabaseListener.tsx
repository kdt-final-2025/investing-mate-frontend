"use client"

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
interface Props { children: React.ReactNode }
export function SupabaseListener({ children }: Props) {
  const supabase = createClient();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/member/me`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            credentials: 'include',
          }).catch(console.error);
        }
      }
    );
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  return <>{children}</>;
}
