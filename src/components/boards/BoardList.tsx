'use client';
import Link from 'next/link';
import type { Board } from '@/service/boards';

export function BoardList({ boards }: { boards: Board[] }) {
  return (
    <div className="container mx-auto p-4 relative">
      {/* 제목 및 추가 버튼 영역 */}
      <div className="relative mb-6">
        <h1 className="text-2xl font-bold text-white">게시판 목록</h1>
        <Link href="/boards/new">
          <span className="absolute top-0 right-0 text-white text-3xl transition hover:text-gray-300 hover:drop-shadow-md cursor-pointer">
            +
          </span>
        </Link>
      </div>

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
