// src/hooks/useProfile/useAdminFlag.ts
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useAdminFlag() {
    const supabase = createClient();
    const [isAdmin, setIsAdmin] = useState(false);
    const didFetch = useRef(false);

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        async function fetchFlag() {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();
            if (sessionError || !session) return;

            const token = session.access_token;
            const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '';
            const res = await fetch(`${API_BASE}/member/role`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;

            const { isAdmin } = await res.json();
            setIsAdmin(isAdmin);
        }

        fetchFlag();
    }, [supabase]);

    return isAdmin;
}
