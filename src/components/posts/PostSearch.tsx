'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

type SortBy = 'NEWEST' | 'MOST_LIKED';
type Direction = 'ASC' | 'DESC';

interface PostSearchProps {
  boardId: number;
  initialSearch?: string;
  initialSortBy?: SortBy;
  initialDirection?: Direction;
}

export function PostSearch({
  boardId,
  initialSearch = '',
  initialSortBy = 'NEWEST',
  initialDirection = 'DESC',
}: PostSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<SortBy>(initialSortBy);
  const [direction, setDirection] = useState<Direction>(initialDirection);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('boardId', String(boardId));
    params.set('page', '1');
    if (searchTerm) params.set('postTitle', searchTerm);
    params.set('sortBy', sortBy);
    params.set('direction', direction);

    router.push(`/boards/${boardId}/posts?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex items-center space-x-2">
      {/* 정렬 기준 */}
      <div className="relative group">
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as SortBy);
            e.currentTarget.blur();
          }}
          className="appearance-none text-left px-4 py-2 pr-8 rounded bg-[#1E222D] border border-[#3b4754] text-white w-32"
        >
          <option value="NEWEST">최신순</option>
          <option value="MOST_LIKED">좋아요순</option>
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 transition-transform group-focus-within:rotate-180 text-white"
        />
      </div>

      {/* 정렬 방향 */}
      <div className="relative group">
        <select
          value={direction}
          onChange={(e) => {
            setDirection(e.target.value as Direction);
            e.currentTarget.blur();
          }}
          className="appearance-none text-left px-4 py-2 pr-8 rounded bg-[#1E222D] border border-[#3b4754] text-white w-28"
        >
          <option value="DESC">내림차순</option>
          <option value="ASC">오름차순</option>
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 transition-transform group-focus-within:rotate-180 text-white"
        />
      </div>

      {/* 검색어 */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="제목 검색"
        className="flex-1 text-left px-4 py-2 rounded bg-[#1E222D] border border-[#3b4754] text-white"
      />

      {/* 검색 버튼 */}
      <button
        type="submit"
        className="px-4 py-2 bg-[#3b4754] hover:bg-[#4a5b68] rounded text-white"
      >
        🔎
      </button>
    </form>
  );
}
