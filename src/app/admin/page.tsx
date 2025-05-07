'use client';

import Link from 'next/link';
import LoadingWrapper from '@/components/LoadingWrapper';
import { useUserRole } from '@/hooks/useProfile/useUserRole';

export default function AdminDashboard() {
  const { role, loading: loadingRole } = useUserRole();
  const isAdmin = role === 'ADMINISTRATOR';

  // 권한 체크
  if (loadingRole) {
    return (
      <LoadingWrapper isLoading={true} error={null} children={undefined} />
    );
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#12121A] flex items-center justify-center">
        <p className="text-red-400 text-lg">관리자 권한이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12121A] p-8 flex flex-col items-center">
      {/* 제목 */}
      <h1 className="text-4xl font-bold text-white mb-8">운영모드 대시보드</h1>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* 사용자 관리 카드 */}
        <Link
          href="/admin/users"
          className="group block p-6 bg-gradient-to-br from-blue-700 to-indigo-700 rounded-xl shadow-lg transform transition hover:scale-105"
        >
          <h2 className="text-2xl font-semibold text-white mb-2 group-hover:underline">
            사용자 관리
          </h2>
          <p className="text-gray-300">회원 목록 조회 · 회원 관리</p>
        </Link>

        {/* 기자 신청관리 카드 */}
        <Link
          href="/admin/reporter-applications"
          className="group block p-6 bg-gradient-to-br from-green-700 to-teal-700 rounded-xl shadow-lg transform transition hover:scale-105"
        >
          <h2 className="text-2xl font-semibold text-white mb-2 group-hover:underline">
            기자신청 관리
          </h2>
          <p className="text-gray-300">신청서 승인&반려 처리</p>
        </Link>
      </div>
    </div>
  );
}
