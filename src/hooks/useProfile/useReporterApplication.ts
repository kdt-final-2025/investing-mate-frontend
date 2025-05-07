'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUserRole } from './useUserRole';
import { useSession } from './useSession';
import {
  ApplicationStatus,
  applyForReporter,
  fetchMyApplicationStatus,
} from '@/service/reporter';

export function useReporterApplication() {
  const supabase = createClient();
  const { loading: loadingSession } = useSession();
  const { role, loading: loadingRole } = useUserRole();
  const isAdmin = role === 'ADMINISTRATOR';
  const isReporter = role === 'REPORTER';
  const loading = loadingSession || loadingRole;

  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const didFetch = useRef(false);

  // 1) 비관리자·비기자만 한 번 상태 조회
  useEffect(() => {
    if (loading || isAdmin || isReporter || didFetch.current) return;
    didFetch.current = true;

    fetchMyApplicationStatus(supabase)
      .then((st) => {
        if (st) {
          setStatus(st);
          if (st === 'PENDING' || st === 'APPROVED') setApplied(true);
        }
      })
      .catch(console.error);
  }, [loading, isAdmin, isReporter, supabase]);

  // 2) 신청 핸들러
  const apply = async () => {
    if (isAdmin || isReporter) return;
    setApplying(true);
    setError(null);

    try {
      const st = await applyForReporter(supabase);
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
    isReporter,
    loadingAdmin: loadingRole && role === 'ADMINISTRATOR',
    loadingReporter: loadingRole && role === 'REPORTER',
    loading,
    status,
    applying,
    applied,
    error,
    showError,
    apply,
    closeError: () => setShowError(false),
  };
}
