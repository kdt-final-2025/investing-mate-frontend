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

      {/* 카드 그리드: 한 줄에 한 개씩, 가로로 꽉 채우고 중앙정렬 */}
      <div className="grid grid-cols-1 gap-8 w-full max-w-4xl">
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
        {/* 두 번째 카드 추가 시 이 자리에 작성하면 첫 번째 카드 아래로 배치됩니다. */}
      </div>
    </div>
  );
}
