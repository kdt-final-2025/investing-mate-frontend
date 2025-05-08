// src/app/news/[newsId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { NewsResponse } from '@/types/news';

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.newsId as string;

  const [news, setNews] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!newsId) return;
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8080/news/${newsId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<NewsResponse>;
      })
      .then(setNews)
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [newsId]);

  if (loading)  return <p className="text-center mt-10 text-gray-400">로딩 중...</p>;
  if (error)    return <p className="text-center mt-10 text-red-500">에러: {error}</p>;
  if (!news)    return <p className="text-center mt-10 text-gray-400">뉴스를 찾을 수 없습니다.</p>;

  return (
    <main className="min-h-screen bg-[#131722] text-white">
      <nav className="bg-[#1E222D] border-b border-[#363A45]">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-xl font-bold text-white">Red Light</span>
          </Link>
          <div className="flex space-x-6 text-xs">
            <Link href="/class" className="text-gray-300 hover:text-white">더 클래스</Link>
            <Link href="/market" className="text-gray-300 hover:text-white">관심종목</Link>
            <Link href="/realtime" className="text-gray-300 hover:text-white">실시간</Link>
            <Link href="/news" className="text-gray-300 hover:text-white">뉴스</Link>
          </div>
          <button onClick={() => router.push('/login')} className="text-gray-300 hover:text-white text-xs">
            로그인
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-blue-400 hover:underline"
        >
          ← 이전으로
        </button>

        {/* 제목을 가운데 정렬했습니다 */}
        <h1 className="text-3xl font-bold mb-2 text-center">{news.title}</h1>

        <div className="text-sm text-gray-400 mb-4 text-center">
          {new Date(news.publishedAt).toLocaleDateString()} | 조회수 {news.viewCount}
        </div>

        {news.imageUrls?.[0] && (
          <img
            src={news.imageUrls[0]}
            alt={news.title}
            className="w-full max-h-[500px] object-cover rounded-lg mb-6"
          />
        )}

        <div className="prose prose-invert">
          <p>{news.description}</p>
        </div>
      </div>
    </main>
  );
}
