import Link from 'next/link';
import type { PostListResponse as Post, PageInfo } from '@/types/posts';
import { PostItemClient } from './PostItem';
import { Pagination } from '@/components/posts/PostListPagination';

interface Props {
  posts: Post[];
  pageInfo: PageInfo;
  boardId: string;
  currentPage: number;
}

export function PostList({ posts, pageInfo, boardId, currentPage }: Props) {
  return (
    <div>
      {/* 포스트 목록 */}
      {posts.map(p => <PostItemClient key={p.id} post={p} />)}

      {/* 분리된 Pagination 사용 */}
      <Pagination
        boardId={boardId}
        totalPages={pageInfo.totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
