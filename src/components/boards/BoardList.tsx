// src/components/boards/BoardList.tsx
'use client';
import Link from 'next/link';
import type { Board } from '@/service/boards';

export function BoardList({ boards }: { boards: Board[] }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">게시판 목록</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/boards/${board.id}`}
            className="group block p-6 bg-[#1E222D] rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-white group-hover:underline">
              {board.boardName}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              게시글 수: {board.postCount}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
