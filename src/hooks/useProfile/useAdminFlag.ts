// src/hooks/useProfile/useAdminFlag.ts
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {getSessionOrThrow} from "@/utils/auth";

export function useAdminFlag() {
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1) 세션 가져오기
        const {
          data: { session },
          error: sessErr,
        } = await supabase.auth.getSession();

        if (sessErr || !session) {
          // 로그인 안 됐으면 일반 사용자
          return;
        }

        // 2) 권한 조회 API 호출 (새 URL)
        const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;
        const res = await fetch(`${API_BASE}/member/me/role`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.ok) {
          // 정상 응답: { role: "GENERAL"|"REPORTER"|"ADMINISTRATOR" }
          const { role } = (await res.json()) as { role: string };
          setIsAdmin(role === 'ADMINISTRATOR');
        } else {
          // 404든 500이든 URL 오류든 모두 일반 사용자로 처리
          console.warn('useAdminFlag: role 조회 실패:', res.status, res.statusText);
          setIsAdmin(false);
        }
      } catch (e) {
        // 네트워크 에러 등
        console.error('useAdminFlag 예외 발생', e);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase]);

  return { isAdmin, loading };
}
