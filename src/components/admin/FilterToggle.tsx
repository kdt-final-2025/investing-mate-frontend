// File: src/components/admin/FilterToggle.tsx
import React from 'react';

type FilterKey = 'ALL' | 'PENDING' | 'REJECTED';

interface FilterToggleProps {
  filter: FilterKey;
  setFilter: (key: FilterKey) => void;
}

export default function FilterToggle({ filter, setFilter }: FilterToggleProps) {
  const keys: FilterKey[] = ['ALL', 'PENDING', 'REJECTED'];

  return (
    <div className="flex space-x-2">
      {keys.map((key) => {
        const isSel = filter === key;
        let base = 'px-4 py-2 rounded text-sm font-medium transition ';
        if (isSel) {
          switch (key) {
            case 'ALL':
              base +=
                'border border-white text-white shadow-[0_0_8px_rgba(255,255,255,0.6)] [text-shadow:0_0_4px_rgba(255,255,255,0.7)]';
              break;
            case 'PENDING':
              base +=
                'border border-yellow-500 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)] [text-shadow:0_0_4px_rgba(234,179,8,0.7)]';
              break;
            case 'REJECTED':
              base +=
                'border border-red-500 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)] [text-shadow:0_0_4px_rgba(239,68,68,0.7)]';
              break;
          }
        } else {
          base += 'bg-gray-800 text-gray-400 hover:bg-gray-700';
        }
        return (
          <button key={key} onClick={() => setFilter(key)} className={base}>
            {key === 'ALL' ? '전체' : key === 'PENDING' ? '대기중' : '반려됨'}
          </button>
        );
      })}
    </div>
  );
}
