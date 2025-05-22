// src/components/posts/PostLikePagination.tsx
import React from 'react';

interface PostLikePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function PostLikePagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PostLikePaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center space-x-2 mt-6 mb-6">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage || isLoading}
          className={`px-3 py-1 rounded-lg transition-colors border ${
            page === currentPage
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-[#2A2F3A] text-white border-[#2A2F3A] hover:bg-[#384050] hover:border-[#384050]'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        > 
          {page}
        </button>
      ))}
    </div>
  );
}
