'use client';

import Link from 'next/link';
import type { Board } from '@/service/boards';

export function BoardList({ boards }: { boards: Board[] }) {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">게시판 목록</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {boards.map((b) => (
                    <Link
                        key={b.id}
                        href={`/boards/${b.id}/posts`}
                        className="block p-6 bg-gray-800 text-white rounded shadow hover:shadow-lg"
                    >
                        <h2 className="text-xl">{b.boardName}</h2>
                        <p className="text-sm mt-2">게시글 수: {b.postCount}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
