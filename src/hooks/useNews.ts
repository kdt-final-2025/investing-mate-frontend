// hooks/useNews.ts
import { useState, useEffect } from 'react';
import { NewsResponse, NewsListResponse } from '@/types/news';

export function useNews(
  title: string,
  page: number,
  size: number,
  sortBy: 'publishedAt' | 'viewCount',
  order: 'asc' | 'desc'
) {
  const [data, setData] = useState<NewsListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const q = new URLSearchParams({
          title: title.trim(),
          page: String(page),
          size: String(size),
          sortBy,
          order,            // 🚩 여기를 꼭 넣어주세요!
        });
        const res = await fetch(`http://localhost:8080/news?${q.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as NewsListResponse;
        setData(json);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [title, page, size, sortBy, order]);  // 🚩 order도 의존성에 추가!

  return { data, loading, error };
}
