// components/Profile/avatarMenu.tsx
'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { signOutAction } from '@/utils/actions';
import { useClickOutside } from '@/hooks/useProfile/useClickOutside';
import { useUserRole } from '@/hooks/useProfile/useUserRole';

interface AvatarMenuProps {
  avatarUrl: string | null;
  userName: string | null;
  userEmail: string | null;
}

export default function AvatarMenu({
  avatarUrl,
  userName,
  userEmail,
}: AvatarMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { role, loading: loadingRole } = useUserRole();
  const isAdmin = role === 'ADMINISTRATOR';

  // 외부 클릭 시 메뉴 닫기
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  if (!avatarUrl) {
    return (
      <Link href="/login" className="text-gray-300 hover:text-white text-xs">
        로그인
      </Link>
    );
  }

  return (
    <div className="relative">
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

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-64 bg-[#2A2E39] text-white rounded-lg shadow-lg z-50"
        >
          <div className="absolute top-0 right-4 w-3 h-3 bg-[#2A2E39] transform rotate-45 -mt-1" />
          <div className="p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src={avatarUrl}
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
                  onClick={() => setMenuOpen(false)}
                  className="block px-2 py-1 hover:bg-[#363B47] rounded"
                >
                  프로필 보기
                </Link>
              </li>
              {!loadingRole && isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block px-2 py-1 hover:bg-[#363B47] rounded"
                  >
                    운영모드
                  </Link>
                </li>
              )}
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
  );
}
