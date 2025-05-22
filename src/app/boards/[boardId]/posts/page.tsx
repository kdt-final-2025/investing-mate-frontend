// src/app/boards/[boardId]/posts/page.tsx

import Link from 'next/link';
import { PostList } from '@/components/posts/PostList';
import { PostSearch } from '@/components/posts/PostSearch';
import { fetchPostList } from '@/service/posts';
import type { PostDto, PageInfo } from '@/types/posts';

type SortBy = 'NEWEST' | 'MOST_LIKED';
type Direction = 'ASC' | 'DESC';

interface PageProps {
  params: Promise<{ boardId: number }>;
  searchParams: Promise<{
    page?: string;
    postTitle?: string;
    sortBy?: SortBy;
    direction?: Direction;
  }>;
}

export default async function BoardPostsPage({
  params,
  searchParams,
}: PageProps) {
  const { boardId: boardIdNumber } = await params;
  const { page, postTitle, sortBy, direction } = await searchParams;

  const boardId = Number(boardIdNumber);
  const currentPage = page ? Number(page) : 1;

  const {
    boardName,
    postListResponse: posts,
    pageInfo,
  }: {
    boardName: string;
    postListResponse: PostDto[];
    pageInfo: PageInfo;
  } = await fetchPostList({
    boardId,
    pageNumber: currentPage,
    postTitle,
    sortBy,
    direction,
  });

  return (
    <main className="min-h-screen bg-[#131722] text-white p-8">
      {/* 뒤로 가기 & 게시판명 */}
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

      {/* 좋아요한 게시물 & 새 게시글 */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/posts/liked">
          <button className="px-4 py-2 rounded-full text-sm text-pink-400 border-2 border-pink-400 bg-transparent hover:bg-pink-400 hover:text-white transition-colors">
            좋아요한 게시물
          </button>
        </Link>
        <Link href={`/posts/new?boardId=${boardId}`}>
          <button className="px-4 py-2 bg-[#3b4754] hover:bg-[#4a5b68] rounded-full text-white text-sm">
            + 새 게시글
          </button>
        </Link>
      </div>

      {/* 게시물 리스트 */}
      <PostList
        posts={posts}
        pageInfo={pageInfo}
        boardId={boardId}
        currentPage={currentPage}
        searchTerm={postTitle}
        sortBy={sortBy}
        direction={direction}
      />

      {/* 검색 & 정렬 컨트롤 */}
      <PostSearch
        boardId={boardId}
        initialSearch={postTitle}
        initialSortBy={sortBy}
        initialDirection={direction}
      />
    </main>
  );
}
