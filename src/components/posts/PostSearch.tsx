'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PostSearchProps {
  boardId: number;
  initialSearch?: string;
  initialDirection?: 'DESC' | 'ASC';
}

export function PostSearch({
  boardId,
  initialSearch = '',
  initialDirection = 'DESC',
}: PostSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [direction, setDirection] = useState(initialDirection);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('boardId', boardId.toString());
    params.set('page', '1');
    if (searchTerm) params.set('postTitle', searchTerm);
    params.set('direction', direction);

    router.push(`/boards/${boardId}/posts?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex items-center space-x-2">
      <select
        value={direction}
        onChange={(e) => setDirection(e.target.value as any)}
        className="px-3 py-2 rounded bg-[#1E222D] border border-[#3b4754] text-white"
      >
        <option value="DESC">내림차순</option>
        <option value="ASC">오름차순</option>
      </select>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="제목 검색"
        className="flex-1 px-4 py-2 rounded bg-[#1E222D] border border-[#3b4754] text-white"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-[#3b4754] hover:bg-[#4a5b68] rounded text-white"
      >
        검색
      </button>
    </form>
  );
}
