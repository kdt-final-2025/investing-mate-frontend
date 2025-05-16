'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import AvatarMenu from '@/components/profile/avatarMenu'
import { createClient } from '@/utils/supabase/client'
import { getSessionOrThrow } from '@/utils/auth'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { API_BASE } from '@/service/baseAPI'

interface NavBarProps {
  avatarUrl: string | null
  userName: string | null
  userEmail: string | null
}

interface AlertData {
  stockAlertId: number
  stockSymbol: string
  targetPrice: number
  above: boolean
}

export default function NavBar({
                                 avatarUrl,
                                 userName,
                                 userEmail,
                               }: NavBarProps) {
  const [showAlerts, setShowAlerts] = useState(false)
  const [alerts, setAlerts] = useState<AlertData[]>([])

  useEffect(() => {
    let es: EventSourcePolyfill

    async function subscribe() {
      const supabase = createClient()
      const session = await getSessionOrThrow(supabase)
      const token = session.access_token

      es = new EventSourcePolyfill(`${API_BASE}/alerts/subscribe`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      es.onmessage = (e) => {
        try {
          const data: AlertData = JSON.parse(e.data)
          setAlerts((prev) => [data, ...prev])
        } catch {
          console.error('Invalid SSE data', e.data)
        }
      }

      es.onerror = () => {
        es.close()
      }
    }

    subscribe()
    return () => es?.close()
  }, [])

  return (
    <nav className="bg-[#1E222D] border-b border-[#363A45]">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* 좌측: 로고 & 메뉴 */}
        <div className="flex items-center space-x-8">
          <Link href="/main" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-xl font-bold text-white">Red Light</span>
          </Link>

          <div className="flex space-x-6 max-md:hidden items-center">

            <Link href="/indicator" className="text-gray-300 hover:text-white text-xs">
              경제지표
            </Link>
            <Link href="/stocks/favorites" className="text-gray-300 hover:text-white text-xs">
              관심종목
            </Link>
            <Link href="/company" className="text-gray-300 hover:text-white text-xs">
              주식
            </Link>
            <Link
              href="/chat"
              className="text-gray-300 hover:text-white text-xs"
            >
              StockAI
            <Link href="/boards" className="text-gray-300 hover:text-white text-xs">
              커뮤니티
            </Link>
            <div className="relative">
              <input
                type="text"
                placeholder="주식, 가상자산 검색"
                className="bg-[#2A2E39] text-white px-4 py-2 rounded-lg w-64 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* 우측: 알림 + 아바타 */}
        <div className="flex items-center space-x-4 relative">
          <button onClick={() => setShowAlerts(!showAlerts)} className="relative">
            <span className="text-white text-xl">🔔</span>

            {showAlerts && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-lg z-50">
                <div className="p-4 border-b font-semibold text-sm">최근 알림</div>
                <ul className="max-h-60 overflow-y-auto text-sm">
                  {alerts.length > 0 ? (
                    alerts.map((n) => (
                      <li key={n.stockAlertId} className="px-4 py-2 hover:bg-gray-100">
                        <strong>{n.stockSymbol}</strong>이&nbsp;
                        <strong>{n.targetPrice.toLocaleString()}</strong>원&nbsp;
                        {n.above ? '이상' : '이하'} 도달!
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">알림이 없습니다.</li>
                  )}
                </ul>
                <div className="p-2 border-t text-right">
                  <Link href="/alerts/list" className="text-blue-500 text-sm hover:underline">
                    전체 보기
                  </Link>
                </div>
              </div>
            )}
          </button>

          <AvatarMenu avatarUrl={avatarUrl} userName={userName} userEmail={userEmail} />
        </div>
      </div>
    </nav>
  )
}
