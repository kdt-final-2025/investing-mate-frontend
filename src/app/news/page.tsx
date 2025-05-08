// src/app/news/page.tsx
'use client';

import { useState } from 'react';
import { useNews } from '@/hooks/useNews';
import LoadingWrapper from '@/components/LoadingWrapper';
import Link from 'next/link';
import { NewsResponse } from '@/service/news';

export default function NewsListPage() {
  const [titleFilter, setTitleFilter] = useState('');
  const [page, setPage] = useState(1);
  const size = 10;
  const [sortBy, setSortBy] = useState<'publishedAt' | 'viewCount'>('publishedAt');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  const { data, loading, error } = useNews(
    titleFilter,
    page,
    size,
    sortBy,
    order
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#131722] text-white">
      <section className="bg-[#1E222D] p-4 border-b border-[#363A45]">
        <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
          <input
            type="text"
            aria-label="제목으로 검색"
            placeholder="제목으로 검색"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            className="flex-1 bg-[#2A2E39] border border-[#363A45] rounded-l-md px-4 py-2 text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded-r-md hover:bg-blue-700"
          >
            검색
          </button>
        </form>
        <div className="mt-4 flex justify-center space-x-4">
          <select
            aria-label="정렬 기준"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#2A2E39] border border-[#363A45] rounded-md px-3 py-2 text-white"
          >
            <option value="publishedAt">발행일</option>
            <option value="viewCount">조회수</option>
          </select>
          <select
            aria-label="정렬 순서"
            value={order}
            onChange={(e) => setOrder(e.target.value as any)}
            className="bg-[#2A2E39] border border-[#363A45] rounded-md px-3 py-2 text-white"
          >
            <option value="desc">내림차순</option>
            <option value="asc">오름차순</option>
          </select>
        </div>
      </section>
      <LoadingWrapper isLoading={loading} error={error}>
        <section className="container mx-auto p-6">
          {data?.responses.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.responses.map((n: NewsResponse) => (
                <article
                  key={n.id}
                  className="bg-[#2A2E39] rounded-lg overflow-hidden hover:shadow-md"
                >
                  {n.imageUrls[0] && (
                    <img
                      src={n.imageUrls[0]}
                      alt={n.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col h-full">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {n.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {new Date(n.publishedAt).toLocaleDateString()} | 조회수 {n.viewCount}
                    </p>
                    <p className="text-gray-300 mb-4 line-clamp-3 flex-1">
                      {n.description}
                    </p>
                    <Link
                      href={`/news/${n.id}`}
                      className="mt-auto text-blue-400 hover:underline"
                    >
                      더보기 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">뉴스가 없습니다.</p>
          )}
          {data && (
            <div className="flex justify-center space-x-4 mt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-[#2A2E39] rounded-md hover:bg-[#363A45] disabled:opacity-50"
              >
                이전
              </button>
              <span className="text-gray-300">
                {data.currentPage} / {data.totalPage}
              </span>
              <button
                disabled={page >= data.totalPage}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-[#2A2E39] rounded-md hover:bg-[#363A45] disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </section>
      </LoadingWrapper>
    </main>
  );
}