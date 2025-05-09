// src/app/boards/[boardId]/posts/page.tsx
import Link from 'next/link';

import { PostListClient } from '@/components/posts/PostList';
import { fetchPostList } from '@/service/posts';

interface PageProps {
  params: Promise<{ boardId: string }>;
}

export default async function BoardPostsPage({ params }: PageProps) {
  const { boardId } = await params;
  const {
    boardName,
    postListResponse: initialPosts,
    pageInfo: initialPageInfo,
  } = await fetchPostList({
    boardId: parseInt(boardId, 10),
    pageNumber: 1,
  });

  return (
    <main className="min-h-screen bg-[#131722] text-white p-8">
      <div className="relative mb-6">
        <div className="absolute left-0 top-0">
          <Link href="/boards">
            <span className="text-white hover:underline cursor-pointer">
              ← 게시판 목록
            </span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center">{boardName}</h1>
      </div>

      <PostListClient
        initialPosts={initialPosts}
        initialPageInfo={initialPageInfo}
        boardId={boardId}
      />
    </main>
  );
}
