// src/components/posts/PostList.tsx

import type { PostListResponse as Post, PageInfo } from '@/types/posts';
import { PostItem } from './PostItem';
import { PostListPagination } from '@/components/posts/PostListPagination';

type SortBy = 'NEWEST' | 'MOST_LIKED';
type Direction = 'ASC' | 'DESC';

interface PostListProps {
  posts: Post[];
  pageInfo: PageInfo;
  boardId: number;
  currentPage: number;
  searchTerm?: string;
  sortBy?: SortBy;
  direction?: Direction;
}

export function PostList({
  posts,
  pageInfo,
  boardId,
  currentPage,
  searchTerm,
  sortBy,
  direction,
}: PostListProps) {
  return (
    <div>
      {/* 포스트 목록 */}
      {posts.map((p) => (
        <PostItem key={p.id} post={p} />
      ))}

      {/* 페이지네이션 */}
      <PostListPagination
        boardId={boardId}
        totalPages={pageInfo.totalPages}
        currentPage={currentPage}
        searchTerm={searchTerm}
        sortBy={sortBy}
        direction={direction}
      />
    </div>
  );
}
