// hooks/useUser.ts
'use client';

import { useState, useEffect } from 'react';
import { SupabaseClient, Session } from '@supabase/supabase-js';

export interface UserInfo {
  userName: string;
  userEmail: string;
  avatarUrl: string | null;
}

// supabase 인스턴스를 받아,
// session, user metadata, avatarUrl 상태를 관리해줍니다.

export function useUser(supabase: SupabaseClient): UserInfo {
  const [userName, setUserName] = useState<string>('Guest');
  const [userEmail, setUserEmail] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        if (!mounted) return;
        setUserName('Guest');
        setUserEmail('');
        setAvatarUrl(null);
        return;
      }

      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return;

      const raw = (data.user as any).raw_user_meta_data;
      const name =
        raw?.name || data.user.user_metadata?.full_name || data.user.email!;
      const email = raw?.email || data.user.email!;
      let avatar =
        raw?.avatar_url ||
        raw?.picture ||
        data.user.user_metadata?.avatar_url ||
        data.user.user_metadata?.picture ||
        null;
      if (avatar) avatar = avatar.replace(/s\d+-c/, 's200-c');

      if (!mounted) return;
      setUserName(name);
      setUserEmail(email);
      setAvatarUrl(avatar);
    }

    loadUser();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session: Session | null) => {
        if (session) loadUser();
        else {
          if (!mounted) return;
          setUserName('Guest');
          setUserEmail('');
          setAvatarUrl(null);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return { userName, userEmail, avatarUrl };
}
