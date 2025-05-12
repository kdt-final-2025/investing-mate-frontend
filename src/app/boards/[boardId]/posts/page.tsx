// src/app/boards/[boardId]/posts/page.tsx

import { PostList } from '@/components/posts/PostList';
import Link from 'next/link';
import { fetchPostList } from '@/service/posts';

interface PageProps {
  params: Promise<{ boardId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function BoardPostsPage({
  params,
  searchParams,
}: PageProps) {
  const { boardId: boardIdString } = await params;
  const { page } = await searchParams;

  const boardIdNum = parseInt(boardIdString, 10);
  const currentPage = page ? parseInt(page, 10) : 1;

  const {
    boardName,
    postListResponse: posts,
    pageInfo,
  } = await fetchPostList({
    boardId: boardIdNum,
    pageNumber: currentPage,
  });

  return (
    <main className="min-h-screen bg-[#131722] text-white p-8">
      {/* 상단: 뒤로 가기 버튼 & 게시판명 */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0">
          <Link href="/boards">
            <button className="px-4 py-2 bg-[#3b4754] hover:bg-[#4a5b68] rounded-full text-white text-sm">
              ← 게시판 목록
            </button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center">{boardName}</h1>
      </div>

      {/* 좋아요한 게시물 (왼쪽) & 새 게시글 (오른쪽) 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/posts/liked">
          <button className="px-4 py-2 bg-[#3b4754] hover:bg-[#4a5b68] rounded-full text-white text-sm">
            좋아요한 게시물
          </button>
        </Link>
        <Link href={`/posts/new?boardId=${boardIdString}`}>
          <button className="px-4 py-2 bg-[#3b4754] hover:bg-[#4a5b68] rounded-full text-white text-sm">
            + 새 게시글
          </button>
        </Link>
      </div>

      {/* 게시물 리스트 */}
      <PostList
        posts={posts}
        pageInfo={pageInfo}
        boardId={boardIdString}
        currentPage={currentPage}
      />
    </main>
  );
}
