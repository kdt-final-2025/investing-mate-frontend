// File: src/components/admin/ApplicationRow.tsx
import React from 'react';
import StatusBadge from './StatusBadge';
import { ApplicationResponse } from '@/hooks/useAdmin/useReporterApplications';

interface ApplicationRowProps {
  app: ApplicationResponse;
  isSelected: boolean;
  onToggle: () => void;
}

export default function ApplicationRow({
  app,
  isSelected,
  onToggle,
}: ApplicationRowProps) {
  return (
    <tr className="border-b border-gray-700 hover:bg-gray-800">
      <td className="px-4 py-2 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          disabled={app.status === 'REJECTED'}
          className="accent-blue-500 disabled:accent-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
        />
      </td>
      <td className="px-4 py-2">{app.applicationId}</td>
      <td className="px-4 py-2 break-all">
        {app.userId} <span className="text-gray-400">({app.fullname})</span>
      </td>
      <td className="px-4 py-2">
        <StatusBadge status={app.status} />
      </td>
      <td className="px-4 py-2">{new Date(app.appliedAt).toLocaleString()}</td>
      <td className="px-4 py-2">
        {app.processedAt ? new Date(app.processedAt).toLocaleString() : '-'}
      </td>
    </tr>
  );
}
