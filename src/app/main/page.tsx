'use client'

import { useEffect, useState } from 'react'
import { useMarketData } from '@/hooks/useMarketData'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Spotlight } from '@/components/ui/spotlight'

const TradingViewWidget = dynamic(() => import('@/components/ui/TradingViewWidget'), {
  ssr: false,
})

function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(num))
}

function formatCurrency(num: number, symbol: string): string {
  if (symbol === 'BTC-KRW' || symbol === 'KRW=X') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

function formatChangePercent(num: number): string {
  const formatted = new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(num))
  return num >= 0 ? `+${formatted}` : `-${formatted}`
}

function formatPrice(num: number, symbol: string): string {
  if (symbol === 'BTC-KRW') {
    return new Intl.NumberFormat('ko-KR', {
      maximumFractionDigits: 0,
    }).format(num)
  }
  if (symbol === 'KRW=X') {
    return new Intl.NumberFormat('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export default function Page() {
  const { data: marketData, isLoading, error } = useMarketData()

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <main className="min-h-screen bg-[#131722] text-white">
      {/* 네비게이션 바 */}
      <nav className="bg-[#1E222D] border-b border-[#363A45]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">R</span>
                </div>
                <span className="text-xl font-bold text-white">Red Light</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                {new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">🔔</span>
            <span className="text-sm text-gray-400">마지막 업데이트: {new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* 차트 영역 */}
        <div className="bg-[#1E222D] rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold">SPY</h2>
              <div className="px-2 py-1 bg-[#2A2E39] rounded text-sm">1D</div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-[#2A2E39] rounded hover:bg-[#363B47] transition-colors">
                지표
              </button>
              <button className="px-3 py-1 bg-[#2A2E39] rounded hover:bg-[#363B47] transition-colors">
                전체화면
              </button>
            </div>
          </div>
          <div className="h-[400px]">
            <TradingViewWidget />
          </div>
        </div>

        {/* 시장 데이터 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData.map((data) => (
            <div
              key={data.symbol}
              className="relative bg-[#1E222D] p-4 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <Spotlight
                className="-top-40 -left-20 md:-top-40 md:-left-20"
                fill="rgb(255, 255, 255)"
              />
              <div className="relative z-10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{data.name || data.symbol}</h3>
                  <span className={`text-sm ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {data.change >= 0 ? '▲' : '▼'}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatPrice(data.price, data.symbol)}
                </div>
                <div className={`text-sm ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatChangePercent(data.changePercent)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
} 