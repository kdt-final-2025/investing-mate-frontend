// File: src/components/admin/Reporter/ActionBar.tsx
import React from 'react';
import BulkActionButtons from './BulkActionButtons';
import FilterToggle from './FilterToggle';

interface ActionBarProps {
  selectedCount: number;
  onApprove: () => void;
  onReject: () => void;
  filter: 'ALL' | 'PENDING' | 'REJECTED';
  setFilter: (key: 'ALL' | 'PENDING' | 'REJECTED') => void;
  toggleAll: () => void;
}

export default function ActionBar({
  selectedCount,
  onApprove,
  onReject,
  filter,
  setFilter,
}: ActionBarProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <BulkActionButtons
        selectedCount={selectedCount}
        onApprove={onApprove}
        onReject={onReject}
      />
      <FilterToggle filter={filter} setFilter={setFilter} />
    </div>
  );
}
