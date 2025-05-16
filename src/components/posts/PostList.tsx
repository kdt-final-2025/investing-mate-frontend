// src/components/posts/PostList.tsx
import type { PostListResponse as Post, PageInfo } from '@/types/posts';
import { PostItem } from './PostItem';
import { PostListPagination  } from '@/components/posts/PostListPagination';

interface PostListProps {
  posts: Post[];
  pageInfo: PageInfo;
  boardId: number;
  currentPage: number;
}

export function PostList({ posts, pageInfo, boardId, currentPage }: PostListProps) {
  return (
    <div>
      {/* 포스트 목록 */}
      {posts.map(p => <PostItem key={p.id} post={p} />)}

      {/* 분리된 PostListPagination 사용 */}
      <PostListPagination
        boardId={boardId}
        totalPages={pageInfo.totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
