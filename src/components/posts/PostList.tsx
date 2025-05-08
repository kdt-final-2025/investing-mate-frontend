// src/components/posts/PostList.tsx
'use client';

import { PostItemClient } from './PostItem';
import type { Post } from '@/service/posts';
import { usePostList } from '@/hooks/usePostList';

interface Props {
  initialPosts: Post[];
  boardId: string;
}

export function PostListClient({ initialPosts, boardId }: Props) {
  // 커스텀 훅으로 로직 분리, UI 디자인 유지
  const { posts, hasMore, isLoading, loadMore } = usePostList(
    boardId,
    initialPosts
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">게시글 목록</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostItemClient key={post.id} post={post} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-[#3b4754] hover:bg-[#4a5b68] rounded-lg text-white text-sm transition"
          >
            {isLoading ? '로딩 중...' : '더 보기'}
          </button>
        </div>
      )}
    </div>
  );
}
