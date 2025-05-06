// src/hooks/useProfile/useReporterApplication.ts
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAdminFlag } from './useAdminFlag';
import { useReporterFlag } from './useReporterFlag';   // ①
import {
  fetchMyApplicationStatus,
  applyForReporter,
} from '@/utils/reporterApi';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export function useReporterApplication() {
  const supabase = createClient();
  const { isAdmin, loading: loadingAdmin } = useAdminFlag();
  const { isReporter, loading: loadingReporter } = useReporterFlag();  // ②

  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const didFetch = useRef(false);

  // 1) 내 신청 상태 조회 (관리자 또는 기자면 스킵)
  useEffect(() => {
    if (
        loadingAdmin ||
        loadingReporter ||
        isAdmin ||
        isReporter ||
        didFetch.current
    ) {
      return;
    }
    didFetch.current = true;

    (async () => {
      try {
        const st = await fetchMyApplicationStatus(supabase, API_BASE);
        if (st) {
          setStatus(st);
          if (st === 'PENDING' || st === 'APPROVED') setApplied(true);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [
    supabase,
    API_BASE,
    isAdmin,
    loadingAdmin,
    isReporter,
    loadingReporter,
  ]);

  // 2) 신청 핸들러 (관리자·기자는 호출 자체를 막아도 안전)
  const apply = async () => {
    if (isAdmin || isReporter) {
      // 혹은 throw new Error('권한 없음');
      return;
    }
    setApplying(true);
    setError(null);
    try {
      const st = await applyForReporter(supabase, API_BASE);
      setApplied(true);
      setStatus(st);
    } catch (e: any) {
      setError(e.message);
      setShowError(true);
    } finally {
      setApplying(false);
    }
  };

  return {
    isAdmin,
    loadingAdmin,
    isReporter,
    loadingReporter,
    status,
    applying,
    applied,
    error,
    showError,
    apply,
    closeError: () => setShowError(false),
  };
}
