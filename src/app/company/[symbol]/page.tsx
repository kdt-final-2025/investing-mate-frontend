// src/app/company/[symbol]/page.tsx
import ClientCompanyDetail from './ClientCompanyDetail'
import { Metadata } from 'next'

interface Props {
  params: {
    symbol: string
  }
}

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `회사 상세 | ${params.symbol}`,
    description: `${params.symbol}의 프로필 및 재무 메트릭 조회 페이지`,
  }
}

export default async function Page({ params }: Props) {
  const { symbol } = params
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://localhost:8080'

  // 프로필 & 메트릭 동시 호출
  const [resProfile, resMetrics] = await Promise.all([
    fetch(`${base}/api/company/${symbol}`, { cache: 'no-store' }),
    fetch(`${base}/api/company/${symbol}/metrics`, { cache: 'no-store' }),
  ])

  if (!resProfile.ok || !resMetrics.ok) {
    return (
      <main className="min-h-screen bg-[#131722] text-white flex items-center justify-center">
        <h1 className="text-xl">404: "{symbol}" 심볼을 찾을 수 없습니다.</h1>
      </main>
    )
  }

  const profile = await resProfile.json()
  const metrics = await resMetrics.json()

  return (
    <main className="min-h-screen bg-[#131722] text-white">
      {/* profile, metrics, 그리고 symbol을 ClientCompanyDetail로 전달 */}
      <ClientCompanyDetail
        profile={profile}
        metrics={metrics}
        symbol={symbol}
      />
    </main>
  )
}
