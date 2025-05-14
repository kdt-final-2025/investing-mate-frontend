import { useState, useEffect } from 'react';
import { getNews, NewsListResponse } from '@/service/news';

export function useNews(
  title: string,
  page: number,
  size: number,
  sortBy: 'publishedAt' | 'viewCount',
  order: 'asc' | 'desc'
) {
  const [data, setData] = useState<NewsListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getNews({ title, page, size, sortBy, order })
      .then((res) => setData(res))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [title, page, size, sortBy, order]);

  return { data, loading, error };
}