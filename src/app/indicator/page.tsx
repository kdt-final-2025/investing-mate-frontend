'use client';

import React, { useEffect, useState } from 'react';
import {
  fetchIndicators,
  createFavoriteIndicator,
  deleteFavoriteIndicator,
  IndicatorResponse,
} from '@/service/indicatorService';
import { Star } from 'lucide-react';

export default function IndicatorsPage() {
  const size = 10;
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(1);
  const [indicators, setIndicators] = useState<IndicatorResponse[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [page, order]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await fetchIndicators(page, size, order);
      setIndicators(data.indicatorResponses);
      setTotalCount(data.totalCount);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const toggleFavorite = async (id: number) => {
    const target = indicators.find((ind) => ind.id === id);
    if (!target) return;

    try {
      if (target.isFavorite) {
        await deleteFavoriteIndicator(id);
      } else {
        await createFavoriteIndicator(id);
      }
      setIndicators((prev) =>
        prev.map((ind) =>
          ind.id === id ? { ...ind, isFavorite: !ind.isFavorite } : ind
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(totalCount / size);

  if (loading) return <p className="text-center p-8">로딩 중...</p>;
  if (error) return <p className="text-center text-red-500 p-8">Error: {error}</p>;
  if (indicators.length === 0)
    return <p className="text-center p-8">조회된 지표가 없습니다.</p>;

  return (
    <main className="p-8 bg-[#131722] min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        {/* 타이틀 + 정렬 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">경제 지표 목록</h1>
          <button
            onClick={() => {
              setPage(1);
              setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm"
          >
            {order === 'asc' ? '가까운순' : '먼순'}
          </button>
        </div>

        {/* 카드 리스트 */}
        <div className="space-y-4">
          {indicators.map((ind) => (
            <div
              key={ind.id}
              className="flex flex-col md:flex-row justify-between p-6 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
            >
              <div className="space-y-1 flex-1">
                <p className="text-lg font-medium">
                  {ind.name} ({ind.korName})
                </p>
                <p className="text-sm text-gray-400">국가: {ind.country}</p>
                <p className="text-sm text-gray-400">
                  발표일: {new Date(ind.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="mt-4 md:mt-0 flex flex-wrap gap-4 text-sm">
                  <div>
                    실제: <span className="font-medium">{ind.actual ?? '-'}</span>
                  </div>
                  <div>
                    이전: <span className="font-medium">{ind.previous ?? '-'}</span>
                  </div>
                  <div>
                    예상: <span className="font-medium">{ind.estimate ?? '-'}</span>
                  </div>
                  <div>
                    영향: <span className="font-medium">{ind.impact}</span>
                  </div>
                </div>
                {/* 즐겨찾기 스타 아이콘 */}
                <button onClick={() => toggleFavorite(ind.id)}>
                  {ind.isFavorite ? (
                    <Star className="w-6 h-6 text-yellow-400" fill="currentColor" strokeWidth={0} />
                  ) : (
                    <Star className="w-6 h-6 text-gray-500" fill="none" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-2 mt-8 text-lg">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${
              page === 1
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {'<<'}
          </button>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${
              page === 1
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {'<'}
          </button>
          <span className="px-2">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page >= totalPages}
            className={`px-3 py-1 rounded ${
              page >= totalPages
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {'>'}
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page >= totalPages}
            className={`px-3 py-1 rounded ${
              page >= totalPages
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {'>>'}
          </button>
        </div>
      </div>
    </main>
  );
}