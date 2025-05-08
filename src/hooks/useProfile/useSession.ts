'use client';

import { useState, useEffect } from 'react';
import { SupabaseClient, Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { getSessionOrThrow } from '@/utils/auth';

export function useSession() {
  const supabase: SupabaseClient = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getSessionOrThrow(supabase)
      .then((sess) => {
        if (mounted) setSession(sess);
      })
      .catch(() => {
        if (mounted) setSession(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [supabase]);

  return { session, loading };
}
