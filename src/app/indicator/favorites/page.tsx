"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IndicatorResponse, fetchIndicators, createFavoriteIndicator, deleteFavoriteIndicator } from '@/service/indicatorService';
import { Star } from 'lucide-react';

export default function FavoriteIndicatorsPage() {
  const [indicators, setIndicators] = useState<IndicatorResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      setLoading(true);
      const { indicatorResponses } = await fetchIndicators(1, 100, 'desc');
      setIndicators(indicatorResponses.filter(item => item.isFavorite));
    } catch (err: any) {
      setError(err.message ?? 'Error loading favorites');
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(id: number, current: boolean) {
    try {
      if (current) {
        await deleteFavoriteIndicator(id);
        setIndicators(prev => prev.filter(item => item.id !== id));
      } else {
        await createFavoriteIndicator(id);
        // Optionally refetch or add back; here we simply remove if unfavorited
      }
    } catch (err: any) {
      console.error(err);
      alert('즐겨찾기 업데이트에 실패했습니다.');
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <main className="min-h-screen bg-[#131722] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">관심 경제지표</h1>
        {indicators.length === 0 ? (
          <p className="text-center text-gray-400">관심 등록된 경제지표가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {indicators.map(item => (
              <div
                key={item.id}
                className="bg-[#1E222D] rounded-2xl p-5 flex flex-col justify-between group hover:shadow-lg transition-shadow duration-300"
              >
                <Link href={`/indicators/${item.id}`} className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">{item.korName || item.name}</h2>
                  <p className="text-sm text-gray-400">{item.country} · {new Date(item.date).toLocaleDateString()}</p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p>Actual: {item.actual !== null ? item.actual : '-'}</p>
                    <p>Estimate: {item.estimate !== null ? item.estimate : '-'}</p>
                    <p>Previous: {item.previous !== null ? item.previous : '-'}</p>
                    <p>Impact: {item.impact}</p>
                  </div>
                </Link>
                <button
                  onClick={() => toggleFavorite(item.id, item.isFavorite)}
                  className="self-end transition-opacity duration-200 hover:opacity-100 opacity-80"
                >
                  {item.isFavorite ? (
                    <Star size={24} fill="currentColor" strokeWidth={0} className="text-yellow-400" />
                  ) : (
                    <Star size={24} fill="none" strokeWidth={2} className="text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}