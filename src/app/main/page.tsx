'use client';

import { useState, useEffect } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const TradingViewWidget = dynamic(
  () => import('@/components/ui/TradingViewWidget'),
  { ssr: false }
);

// 심볼 표시를 위한 매핑
const SYMBOL_DISPLAY: { [key: string]: string } = {
  '^KS11': 'K',
  '^KQ11': 'Q',
  'KRW=X': 'U',
  'BTC-KRW': 'B',
};

function formatChangePercent(num: number): string {
  if (isNaN(num) || num === 0) return '0.00';
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(num));
}

function formatPrice(num: number, symbol: string): string {
  if (symbol === 'BTC-KRW') {
    return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(
      num
    );
  }
  if (symbol === 'KRW=X') {
    return new Intl.NumberFormat('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

// 추천 뉴스 타입 정의
interface NewsResponse {
  id: number;
  title: string;
  description: string;
  imageUrls: string[];
  publishedAt: string;
}

export default function Page() {
  const { data: marketData, isLoading, error } = useMarketData();

  // 추천 뉴스 상태
  const [newsList, setNewsList] = useState<NewsResponse[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setNewsLoading(true);
      try {
        const res = await fetch(
          'http://localhost:8080/news?sortBy=publishedAt&order=desc&page=1&size=3'
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = (await res.json()) as { responses: NewsResponse[] };
        setNewsList(data.responses);
      } catch (e) {
        setNewsError((e as Error).message);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-[#131722] text-white flex flex-col">
      <div className="container mx-auto p-4 flex-1 flex flex-col gap-6">
        {/* 알림 영역 */}
        <div className="flex items-center space-x-2">
          <span className="text-yellow-500">🔔</span>
          <span className="text-sm text-gray-400">마이데이터 갱신 오류 안내</span>
          <span className="text-gray-400">{new Date().toLocaleDateString()}</span>
        </div>

        {/* 차트와 주요 종목 비교 영역 */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1">
          {/* 차트 영역 */}
          <div className="bg-[#1E222D] rounded-lg p-4 flex-1 flex flex-col">
            <div className="flex-1">
              {/* SPY 지수만 표시하도록 symbol prop 전달 */}
              <TradingViewWidget symbol="SPY" />
            </div>
          </div>

          {/* 주요 종목 비교 */}
          <div className="bg-[#1E222D] rounded-lg p-4 lg:w-[35%] flex flex-col">
            <h2 className="text-xl font-bold mb-4">주요 종목 비교하기</h2>
            <div className="grid grid-cols-1 gap-4 flex-1 overflow-y-auto">
              {marketData.map((data) => (
                <div
                  key={data.symbol}
                  className="relative bg-[#2A2E39] p-3 rounded-lg group hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        {SYMBOL_DISPLAY[data.symbol] || data.symbol.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">
                          {data.name || data.symbol}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {data.symbol}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {formatPrice(data.price, data.symbol)}
                      </div>
                      <div
                        className={`text-sm ${
                          data.change > 0
                            ? 'text-green-500'
                            : data.change < 0
                              ? 'text-red-500'
                              : 'text-gray-400'
                        }`}
                      >
                        {data.change > 0 ? '▲' : data.change < 0 ? '▼' : '-'}{' '}
                        {formatChangePercent(data.changePercent)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 추천 뉴스 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">추천 뉴스</h2>
            <Link href="/news" className="text-sm text-blue-400 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newsLoading && (
              <p className="col-span-full text-center text-gray-400">
                로딩 중...
              </p>
            )}
            {newsError && (
              <p className="col-span-full text-center text-red-500">
                {newsError}
              </p>
            )}
            {!newsLoading && newsList.length === 0 && (
              <p className="col-span-full text-center text-gray-400">
                추천 뉴스가 없습니다.
              </p>
            )}
            {newsList.map((n) => (
              <article
                key={n.id}
                className="bg-[#2A2E39] rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                {n.imageUrls[0] && (
                  <img
                    src={n.imageUrls[0]}
                    alt={n.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-semibold mb-2 line-clamp-2">
                    {n.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(n.publishedAt).toLocaleDateString()}
                  </p>
                  <Link
                    href={`/news/${n.id}`}
                    className="mt-auto text-blue-400 hover:underline text-xs"
                  >
                    더보기 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
