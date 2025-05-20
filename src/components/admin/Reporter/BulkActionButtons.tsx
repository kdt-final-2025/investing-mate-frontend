// File: src/components/admin/Reporter/BulkActionButtons.tsx
import React from 'react';

interface BulkActionButtonsProps {
  selectedCount: number;
  onApprove: () => void;
  onReject: () => void;
}

export default function BulkActionButtons({
  selectedCount,
  onApprove,
  onReject,
}: BulkActionButtonsProps) {
  return (
    <div className="flex space-x-3">
      <button
        onClick={onApprove}
        disabled={!selectedCount}
        className="px-4 py-2 border border-green-500 rounded text-green-400 disabled:opacity-50 transition shadow-[0_0_8px_rgba(16,185,129,0.6)] [text-shadow:0_0_4px_rgba(16,185,129,0.7)] hover:bg-green-500 hover:text-white"
      >
        선택 승인
      </button>
      <button
        onClick={onReject}
        disabled={!selectedCount}
        className="px-4 py-2 border border-red-500 rounded text-red-400 disabled:opacity-50 transition shadow-[0_0_8px_rgba(239,68,68,0.6)] [text-shadow:0_0_4px_rgba(239,68,68,0.7)] hover:bg-red-500 hover:text-white"
      >
        선택 반려
      </button>
    </div>
  );
}
