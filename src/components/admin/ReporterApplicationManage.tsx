// Updated File: src/components/admin/ReporterApplicationManage.tsx
'use client';

import React from 'react';
import LoadingWrapper from '@/components/LoadingWrapper';
import { useUserRole } from '@/hooks/useProfile/useUserRole';
import { useReporterApplications } from '@/hooks/useAdmin/useReporterApplications';
import ReporterAppHeader from './ReporterAppHeader';
import ActionBar from './ActionBar';
import ApplicationsTable from './ApplicationsTable';

export default function ReporterApplicationManage() {
  const {
    selected,
    filter,
    setFilter,
    toggleSelect,
    toggleAll,
    processApps,
    filteredApps,
  } = useReporterApplications();
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
    <div className="p-6 bg-[#12121A] min-h-screen">
      <ReporterAppHeader />
      <ActionBar
        selectedCount={selected.length}
        onApprove={() => processApps('APPROVED')}
        onReject={() => processApps('REJECTED')}
        filter={filter}
        setFilter={setFilter}
        toggleAll={toggleAll}
      />
      <ApplicationsTable
        filteredApps={filteredApps}
        selected={selected}
        toggleSelect={toggleSelect}
      />
    </div>
  );
}
