'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import AvatarMenu from '@/components/profile/avatarMenu';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { API_BASE } from '@/service/baseAPI';

interface NavBarProps {
  avatarUrl: string | null;
  userName: string | null;
  userEmail: string | null;
}

interface AlertData {
  stockAlertId: number;
  stockSymbol: string;
  targetPrice: number;
  above: boolean;
}

export default function NavBar({ avatarUrl, userName, userEmail }: NavBarProps) {
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let es: EventSourcePolyfill;
    async function subscribe() {
      const supabase = (await import('@/utils/supabase/client')).createClient();
      const session = await (await import('@/utils/auth')).getSessionOrThrow(supabase);
      es = new EventSourcePolyfill(`${API_BASE}/alerts/subscribe`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      es.onmessage = (e: MessageEvent) => {
        try {
          const data: AlertData = JSON.parse(e.data);
          setAlerts(prev => [data, ...prev]);
        } catch {
          console.error('Invalid SSE data', e.data);
        }
      };
      es.onerror = () => es.close();
    }
    subscribe();
    return () => es?.close();
  }, []);

  const handleMouseEnter = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setShowFavorites(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => setShowFavorites(false), 300);
  };

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
            <Link href="/indicator" className="text-gray-300 hover:text-white text-xs">경제지표</Link>

            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className="cursor-pointer text-gray-300 hover:text-white text-xs">관심종목</span>
              {showFavorites && (
                <div className="absolute left-0 mt-2 w-48 bg-[#1E222D] text-white rounded-lg shadow-lg z-50">
                  <div className="p-4 flex flex-col gap-2">
                    <Link href="/stocks/favorites" className="flex items-center justify-between p-2 bg-[#2A2E39] rounded-lg hover:shadow-lg transition">
                      <span>주식</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <Link href="/indicator/favorites" className="flex items-center justify-between p-2 bg-[#2A2E39] rounded-lg hover:shadow-lg transition">
                      <span>경제지표</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/company" className="text-gray-300 hover:text-white text-xs">주식</Link>
            <Link href="/chat" className="text-gray-300 hover:text-white text-xs">StockAI</Link>
            <Link href="/boards" className="text-gray-300 hover:text-white text-xs">커뮤니티</Link>

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
          <button onClick={() => setShowAlerts(prev => !prev)} className="relative">
            <span className="text-white text-xl">🔔</span>
            {showAlerts && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-lg z-50">
                <div className="p-4 border-b font-semibold text-sm">최근 알림</div>
                <ul className="max-h-60 overflow-y-auto text-sm">
                  {alerts.length > 0 ? (
                    alerts.map(n => (
                      <li key={n.stockAlertId} className="px-4 py-2 hover:bg-gray-100">
                        <strong>{n.stockSymbol}</strong>이 <strong>{n.targetPrice.toLocaleString()}</strong>원 {n.above ? '이상' : '이하'} 도달!
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">알림이 없습니다.</li>
                  )}
                </ul>
                <div className="p-2 border-t text-right">
                  <Link href="/alerts/list" className="text-blue-500 text-sm hover:underline">전체 보기</Link>
                </div>
              </div>
            )}
          </button>

          <AvatarMenu avatarUrl={avatarUrl} userName={userName} userEmail={userEmail} />
        </div>
      </div>
    </nav>
  );
}
