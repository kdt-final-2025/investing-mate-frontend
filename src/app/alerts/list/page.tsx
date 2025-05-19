// src/app/alerts/list/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  fetchAlerts,
  deleteAlert,
  StockAlertDetail,
  DeleteStockAlertRequest,
} from '@/service/alerts'

export default function AlertListPage() {
  const [alerts, setAlerts] = useState<StockAlertDetail[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAlerts()
  }, [])

  async function loadAlerts() {
    setLoading(true)
    setError(null)
    try {
      const list = await fetchAlerts()
      setAlerts(list)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (alert: StockAlertDetail) => {
    if (
      !confirm(
        `${alert.symbol} ${alert.targetPrice}원 ${
          alert.above ? '이상' : '이하'
        } 알림을 삭제하시겠습니까?`
      )
    ) {
      return
    }

    try {
      await deleteAlert({
        stockSymbol: alert.symbol,
        targetPrice: alert.targetPrice,
      } as DeleteStockAlertRequest)
      loadAlerts()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <main className="min-h-screen bg-[#131722] text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🔔 내 알림 목록</h1>

      {loading && <p>로딩 중…</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && alerts.length === 0 && <p>등록된 알림이 없습니다.</p>}

      <ul className="space-y-2">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="flex justify-between items-center bg-[#1E222D] p-4 rounded hover:bg-[#2A2E39] transition"
          >
            {/* 클릭 시 상세페이지로 이동 */}
            <Link
              href={`/alerts/${a.id}`}
              className="flex-1"
            >
              <p>
                <strong>{a.symbol}</strong> –{' '}
                <strong>{a.targetPrice.toLocaleString()}$</strong> (
                {a.above ? '이상' : '이하'})
              </p>
            </Link>

            <button
              onClick={() => onDelete(a)}
              className="ml-4 px-3 py-1 bg-red-600 rounded hover:bg-red-500"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
