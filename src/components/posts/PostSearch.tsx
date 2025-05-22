'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PostSearchProps {
  boardId: number;
  initialSearch?: string;
}

export function PostSearch({ boardId, initialSearch = '' }: PostSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('boardId', boardId.toString());
    if (searchTerm) {
      params.set('postTitle', searchTerm);
    }
    // 페이지 번호 초기화
    params.set('page', '1');

    router.push(`/boards/${boardId}/posts?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="게시글 제목 검색"
        className="flex-1 px-4 py-2 rounded-l-lg bg-[#1E222D] border border-[#3b4754] text-white placeholder-gray-400 focus:outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-[#3b4754] hover:bg-[#4a5b68] rounded-r-lg text-white text-sm"
      >
        검색
      </button>
    </form>
  );
}
