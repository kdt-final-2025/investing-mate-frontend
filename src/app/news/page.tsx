'use client';

import { useState } from 'react';
import { useNews, NewsResponse } from '@/hooks/useNews';
import Link from 'next/link';

export default function NewsPage() {
  const [titleFilter, setTitleFilter] = useState('');
  const [page, setPage] = useState(1);
  const size = 10;
  const [sortBy, setSortBy] = useState<'publishedAt' | 'viewCount'>('publishedAt');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  const { data, loading, error } = useNews(titleFilter, page, size, sortBy, order);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#131722] text-white">
      {/* 네비게이션 바 */}
      <nav className="bg-[#1E222D] border-b border-[#363A45]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold text-white">Red Light</span>
            </Link>
            <div className="flex space-x-6 items-center">
              <Link href="/class" className="text-gray-300 hover:text-white text-xs">더 클래스</Link>
              <Link href="/market" className="text-gray-300 hover:text-white text-xs">관심종목</Link>
              <Link href="/realtime" className="text-gray-300 hover:text-white text-xs">실시간</Link>
              <Link href="/news" className="text-gray-300 hover:text-white text-xs">뉴스</Link>
            </div>
            <Link href="/login" className="text-gray-300 hover:text-white text-xs">로그인</Link>
          </div>
        </div>
      </nav>

      {/* 알림 영역 */}
      <div className="bg-[#1E222D] border-b border-[#363A45] p-4">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-500">🔔</span>
          <span className="text-sm text-gray-400">뉴스 API 업데이트 지연 안내</span>
          <span className="text-gray-400">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">📰 최신 뉴스</h1>

        {/* 검색바 중앙 배치 & 필터 분리 */}
        <div className="mb-6">
          <form
            onSubmit={onSearch}
            className="flex w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-auto"
          >
            <input
              type="text"
              placeholder="제목으로 검색"
              value={titleFilter}
              onChange={e => setTitleFilter(e.target.value)}
              className="flex-1 bg-[#2A2E39] border border-[#363A45] rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
            >
              검색
            </button>
          </form>

          <div className="flex justify-center space-x-4 mt-4">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#2A2E39] border border-[#363A45] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="publishedAt">발행일</option>
              <option value="viewCount">조회수</option>
            </select>
            <select
              value={order}
              onChange={e => setOrder(e.target.value as any)}
              className="bg-[#2A2E39] border border-[#363A45] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="desc">내림차순</option>
              <option value="asc">오름차순</option>
            </select>
          </div>
        </div>

        {/* 상태 표시 */}
        {loading && <p className="text-center text-gray-400">로딩 중...</p>}
        {error && <p className="text-center text-red-500">에러: {error}</p>}

        {/* 뉴스 리스트 */}
        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.responses.map((n: NewsResponse) => (
                <article
                  key={n.id}
                  className="bg-[#2A2E39] rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
                >
                  {n.imageUrls[0] && (
                    <img
                      src={n.imageUrls[0]}
                      alt={n.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-white">
                      {n.title}
                    </h2>
                    <p className="text-sm text-gray-400 mb-2">
                      {new Date(n.publishedAt).toLocaleDateString()} | 조회수 {n.viewCount}
                    </p>
                    <p className="text-gray-300 mb-4 line-clamp-3 flex-1">
                      {n.description}
                    </p>
                    <Link
                      href={`/news/${n.id}`}
                      className="mt-auto text-blue-400 hover:underline text-sm font-medium"
                    >
                      더보기 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-[#2A2E39] border border-[#363A45] rounded-md hover:bg-[#363A45] disabled:opacity-50"
              >
                이전
              </button>
              <span className="text-gray-300">
                {data.currentPage} / {data.totalPage}
              </span>
              <button
                disabled={page >= data.totalPage}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-[#2A2E39] border border-[#363A45] rounded-md hover:bg-[#363A45] disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
