'use client';

import { useState, useEffect } from 'react';

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
}

export function useComments() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;

    useEffect(() => {
        async function fetchComments() {
            try {
                const res = await fetch(`${API_BASE}/api/comments`);
                const data: Comment[] = await res.json();
                setComments(data);
            } catch (e) {
                console.error('댓글 로딩 오류', e);
            } finally {
                setLoading(false);
            }
        }
        fetchComments();
    }, [API_BASE]);

    return { comments, loading };
}
