// src/service/newsService.ts
import { API_BASE } from '@/service/baseAPI';

export interface NewsResponse {
  id: number;
  title: string;
  description: string;
  imageUrls: string[];
  publishedAt: string;
  viewCount: number;
}

export interface NewsListResponse {
  responses: NewsResponse[];
  currentPage: number;
  totalPage: number;
}

interface GetNewsParams {
  title: string;
  page: number;
  size: number;
  sortBy: 'publishedAt' | 'viewCount';
  order: 'asc' | 'desc';
}

export async function getNews({ title, page, size, sortBy, order }: GetNewsParams): Promise<NewsListResponse> {
  const params = new URLSearchParams({
    title,
    page: String(page),
    size: String(size),
    sortBy,
    order,
  });
  const res = await fetch(`${API_BASE}/news?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Error fetching news: ${res.status}`);
  }
  return (await res.json()) as NewsListResponse;
}

export async function getNewsById(id: string): Promise<NewsResponse> {
  const res = await fetch(`${API_BASE}/news/${id}`);
  if (!res.ok) {
    throw new Error(`Error fetching news detail: ${res.status}`);
  }
  return res.json() as Promise<NewsResponse>;
}
