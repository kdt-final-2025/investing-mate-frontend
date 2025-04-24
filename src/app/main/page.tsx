'use client';

import { useEffect, useRef, useState } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import LoadingWrapper from '@/components/LoadingWrapper';
import { signOutAction } from '@/utils/actions';

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

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Guest');
  const [userEmail, setUserEmail] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 사용자 정보 로드
  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setAvatarUrl(null);
        setUserName('Guest');
        setUserEmail('');
        return;
      }
      const { data, error: uErr } = await supabase.auth.getUser();
      if (uErr || !data.user) return;

      const user = data.user as any;
      const raw = user.raw_user_meta_data;
      setUserName(raw?.name || user.user_metadata?.full_name || user.email);
      setUserEmail(raw?.email || user.email || '');

      let avatar =
        raw?.avatar_url ||
        raw?.picture ||
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        null;
      if (avatar) avatar = avatar.replace(/s\d+-c/, 's200-c');
      setAvatarUrl(avatar);
    }

    loadUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) loadUser();
      else {
        setAvatarUrl(null);
        setUserName('Guest');
        setUserEmail('');
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  // 외부 클릭 시 팝업 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <LoadingWrapper isLoading={isLoading} error={error}>
      <main className="min-h-screen bg-[#131722] text-white">
        {/* 네비게이션 바 */}
        <nav className="bg-[#1E222D] border-b border-[#363A45]">
          <div className="container mx-auto px-4 flex items-center justify-between h-16">
            {/* 로고 & 메뉴 */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">R</span>
                </div>
                <span className="text-xl font-bold text-white">Red Light</span>
              </Link>
              <div className="flex space-x-6 max-md:hidden items-center">
                <Link
                  href="/class"
                  className="text-gray-300 hover:text-white text-xs"
                >
                  더 클래스
                </Link>
                <Link
                  href="/market"
                  className="text-gray-300 hover:text-white text-xs"
                >
                  관심종목
                </Link>
                <Link
                  href="/portfolio"
                  className="text-gray-300 hover:text-white text-xs"
                >
                  포트폴리오
                </Link>
                <Link
                  href="/realtime"
                  className="text-gray-300 hover:text-white text-xs"
                >
                  실시간
                </Link>
                <Link
                  href="/community"
                  className="text-gray-300 hover:text-white text-xs"
                >
                  커뮤니티
                </Link>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="주식, 가상자산 검색"
                    className="bg-[#2A2E39] text-white px-4 py-2 rounded-lg w-64 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400">
                    🔍
                  </span>
                </div>
              </div>
            </div>
            {/* 아바타 & 팝업 */}
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                  onClick={() => setMenuOpen((o) => !o)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/default-avatar.png';
                  }}
                />
              ) : (
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white text-xs"
                >
                  로그인
                </Link>
              )}

              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-64 bg-[#2A2E39] text-white rounded-lg shadow-lg z-50"
                >
                  <div className="absolute top-0 right-4 w-3 h-3 bg-[#2A2E39] transform rotate-45 -mt-1" />
                  <div className="p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={avatarUrl!}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{userName}</span>
                        <span className="text-xs break-all">{userEmail}</span>
                      </div>
                    </div>
                    <hr className="border-gray-700" />
                    <ul className="space-y-1 text-sm">
                      <li>
                        <Link
                          href="/profile"
                          className="block px-2 py-1 hover:bg-[#363B47] rounded"
                        >
                          프로필 보기
                        </Link>
                      </li>
                      <li>
                        <form action={signOutAction}>
                          <button
                            type="submit"
                            className="w-full text-left px-2 py-1 hover:bg-[#363B47] rounded"
                          >
                            로그아웃
                          </button>
                        </form>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

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
