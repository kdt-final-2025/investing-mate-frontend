// src/app/boards/[boardId]/posts/page.tsx

import { PostList } from '@/components/posts/PostList';
export const dynamic = 'force-dynamic'; // 쿼리 변경 시 서버 사이드에서 다시 렌더링
import Link from 'next/link';
import { fetchPostList } from '@/service/posts';

interface PageProps {
  params: { boardId: string };
  searchParams: { page?: string };
}

export default async function BoardPostsPage({
  params,
  searchParams,
}: PageProps) {
  const boardIdNum = parseInt(params.boardId, 10);
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;

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
      <div className="relative mb-6">
        <div className="absolute left-0 top-0">
          <Link href="/boards">
            <span className="text-white hover:underline cursor-pointer">
              ← 게시판 목록
            </span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center mb-6">{boardName}</h1>
      </div>

      <PostList
        posts={posts}
        pageInfo={pageInfo}
        boardId={params.boardId}
        currentPage={currentPage}
      />
    </main>
  );
}
