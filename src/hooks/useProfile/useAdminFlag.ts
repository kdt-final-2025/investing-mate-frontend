// src/hooks/useProfile/useAdminFlag.ts
'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useAdminFlag(): { isAdmin: boolean; isLoading: boolean } {
    const supabase = createClient();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const didFetch = useRef(false);

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        (async () => {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();
            if (sessionError || !session) {
                setIsLoading(false);
                return;
            }

            const token = session.access_token;
            const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
            const res = await fetch(`${API_BASE}/member/role`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const { isAdmin } = await res.json();
                setIsAdmin(isAdmin);
            }
            setIsLoading(false);
        })();
    }, [supabase]);

    return { isAdmin, isLoading };
}
