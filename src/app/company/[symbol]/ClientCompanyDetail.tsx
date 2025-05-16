'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Bell } from 'lucide-react'
import CompanyChart from '@/components/CompanyChart'
import AlertForm from '@/components/AlertForm'
import { createFavoriteStock } from '@/service/favoriteService'

interface CompanyProfile {
  country: string | null
  currency: string | null
  exchange: string | null
  name: string | null
  ticker: string | null
  marketCapitalization: number | null
  shareOutstanding: number | null
  finnhubIndustry: string | null
  ipo: string | null
  logo: string | null
  weburl: string | null
  phone: string | null
}

interface Metric {
  '52WeekHigh': number | null
  '52WeekLow': number | null
  tenDayAverageTradingVolume: number | null
  grossMargin: number | null
  netMargin: number | null
  peBasicExclExtraTTM: number | null
  pbAnnual: number | null
  roeTTM: number | null
  roaTTM: number | null
}

interface CompanyMetric {
  symbol: string
  metric: Metric
}

interface Props {
  profile: CompanyProfile
  metrics: CompanyMetric
  symbol: string
}

export default function ClientCompanyDetail({ profile, metrics, symbol }: Props) {
  const [showAlertForm, setShowAlertForm] = useState(false)

  const metricLabels: Record<keyof Metric, string> = {
    '52WeekHigh': '52주 최고가',
    '52WeekLow': '52주 최저가',
    tenDayAverageTradingVolume: '10일 평균 거래량',
    grossMargin: '매출총이익률',
    netMargin: '순이익률',
    peBasicExclExtraTTM: 'PER (TTM)',
    pbAnnual: 'PBR (연간)',
    roeTTM: 'ROE (TTM)',
    roaTTM: 'ROA (TTM)',
  }

  return (
    <main className="min-h-screen bg-[#131722] text-white">
      <div className="container mx-auto p-6">
        <header className="flex items-center justify-between mb-6 relative">
          <div className="flex items-center space-x-4">
            {profile.logo && (
              <Image
                src={profile.logo}
                alt={`${profile.name} 로고`}
                width={48}
                height={48}
                className="rounded-md"
              />
            )}
            <h1 className="text-2xl font-bold">
              {profile.name ?? symbol} ({symbol})
            </h1>
          </div>

          <div className="flex items-center space-x-2 relative">
            {/* 알림 버튼 */}
            <button
              onClick={() => setShowAlertForm(prev => !prev)}
              className="p-2 rounded-full hover:bg-white/10"
              aria-label="알림 설정"
            >
              <Bell size={24} />
            </button>

            {showAlertForm && (
              <div className="absolute top-full right-0 mt-2 w-80 z-50 bg-[#1E222D] rounded-lg shadow-lg p-4">
                <AlertForm
                  symbol={symbol}
                  onSuccess={() => setShowAlertForm(false)}
                />
              </div>
            )}

            {/* 즐겨찾기 등록 버튼 */}
            <button
              onClick={async () => {
                try {
                  await createFavoriteStock({ symbol })
                  alert(`${profile.name ?? symbol}을(를) 관심종목에 추가했습니다.`)
                } catch (err) {
                  console.error(err)
                  alert('등록에 실패했습니다.')
                }
              }}
              className="text-2xl leading-none p-2 rounded hover:bg-white/10"
            >
              ☆
            </button>
          </div>
        </header>

        {/* 차트 & 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          <div className="bg-[#1E222D] rounded-lg overflow-hidden lg:col-span-3 flex flex-col">
            <h2 className="px-6 pt-6 text-xl font-bold">📈 주가 차트</h2>
            <div className="p-4 flex-1">
              <CompanyChart symbol={metrics.symbol} />
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="bg-[#1E222D] rounded-lg p-6 flex flex-col">
              <h2 className="text-xl font-semibold mb-4">📋 기본 정보</h2>
              <ul className="space-y-1 text-sm flex-1">
                <li><span className="font-medium">통화:</span> {profile.currency ?? '—'}</li>
                <li><span className="font-medium">시가총액:</span>{' '}
                  {profile.marketCapitalization != null
                    ? profile.marketCapitalization.toLocaleString()
                    : '정보 없음'} USD
                </li>
                <li><span className="font-medium">발행 주식수:</span>{' '}
                  {profile.shareOutstanding?.toLocaleString() ?? '정보 없음'}
                </li>
                <li><span className="font-medium">산업:</span> {profile.finnhubIndustry ?? '—'}</li>
                <li><span className="font-medium">IPO 날짜:</span>{' '}
                  {profile.ipo ? new Date(profile.ipo).toLocaleDateString() : '—'}
                </li>
                <li><span className="font-medium">웹사이트:</span>{' '}
                  {profile.weburl ? (
                    <Link
                      href={profile.weburl}
                      target="_blank"
                      className="text-blue-400 hover:underline"
                    >
                      {profile.weburl}
                    </Link>
                  ) : '—'}
                </li>
                <li><span className="font-medium">전화번호:</span> {profile.phone ?? '—'}</li>
              </ul>
            </div>

            <div className="bg-[#1E222D] rounded-lg p-6 flex flex-col flex-1 overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">📊 재무 메트릭</h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[#363A45]">
                {(Object.entries(metrics.metric) as [keyof Metric, number | null][]).map(
                  ([key, val]) => (
                    <tr key={key} className="hover:bg-[#2A2E39] transition-colors">
                      <th className="py-2 text-left font-medium">{metricLabels[key] ?? key}</th>
                      <td className="py-2 text-right">{typeof val === 'number' ? val.toLocaleString() : '—'}</td>
                    </tr>
                  )
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
