// src/app/stocks/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getSessionOrThrow } from '@/utils/auth';
import { createFavoriteStock } from '@/service/favoriteService';

interface Stock {
  name: string;
  symbol: string;
  marketCap: number | null;
  exchange: string;
}

interface FavoriteStock {
  code: string;  // 실제 레코드 파라미터명이 code 여야 합니다.
}

interface StockListResponse {
  stockResponses: Stock[];
  totalCount: number;
  favoriteStockResponses: FavoriteStock[] | null;
}

export default function StocksPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [favSet, setFavSet] = useState<Set<string>>(new Set());
  const [totalCount, setTotalCount] = useState(0);
  const [symbolFilter, setSymbolFilter] = useState('');
  const [page, setPage] = useState(1);
  const size = 20;
  const [sortBy, setSortBy] = useState<'id' | 'code' | 'marketCap'>('marketCap');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, [symbolFilter, page, sortBy, order]);

  async function fetchStocks() {
    setLoading(true);
    try {
      // Supabase 세션에서 토큰 가져오기
      const supabase = createClient();
      const session = await getSessionOrThrow(supabase);
      const token = session.access_token;

      const params = new URLSearchParams({
        symbol: symbolFilter,
        page: String(page),
        size: String(size),
        sortBy,
        order,
      });

      const res = await fetch(
        `http://localhost:8080/stocks?${params.toString()}`,
        {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error();

      const data: StockListResponse = await res.json();
      console.log('▶ favoriteStockResponses:', data.favoriteStockResponses);
      setStocks(data.stockResponses);
      setTotalCount(data.totalCount);

      // 코드 → 심볼 교집합 계산
      const allFav = data.favoriteStockResponses ?? [];
      const pageSymbols = new Set(data.stockResponses.map(s => s.symbol));
      const pageFavCodes = allFav
        .map(f => f.code)
        .filter(code => pageSymbols.has(code));
      setFavSet(new Set(pageFavCodes));
    } catch {
      setStocks([]);
      setTotalCount(0);
      setFavSet(new Set());
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalCount / size);
  const groupSize = 5;
  const currentGroup = Math.floor((page - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);
  const hasPrevGroup = startPage > 1;
  const hasNextGroup = endPage < totalPages;

  return (
    <main className="min-h-screen bg-[#131722] text-white">
      <div className="container mx-auto p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">주식 목록</h1>

        {/* 검색 & 정렬 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <form
            onSubmit={e => {
              e.preventDefault();
              setPage(1);
              fetchStocks();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="심볼 검색"
              value={symbolFilter}
              onChange={e => setSymbolFilter(e.target.value)}
              className="border border-gray-600 bg-[#1E222D] rounded px-3 py-1 focus:outline-none"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded">
              검색
            </button>
          </form>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setPage(1);
                if (sortBy === 'code') setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
                else {
                  setSortBy('code');
                  setOrder('asc');
                }
              }}
              className={`px-3 py-1 rounded ${sortBy === 'code' ? 'bg-blue-600' : 'bg-[#1E222D]'}`}
            >
              심볼 {sortBy === 'code' && (order === 'asc' ? '▲' : '▼')}
            </button>
            <button
              onClick={() => {
                setPage(1);
                if (sortBy === 'marketCap') setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
                else {
                  setSortBy('marketCap');
                  setOrder('asc');
                }
              }}
              className={`px-3 py-1 rounded ${sortBy === 'marketCap' ? 'bg-blue-600' : 'bg-[#1E222D]'}`}
            >
              시가총액 {sortBy === 'marketCap' && (order === 'asc' ? '▲' : '▼')}
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="bg-[#1E222D] rounded-lg p-4 flex-1 overflow-auto">
          {loading ? (
            <p className="text-center text-gray-400">로딩 중...</p>
          ) : (
            <table className="min-w-full">
              <thead>
              <tr>
                <th className="border-b px-4 py-2 text-left">이름</th>
                <th className="border-b px-4 py-2 text-left">심볼</th>
                <th className="border-b px-4 py-2 text-left">거래소</th>
                <th className="border-b px-4 py-2 text-right">시가총액</th>
                <th className="border-b px-4 py-2 text-center">☆</th>
              </tr>
              </thead>
              <tbody>
              {stocks.map(s => (
                <tr
                  key={s.symbol}
                  onClick={() => router.push(`/company/${s.symbol}`)}
                  className="hover:bg-[#2A2E39] cursor-pointer"
                >
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.symbol}</td>
                  <td className="px-4 py-2">{s.exchange}</td>
                  <td className="px-4 py-2 text-right">
                    {s.marketCap != null ? `${s.marketCap.toLocaleString()} $` : '–'}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={async e => {
                        e.stopPropagation();
                        try {
                          await createFavoriteStock({ symbol: s.symbol });
                          setFavSet(prev => new Set(prev).add(s.symbol));
                        } catch {}
                      }}
                      className="text-2xl leading-none"
                    >
                      {favSet.has(s.symbol) ? '★' : '☆'}
                    </button>
                  </td>
                </tr>
              ))}
              {!stocks.length && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-400">
                    데이터 없음
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(1)} disabled={!hasPrevGroup} className="px-2 py-1 border rounded">
            &lt;&lt;
          </button>
          <button onClick={() => setPage(startPage - 1)} disabled={!hasPrevGroup} className="px-2 py-1 border rounded">
            &lt;
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(num => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 border rounded ${num === page ? 'bg-blue-600 text-white' : 'border-gray-600'}`}
            >
              {num}
            </button>
          ))}
          <button onClick={() => setPage(endPage + 1)} disabled={!hasNextGroup} className="px-2 py-1 border rounded">
            &gt;
          </button>
          <button onClick={() => setPage(totalPages)} disabled={!hasNextGroup} className="px-2 py-1 border rounded">
            &gt;&gt;
          </button>
        </div>
      </div>
    </main>
  );
}
