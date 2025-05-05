'use client';

import Link from 'next/link';
import AvatarMenu from '@/components/profile/avatarMenu';

interface NavBarProps {
    avatarUrl: string | null;
    userName: string | null;
    userEmail: string | null;
}

export default function NavBar({
                                   avatarUrl,
                                   userName,
                                   userEmail,
                               }: NavBarProps) {
    return (
        <nav className="bg-[#1E222D] border-b border-[#363A45]">
            <div className="container mx-auto px-4 flex items-center justify-between h-16">
                {/* 로고 & 메뉴 */}
                <div className="flex items-center space-x-8">
                    <Link href="/main" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">R</span>
                        </div>
                        <span className="text-xl font-bold text-white">Red Light</span>
                    </Link>

                    {/* 데스크탑용 메뉴 (md 이상) */}
                    <div className="flex space-x-6 max-md:hidden items-center">
                        <Link href="/class" className="text-gray-300 hover:text-white text-xs">
                            더 클래스
                        </Link>
                        <Link href="/market" className="text-gray-300 hover:text-white text-xs">
                            관심종목
                        </Link>
                        <Link href="/portfolio" className="text-gray-300 hover:text-white text-xs">
                            포트폴리오
                        </Link>
                        <Link href="/realtime" className="text-gray-300 hover:text-white text-xs">
                            실시간
                        </Link>
                        <Link href="/community" className="text-gray-300 hover:text-white text-xs">
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

                {/* 우측 아바타 & 팝업 */}
                <AvatarMenu
                    avatarUrl={avatarUrl}
                    userName={userName}
                    userEmail={userEmail}
                />
            </div>
        </nav>
    );
}
