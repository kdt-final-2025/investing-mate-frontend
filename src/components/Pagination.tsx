// src/components/Pagination.tsx
'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({
                                     currentPage,
                                     totalPages,
                                     onChange,
                                   }: PaginationProps) {
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const goPrev = () => canPrev && onChange(currentPage - 1);
  const goNext = () => canNext && onChange(currentPage + 1);

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onChange(1)}
        disabled={!canPrev}
        className="px-2 py-1 rounded disabled:opacity-50"
      >
        « First
      </button>
      <button
        onClick={goPrev}
        disabled={!canPrev}
        className="px-2 py-1 rounded disabled:opacity-50"
      >
        ‹ Prev
      </button>

      <span className="px-3">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={goNext}
        disabled={!canNext}
        className="px-2 py-1 rounded disabled:opacity-50"
      >
        Next ›
      </button>
      <button
        onClick={() => onChange(totalPages)}
        disabled={!canNext}
        className="px-2 py-1 rounded disabled:opacity-50"
      >
        Last »
      </button>
    </div>
  );
}
