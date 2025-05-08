// app/components/ClientNavWrapper.tsx
'use client';

import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/hooks/useProfile/useUser';
import NavBar from '@/components/navBar';

export default function ClientNavWrapper() {
  const supabase = createClient();
  const { userName, userEmail, avatarUrl } = useUser(supabase);

  return (
    <NavBar
      avatarUrl={avatarUrl}
      userName={userName}
      userEmail={userEmail}
    />
  );
}
