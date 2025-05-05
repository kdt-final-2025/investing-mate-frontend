'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAdminFlag } from './useAdminFlag';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export function useReporterApplication() {
    const supabase = createClient();
    const { isAdmin, isLoading: loadingAdmin } = useAdminFlag();
    const [status, setStatus] = useState<ApplicationStatus | null>(null);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;
    const didFetch = useRef(false);

    // 1) 내 신청 상태 조회
    useEffect(() => {
        if (loadingAdmin || isAdmin || didFetch.current) return;
        didFetch.current = true;

        (async () => {
            const { data: { session }, error: sessErr } = await supabase.auth.getSession();
            if (sessErr || !session) return;

            const res = await fetch(`${API_BASE}/reporter-applications/me`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (!res.ok) return;
            const { status: st } = await res.json();
            setStatus(st);
            if (st === 'PENDING' || st === 'APPROVED') setApplied(true);
        })();
    }, [API_BASE, supabase, isAdmin, loadingAdmin]);

    // 2) 신청 핸들러
    const apply = async () => {
        setApplying(true);
        setError(null);
        try {
            const { data: { session }, error: sessErr } = await supabase.auth.getSession();
            if (sessErr || !session) throw new Error('로그인이 필요합니다.');

            const res = await fetch(`${API_BASE}/reporter-applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || res.statusText);
            }
            setApplied(true);
            setStatus('PENDING');
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
        status,
        applying,
        applied,
        error,
        showError,
        apply,
        closeError: () => setShowError(false),
    };
}
