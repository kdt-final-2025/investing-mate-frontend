// src/app/alerts/[alertId]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchAlertDetail, StockAlertDetail } from '@/service/alerts'

export default function AlertDetailPage() {
  const { alertId } = useParams() as { alertId: string }
  const router = useRouter()

  const [alert, setAlert] = useState<StockAlertDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!alertId) return
    setLoading(true)
    fetchAlertDetail(Number(alertId))
      .then(setAlert)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [alertId])

  if (loading) return <p className="p-6 text-center text-white">로딩 중…</p>
  if (error)
    return (
      <div className="p-6 text-center text-red-400">
        <p>오류: {error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white"
        >
          뒤로 가기
        </button>
      </div>
    )
  if (!alert)
    return (
      <p className="p-6 text-center text-white">알림을 찾을 수 없습니다.</p>
    )

  return (
    <main className="min-h-screen bg-[#131722] text-white p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔔 알림 상세</h1>

      <dl className="bg-[#1E222D] p-6 rounded-lg space-y-4">
        <div>
          <dt className="font-medium">심볼</dt>
          <dd className="mt-1">{alert.symbol}</dd>
        </div>
        <div>
          <dt className="font-medium">목표 가격</dt>
          <dd className="mt-1">
            {alert.targetPrice.toLocaleString()}원
          </dd>
        </div>
        <div>
          <dt className="font-medium">조건</dt>
          <dd className="mt-1">{alert.above ? '이상' : '이하'}</dd>
        </div>
        <div>
          <dt className="font-medium">알림 ID</dt>
          <dd className="mt-1">{alert.id}</dd>
        </div>
      </dl>

      <div className="mt-6 flex justify-between">
        <Link
          href="/alerts/list"
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          ← 목록으로
        </Link>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
        >
          뒤로 가기
        </button>
      </div>
    </main>
  )
}
