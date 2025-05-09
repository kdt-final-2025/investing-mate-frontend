// src/components/posts/PostList.tsx
'use client';

import type { Post, Page } from '@/service/posts';
import { usePostList } from '@/hooks/usePostList';
import { PostItemClient } from '@/components/posts/PostItem';

interface Props {
  boardId: string;
  initialPosts: Post[];
  initialPageInfo: Page;
}

export function PostListClient({
  boardId,
  initialPosts,
  initialPageInfo,
}: Props) {
  const { posts, pageInfo, isLoading, goToPage } = usePostList(
    boardId,
    initialPosts,
    initialPageInfo
  );

  return (
    <div>
      {/* 게시물 리스트 */}
      {posts.map((p) => (
        <PostItemClient key={p.id} post={p} />
      ))}

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: pageInfo.totalPages }, (_, i) => i + 1).map(
          (num) => (
            <button
              key={num}
              onClick={() => goToPage(num)}
              disabled={isLoading || num === pageInfo.pageNumber}
              className={`px-4 py-2 rounded-lg text-white text-sm transition ${
                num === pageInfo.pageNumber
                  ? 'bg-[#4a5b68]'
                  : 'bg-[#3b4754] hover:bg-[#4a5b68]'
              }`}
            >
              {num}
            </button>
          )
        )}
      </div>
    </div>
  );
}
