'use client';

import dynamic from 'next/dynamic';
import { useMarketData } from '@/hooks/useMarketData';
import { useUser } from '@/hooks/useProfile/useUser';
import LoadingWrapper from '@/components/LoadingWrapper';
import { createClient } from '@/utils/supabase/client';
import NavBar from "@/components/navBar";

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

function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(num));
}

function formatCurrency(num: number, symbol: string): string {
  if (symbol === 'BTC-KRW' || symbol === 'KRW=X') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function formatChangePercent(num: number): string {
  if (isNaN(num) || num === 0) return '0.00';
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(num));
}

function formatPrice(num: number, symbol: string): string {
  if (symbol === 'BTC-KRW') {
    return new Intl.NumberFormat('ko-KR', {
      maximumFractionDigits: 0,
    }).format(num);
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

export default function Page() {
  const supabase = createClient();
  const { data: marketData, isLoading, error } = useMarketData();
  const { userName, userEmail, avatarUrl } = useUser(supabase);

  return (
    <LoadingWrapper isLoading={isLoading} error={error}>
      <main className="min-h-screen bg-[#131722] text-white">
        {/* NavBar 컴포넌트로 교체 */}
        <NavBar
            avatarUrl={avatarUrl}
            userName={userName}
            userEmail={userEmail}
        />

        {/* 컨텐츠 영역 */}
        <div className="container mx-auto p-4">
          {/* 알림 */}
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-yellow-500">🔔</span>
            <span className="text-sm text-gray-400">
              마이데이터 갱신 오류 안내
            </span>
            <span className="text-gray-400">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          {/* 차트 & 주요 종목 비교 */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="bg-[#1E222D] rounded-lg p-4 lg:w-[65%]">
              <div className="h-[350px]">
                <TradingViewWidget />
              </div>
            </div>
            <div className="bg-[#1E222D] rounded-lg p-4 lg:w-[35%]">
              <h2 className="text-xl font-bold mb-4">주요 종목 비교하기</h2>
              <div className="grid grid-cols-1 gap-4 max-h-[350px] overflow-y-auto">
                {marketData.map((data) => (
                  <div
                    key={data.symbol}
                    className="relative bg-[#2A2E39] p-3 rounded-lg group hover:shadow-lg transition duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          {SYMBOL_DISPLAY[data.symbol] || data.symbol.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {data.name || data.symbol}
                          </h3>
                          <span className="text-sm text-gray-400">
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
                          {data.change === 0
                            ? '-'
                            : data.change > 0
                              ? '▲'
                              : '▼'}{' '}
                          {formatChangePercent(Math.abs(data.changePercent))}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 뉴스 섹션 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">오늘의 뉴스</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-[#2A2E39] rounded text-sm hover:bg-[#363B47]">
                  보유 종목
                </button>
                <button className="px-3 py-1 bg-[#2A2E39] rounded text-sm hover:bg-[#363B47]">
                  오늘의 Pick
                </button>
                <button className="px-3 py-1 bg-[#2A2E39] rounded text-sm hover:bg-[#363B47]">
                  추천 뉴스
                </button>
              </div>
            </div>
            <div className="bg-[#1E222D] rounded-lg p-4">
              <div className="text-center text-gray-400">
                관련 뉴스가 없습니다.
              </div>
            </div>
          </div>
        </div>
      </main>
    </LoadingWrapper>
  );
}
