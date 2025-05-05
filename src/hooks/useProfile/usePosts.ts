'use client';

import { useState, useEffect } from 'react';

export interface Post {
    id: string;
    title: string;
    createdAt: string;
}

export function usePosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch(`${API_BASE}/api/posts`);
                const data: Post[] = await res.json();
                setPosts(data);
            } catch (e) {
                console.error('게시글 로딩 오류', e);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, [API_BASE]);

    return { posts, loading };
}
