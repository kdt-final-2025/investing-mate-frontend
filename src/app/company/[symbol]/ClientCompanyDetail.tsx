'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CompanyChart from '@/components/CompanyChart'

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
}

export default function ClientCompanyDetail({ profile, metrics }: Props) {
  const pathname = usePathname()

  // 메트릭 키 → 한글 레이블 매핑
  const metricLabels: Record<keyof Metric, string> = {
    '52WeekHigh': '52주 최고가',
    '52WeekLow': '52주 최저가',
    tenDayAverageTradingVolume: '10일 평균 거래량',
    grossMargin: '매출총이익률',
    netMargin: '순이익률',
    peBasicExclExtraTTM: '주가수익비율 (PER, 특수항목 제외, TTM)',
    pbAnnual: '주가순자산비율 (PBR, 연간)',
    roeTTM: '자기자본이익률 (ROE, TTM)',
    roaTTM: '총자산이익률 (ROA, TTM)',
  }

  return (
    <main className="min-h-screen bg-[#131722] text-white">
      {/* 네비게이션 바 생략 */}

      <div className="container mx-auto p-6">
        {/* 회사 헤더 */}
        <div className="bg-[#1E222D] rounded-lg p-6 flex items-center space-x-6 mb-6">
          {profile.logo && (
            <Image
              src={profile.logo}
              alt={`${profile.name} 로고`}
              width={64}
              height={64}
              className="rounded-md"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {profile.name ?? profile.ticker}
            </h1>
            <p className="text-sm text-gray-400">
              {profile.exchange ?? '—'} | {profile.country ?? '—'}
            </p>
          </div>
        </div>

        {/* 4-컬럼 그리드: 차트=3 / 사이드바=1 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* 차트 영역 (lg 화면에서 3칸) */}
          <div className="bg-[#1E222D] rounded-lg overflow-hidden lg:col-span-3 flex flex-col">
            <h2 className="px-6 pt-6 text-xl font-bold">주가 차트</h2>
            <div className="p-4 flex-1">
              <CompanyChart symbol={metrics.symbol} />
            </div>
          </div>

          {/* 사이드바: 기본 정보 + 재무 메트릭 */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* 기본 정보 카드 */}
            <div className="bg-[#1E222D] rounded-lg p-6 flex flex-col">
              <h2 className="text-xl font-semibold mb-4">📋 기본 정보</h2>
              <ul className="space-y-1 text-sm flex-1">
                <li>
                  <span className="font-medium">통화:</span> {profile.currency ?? '—'}
                </li>
                <li>
                  <span className="font-medium">시가총액:</span>{' '}
                  {profile.marketCapitalization != null
                    ? profile.marketCapitalization.toLocaleString()
                    : '정보 없음'} USD
                </li>
                <li>
                  <span className="font-medium">발행 주식수:</span>{' '}
                  {profile.shareOutstanding != null
                    ? profile.shareOutstanding.toLocaleString()
                    : '정보 없음'}
                </li>
                <li>
                  <span className="font-medium">산업:</span> {profile.finnhubIndustry ?? '—'}
                </li>
                <li>
                  <span className="font-medium">IPO 날짜:</span>{' '}
                  {profile.ipo
                    ? new Date(profile.ipo).toLocaleDateString()
                    : '—'}
                </li>
                <li>
                  <span className="font-medium">웹사이트:</span>{' '}
                  {profile.weburl ? (
                    <Link
                      href={profile.weburl}
                      target="_blank"
                      className="text-blue-400 hover:underline"
                    >
                      {profile.weburl}
                    </Link>
                  ) : (
                    '—'
                  )}
                </li>
                <li>
                  <span className="font-medium">전화번호:</span> {profile.phone ?? '—'}
                </li>
              </ul>
            </div>

            {/* 재무 메트릭 카드 */}
            <div className="bg-[#1E222D] rounded-lg p-6 flex flex-col flex-1 overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">📊 재무 메트릭</h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[#363A45]">
                {(Object.entries(metrics.metric) as [keyof Metric, number | null][]).map(
                  ([key, val]) => (
                    <tr key={key} className="hover:bg-[#2A2E39] transition-colors">
                      <th className="py-2 text-left font-medium">
                        {metricLabels[key] ?? key}
                      </th>
                      <td className="py-2 text-right">
                        {typeof val === 'number'
                          ? val.toLocaleString()
                          : '—'}
                      </td>
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
