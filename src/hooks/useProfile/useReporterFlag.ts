// src/hooks/useProfile/useReporterFlag.ts
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {getSessionOrThrow} from "@/utils/auth";

export function useReporterFlag() {
  const supabase = createClient();
  const [isReporter, setIsReporter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1) 세션 정보 가져오기
        const session = await getSessionOrThrow(supabase);

        // 2) role 조회 API 호출
        const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;
        const res = await fetch(`${API_BASE}/member/me/role`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.ok) {
          // { role: "GENERAL"|"REPORTER"|"ADMINISTRATOR" }
          const { role } = (await res.json()) as { role: string };
          setIsReporter(role === 'REPORTER');
        } else {
          // 404, 500 등 모든 에러 시 일반 사용자로 간주
          console.warn('RuseAdminFlag: role 조회 실패:', res.status);
          setIsReporter(false);
        }
      } catch (e) {
        // 네트워크 에러 등
        console.error('useAdminFlag 예외 발생', e);
        setIsReporter(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase]);

  return { isReporter, loading };
}
