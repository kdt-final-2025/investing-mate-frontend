"use client"

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { API_BASE } from '@/service/baseAPI';
interface Props { children: React.ReactNode }
export function SupabaseListener({ children }: Props) {
  const supabase = createClient();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          fetch(`${API_BASE}/member/me`, {
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
