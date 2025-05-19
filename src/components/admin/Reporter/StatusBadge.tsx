// File: src/components/admin/Reporter/StatusBadge.tsx
import React from 'react';
import { ApplicationResponse } from '@/hooks/useAdmin/useReporterApplications';

export default function StatusBadge({
  status,
}: {
  status: ApplicationResponse['status'];
}) {
  const variants = {
    PENDING: 'bg-yellow-600',
    APPROVED: 'bg-green-600',
    REJECTED: 'bg-red-600',
  } as const;

  const labels = {
    PENDING: '대기중',
    APPROVED: '승인됨',
    REJECTED: '반려됨',
  } as const;

  return (
    <span className={`px-2 py-1 ${variants[status]} rounded text-white`}>
      {labels[status]}
    </span>
  );
}
