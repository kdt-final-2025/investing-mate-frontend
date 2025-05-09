// src/hooks/useNewsDetail.ts
import { useState, useEffect } from 'react';
import { getNewsById, NewsResponse } from '@/service/news';


export function useNewsDetail(
  newsId?: string | string[]
): { data: NewsResponse | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!newsId) return;
    if (typeof newsId !== 'string') return;
    setLoading(true);
    setError(null);
    getNewsById(newsId)
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [newsId]);

  return { data, loading, error };
}