// File: src/components/admin/ApplicationsTable.tsx
import React from 'react';
import ApplicationRow from './ApplicationRow';
import { ApplicationResponse } from '@/hooks/useAdmin/useReporterApplications';

interface ApplicationsTableProps {
  filteredApps: ApplicationResponse[];
  selected: number[];
  toggleSelect: (id: number) => void;
}

export default function ApplicationsTable({
  filteredApps,
  selected,
  toggleSelect,
}: ApplicationsTableProps) {
  return (
    <div className="overflow-x-auto bg-[#1E222D] rounded-lg shadow-lg">
      <table className="min-w-full text-white">
        <thead className="border-b border-gray-700">
          <tr>
            <th className="px-4 py-2 text-center">
              {/* 전체 선택은 ActionBar에서 처리 */}
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
            <ApplicationRow
              key={app.applicationId}
              app={app}
              isSelected={selected.includes(app.applicationId)}
              onToggle={() => toggleSelect(app.applicationId)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
