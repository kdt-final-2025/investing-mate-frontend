// src/app/stocks/favorites/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFavoriteStocks, FavoriteStockResponse } from '@/service/favoriteService';

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
            {favorites.map((stock) => (
              <li
                key={stock.code}
                className="flex justify-between items-center h-32 px-6 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800"
                onClick={() => router.push(`/company/${stock.code}`)}
              >
                <div className="truncate text-base font-medium max-w-[60%]">
                  {stock.name} ({stock.code})
                </div>
                <div className="text-sm">
                  시가총액: {stock.marketCap.toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}