// src/app/stocks/favorites/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import {
  getFavoriteStocks,
  deleteFavoriteStock,
  FavoriteStockResponse,
} from '@/service/favoriteService';

export default function FavoriteStocksPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteStockResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  // 즐겨찾기 해제: 확인 없이 바로 삭제
  const handleToggle = async (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await deleteFavoriteStock({ symbol });
      setFavorites(prev => prev.filter(s => s.code !== symbol));
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
      <h1 className="text-2xl font-semibold mb-6 text-center">관심 종목</h1>
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <p className="text-center text-base">로딩 중...</p>
        ) : favorites.length === 0 ? (
          <p className="text-center text-base">관심 종목이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {favorites.map(stock => (
              <li
                key={stock.code}
                className="flex justify-between items-center h-20 px-6 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
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
                    onClick={e => handleToggle(stock.code, e)}
                    disabled={loading}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <Star
                      size={24}
                      fill="currentColor"
                      strokeWidth={0}
                      className="text-yellow-400"
                    />
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