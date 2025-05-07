// app/admin/reporter-applications/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

import LoadingWrapper from '@/components/LoadingWrapper';
import { useUserRole } from '@/hooks/useProfile/useUserRole';

interface ApplicationResponse {
  applicationId: number;
  userId: string;
  fullname: string; // ← 여기에 닉네임 필드 추가
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  processedAt: string | null;
}

export default function ReporterApplicationPage() {
  const supabase = createClient();
  const { role, loading: loadingRole } = useUserRole();
  const isAdmin = role === 'ADMINISTRATOR';
  const didFetch = useRef(false);
  const [apps, setApps] = useState<ApplicationResponse[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  // ➊ 필터 상태: ALL, PENDING, REJECTED
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'REJECTED'>('ALL');
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;

  const fetchApps = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch(`${API_BASE}/reporter-applications`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (res.ok) setApps(await res.json());
  };

  useEffect(() => {
    if (loadingRole || !isAdmin || didFetch.current) return;
    didFetch.current = true;
    fetchApps();
  }, [loadingRole, isAdmin]);

  if (loadingRole) {
    return <LoadingWrapper isLoading error={null} children={undefined} />;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen …">
        <p className="text-red-400 …">관리자 권한이 필요합니다.</p>
      </div>
    );
  }

  // ➋ 필터 적용된 리스트
  const filteredApps = apps.filter((app) => {
    if (filter === 'ALL') return true;
    return app.status === filter;
  });

  // **REJECTED가 아닌 신청서만 토글 대상으로 삼도록**
  const toggleSelect = (id: number) => {
    // 토글하려는 항목이 반려된 상태면 무시
    const app = apps.find((a) => a.applicationId === id);
    if (app?.status === 'REJECTED') return;

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const selectable = apps
      .filter((a) => a.status !== 'REJECTED')
      .map((a) => a.applicationId);

    if (selected.length === selectable.length) {
      setSelected([]);
    } else {
      setSelected(selectable);
    }
  };

  const processApps = async (action: 'APPROVED' | 'REJECTED') => {
    if (!selected.length) return;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch(`${API_BASE}/reporter-applications`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ ids: selected, action }),
    });
    if (res.ok) {
      fetchApps();
      setSelected([]);
    }
  };

  return (
    <div className="p-6 bg-[#12121A] min-h-screen">
      {/* 대시보드로 돌아가기 + 제목 */}
      <div className="relative flex items-center justify-center py-2 mb-6">
        <Link
          href="/admin"
          className="absolute left-0 text-sm text-gray-300 hover:text-white"
        >
          ← 운영모드 대시보드로 돌아가기
        </Link>
        <h1 className="text-3xl font-semibold text-white">
          ReporterApply-Manage
        </h1>
      </div>
      <div className="mx-auto mb-8 h-1 w-32 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded"></div>

      <div className="flex justify-between items-center mb-4">
        {/* 일괄 처리 버튼 (왼쪽) */}
        <div className="flex space-x-3">
          <button
            onClick={() => processApps('APPROVED')}
            disabled={!selected.length}
            className="px-4 py-2 border border-green-500 rounded text-green-400 disabled:opacity-50 transition
                     shadow-[0_0_8px_rgba(16,185,129,0.6)] [text-shadow:0_0_4px_rgba(16,185,129,0.7)]
                     hover:bg-green-500 hover:text-white"
          >
            선택 승인
          </button>
          <button
            onClick={() => processApps('REJECTED')}
            disabled={!selected.length}
            className="px-4 py-2 border border-red-500 rounded text-red-400 disabled:opacity-50 transition
                     shadow-[0_0_8px_rgba(239,68,68,0.6)] [text-shadow:0_0_4px_rgba(239,68,68,0.7)]
                     hover:bg-red-500 hover:text-white"
          >
            선택 반려
          </button>
        </div>

        {/* 필터 토글 (오른쪽) */}
        <div className="flex space-x-2">
          {(['ALL', 'PENDING', 'REJECTED'] as const).map((key) => {
            const isSel = filter === key;
            let base = 'px-4 py-2 rounded text-sm font-medium transition ';
            if (isSel) {
              // 선택된 상태: 네온 사인 효과
              switch (key) {
                case 'ALL':
                  base += `border border-white text-white
                         shadow-[0_0_8px_rgba(255,255,255,0.6)]
                         [text-shadow:0_0_4px_rgba(255,255,255,0.7)]`;
                  break;
                case 'PENDING':
                  base += `border border-yellow-500 text-yellow-400
                         shadow-[0_0_8px_rgba(234,179,8,0.6)]
                         [text-shadow:0_0_4px_rgba(234,179,8,0.7)]`;
                  break;
                case 'REJECTED':
                  base += `border border-red-500 text-red-400
                         shadow-[0_0_8px_rgba(239,68,68,0.6)]
                         [text-shadow:0_0_4px_rgba(239,68,68,0.7)]`;
                  break;
              }
            } else {
              // 비선택 상태
              base += 'bg-gray-800 text-gray-400 hover:bg-gray-700';
            }
            return (
              <button key={key} onClick={() => setFilter(key)} className={base}>
                {key === 'ALL'
                  ? '전체'
                  : key === 'PENDING'
                    ? '대기중'
                    : '반려됨'}
              </button>
            );
          })}
        </div>
      </div>

      {/* 신청 목록 테이블 */}
      <div className="overflow-x-auto bg-[#1E222D] rounded-lg shadow-lg">
        <table className="min-w-full text-white">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={
                    // 전체 선택 시 REJECTED 제외한 개수와 비교
                    selected.length > 0 &&
                    selected.length ===
                      // 전체 선택은 필터 적용 후의 리스트 중 REJECTED 제외
                      filteredApps.filter((a) => a.status !== 'REJECTED').length
                  }
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">유저ID (닉네임)</th>
              <th className="px-4 py-2 text-left">상태</th>
              <th className="px-4 py-2 text-left">신청일</th>
              <th className="px-4 py-2 text-left">처리일</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => (
              <tr
                key={app.applicationId}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(app.applicationId)}
                    onChange={() => toggleSelect(app.applicationId)}
                    disabled={app.status === 'REJECTED'}
                    className="
                             accent-blue-500                    /* 정상 시 파란 체크 */
                             disabled:accent-gray-500           /* disabled 시 회색 체크 */
                             disabled:opacity-50                /* 투명도 */
                             disabled:cursor-not-allowed        /* 금지 커서 */
                             disabled:grayscale                 /* 흑백 필터 */
                           "
                  />
                </td>
                <td className="px-4 py-2">{app.applicationId}</td>
                <td className="px-4 py-2 break-all">
                  {app.userId}{' '}
                  <span className="text-gray-400">({app.fullname})</span>
                </td>
                <td className="px-4 py-2">
                  {app.status === 'PENDING' && (
                    <span className="px-2 py-1 bg-yellow-600 rounded text-white">
                      대기중
                    </span>
                  )}
                  {app.status === 'APPROVED' && (
                    <span className="px-2 py-1 bg-green-600 rounded text-white">
                      승인됨
                    </span>
                  )}
                  {app.status === 'REJECTED' && (
                    <span className="px-2 py-1 bg-red-600 rounded text-white">
                      반려됨
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {new Date(app.appliedAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {app.processedAt
                    ? new Date(app.processedAt).toLocaleString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
