'use client';

import { useMarketData } from '@/hooks/useMarketData';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LoadingWrapper from '@/components/LoadingWrapper';
import { useNews } from '@/hooks/useNews';

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
  const {
    data: newsData,
    loading: newsLoading,
    error: newsError,
  } = useNews('추천 뉴스', 1, 3, 'publishedAt', 'desc');

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
    <LoadingWrapper isLoading={isLoading} error={error}>
      <main className="min-h-screen bg-[#131722] text-white">
        <div className="container mx-auto p-4">
          {/* 알림 영역 */}
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-yellow-500">🔔</span>
            <span className="text-sm text-gray-400">
              마이데이터 갱신 오류 안내
            </span>
            <span className="text-gray-400">
              {new Date().toLocaleDateString()}
            </span>
          </div>

          {/* 차트와 주요 종목 비교 영역 */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="bg-[#1E222D] rounded-lg p-4 lg:w-[65%] h-[350px]">
              <TradingViewWidget />
            </div>
            <div className="bg-[#1E222D] rounded-lg p-4 lg:w-[35%]">
              <h2 className="text-xl font-bold mb-4">주요 종목 비교하기</h2>
              <div className="grid grid-cols-1 gap-4 max-h-[350px] overflow-y-auto">
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
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">추천 뉴스</h2>
              <Link
                href="/news"
                className="text-sm text-blue-400 hover:underline"
              >
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
              {!newsLoading && newsData?.responses.length === 0 && (
                <p className="col-span-full text-center text-gray-400">
                  추천 뉴스가 없습니다.
                </p>
              )}
              {newsData?.responses.map((n) => (
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
    </LoadingWrapper>
  );
}
