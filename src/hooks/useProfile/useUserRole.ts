'use client';

import { useState, useEffect } from 'react';
import { useSession } from './useSession';
import { API_BASE } from '@/service/baseAPI';

export type Role = 'GENERAL' | 'REPORTER' | 'ADMINISTRATOR';

export function useUserRole() {
  const { session, loading: loadingSession } = useSession();
  const [role, setRole] = useState<Role>('GENERAL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadingSession) return;
    if (!session) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/member/me/role`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((json: { role: Role }) => {
        setRole(json.role);
      })
      .catch(() => {
        setRole('GENERAL');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session, loadingSession]);

  return { role, loading };
}
