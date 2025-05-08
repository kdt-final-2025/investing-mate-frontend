// src/app/news/[newsId]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useNewsDetail } from '@/hooks/useNewsDetail';

export default function NewsDetailPage() {
  const router = useRouter();
  const { newsId } = useParams();

  const { data: news} = useNewsDetail(newsId);

  return (
    <main className="min-h-screen bg-[#131722] text-white">
      <div className="container mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-blue-400 hover:underline"
        >
          ← 이전으로
        </button>

          {news ? (
            <>
              <h1 className="text-3xl font-bold mb-2 text-center">
                {news.title}
              </h1>
              <p className="text-sm text-gray-400 mb-4 text-center">
                {new Date(news.publishedAt).toLocaleDateString()} | 조회수 {news.viewCount}
              </p>
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
            </>
          ) : (
            <p className="text-center text-gray-400">뉴스를 찾을 수 없습니다.</p>
          )}
      </div>
    </main>
  );
}
