// src/app/stocks/favorites/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getFavoriteStocks,
  deleteFavoriteStock,
  FavoriteStockResponse,
} from '@/service/favoriteService';

export default function FavoriteStocksPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteStockResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavoriteStocks();
      setFavorites(data.responses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 삭제 핸들러: 버튼 클릭 시 e.stopPropagation()으로 라우팅 방지
  const handleDelete = async (symbol: string) => {
    setLoading(true);
    try {
      await deleteFavoriteStock({ symbol });
      await fetchFavorites();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <main className="p-8 bg-[#131722] min-h-screen text-white">
      <h1 className="text-2xl font-semibold mb-6 text-center">관심종목</h1>
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <p className="text-center text-base">로딩 중...</p>
        ) : favorites.length === 0 ? (
          <p className="text-center text-base">관심종목이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {favorites.map(stock => (
              <li
                key={stock.code}
                className="flex justify-between items-center h-20 px-6 border border-gray-700 rounded-lg hover:bg-gray-800"
                onClick={() => router.push(`/company/${stock.code}`)}
              >
                <div className="truncate text-base font-medium max-w-[50%]">
                  {stock.name} ({stock.code})
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm whitespace-nowrap">
                    시가총액: {stock.marketCap.toLocaleString()}
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(stock.code);
                    }}
                    disabled={loading}
                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
