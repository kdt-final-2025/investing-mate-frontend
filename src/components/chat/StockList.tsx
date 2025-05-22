//src/components/chat/StockList.tsx
import React from 'react';
import type { ApiResponse, StockData } from '@/service/chatService';

interface StockListProps {
  stockData: ApiResponse | null;
}

const riskLevelColors: Record<StockData['riskLevel'], string> = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-red-500',
};

const formatNumber = (num: number): string =>
  new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

const formatPercent = (num: number): string =>
  new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

export default function StockList({ stockData }: StockListProps) {
  return (
    <div className="bg-[#1E222D] rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">추천 종목</h2>
      {!stockData || stockData.stocks.length === 0 ? (
        <div className="bg-[#2A2E39] p-4 rounded-lg text-center">
          <p className="text-gray-400 mb-2">추천 종목이 없습니다</p>
          <p className="text-sm text-gray-500">주식에 관한 질문을 해보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-h-[calc(100vh-240px)] overflow-y-auto">
          {stockData.stocks.map((stock) => (
            <div
              key={stock.id}
              className="bg-[#2A2E39] p-4 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                    {stock.ticker.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{stock.name}</h3>
                    <span className="text-xs text-gray-400">
                      {stock.ticker}
                    </span>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs text-white ${riskLevelColors[stock.riskLevel]}`}
                >
                  {stock.riskLevel}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="bg-[#1E222D] p-2 rounded">
                  <p className="text-xs text-gray-400">현재 가격</p>
                  <p className="font-bold">
                    ${formatNumber(stock.currentPrice)}
                  </p>
                </div>
                <div className="bg-[#1E222D] p-2 rounded">
                  <p className="text-xs text-gray-400">1년 최고가</p>
                  <p className="font-bold">
                    ${formatNumber(stock.highPrice1y)}
                  </p>
                </div>
                <div className="bg-[#1E222D] p-2 rounded">
                  <p className="text-xs text-gray-400">배당률</p>
                  <p className="font-bold text-green-500">
                    {formatPercent(stock.dividendYield)}%
                  </p>
                </div>
                <div className="bg-[#1E222D] p-2 rounded">
                  <p className="text-xs text-gray-400">고점 대비</p>
                  <p className="font-bold text-red-500">
                    -{formatPercent((1 - stock.currentToHighRatio) * 100)}%
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm text-gray-300">{stock.detail}</p>
                {stock.recommendReason && (
                  <div className="mt-2 inline-block bg-blue-500 bg-opacity-20 text-white text-xs px-2 py-1 rounded">
                    {stock.recommendReason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
