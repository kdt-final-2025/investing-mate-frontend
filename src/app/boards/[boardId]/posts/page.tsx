// src/app/boards/[boardId]/posts/page.tsx

import { PostList } from '@/components/posts/PostList';
import Link from 'next/link';
import { fetchPostList } from '@/service/posts';
import { PostSearch } from '@/components/posts/PostSearch';

interface PageProps {
  params: Promise<{ boardId: number }>;
  searchParams: Promise<{ page?: string; postTitle?: string }>;
}

export default async function BoardPostsPage({
  params,
  searchParams,
}: PageProps) {
  const { boardId: boardIdNumber } = await params;
  const { page, postTitle } = await searchParams;

  const boardIdNum = parseInt(String(boardIdNumber), 10);
  const currentPage = page ? parseInt(page, 10) : 1;

  const {
    boardName,
    postListResponse: posts,
    pageInfo,
  } = await fetchPostList({
    boardId: boardIdNum,
    pageNumber: currentPage,
    postTitle, // 여기에 검색어 전달
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

      {/* 검색 컴포넌트 */}
      <PostSearch boardId={boardIdNumber} initialSearch={postTitle} />

      {/* 좋아요한 게시물 (왼쪽) & 새 게시글 (오른쪽) 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/posts/liked">
          <button
            className="px-4 py-2 rounded-full text-sm text-pink-400 border-2 border-pink-400 bg-transparent
                       hover:bg-pink-400 hover:text-white transition-colors"
          >
            좋아요한 게시물
          </button>
        </Link>
        <Link href={`/posts/new?boardId=${boardIdNumber}`}>
          <button className="px-4 py-2 bg-[#3b4754] hover:bg-[#4a5b68] rounded-full text-white text-sm">
            + 새 게시글
          </button>
        </Link>
      </div>

      {/* 게시물 리스트 */}
      <PostList
        posts={posts}
        pageInfo={pageInfo}
        boardId={boardIdNumber}
        currentPage={currentPage}
      />
    </main>
  );
}
