'use client';

import { useState } from 'react';
import { fetchPostListAndPaging } from '@/service/posts';
import { PostItemClient } from './PostItem';

// Post 타입 정의 (API 스펙과 일치)
type Post = {
  id: number;
  postTitle: string;
  userId: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
};

interface Props {
  initialPosts: Post[];
  boardId: string;
}

export function PostListClient({ initialPosts, boardId }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2); // 첫 페이지는 이미 불러왔으니 다음 페이지 번호로 초기화
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // 전체 응답에서 게시글 배열만 꺼내기
      const { postListResponse: newPosts } = await fetchPostListAndPaging(
        boardId,
        page
      );

      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('게시글을 불러오는데 실패했습니다', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        {posts.map((post) => (
          <PostItemClient key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-[#3b4754] hover:bg-[#4a5b68] rounded-lg text-white text-sm transition"
            disabled={isLoading}
          >
            {isLoading ? '로딩 중...' : '더 보기'}
          </button>
        </div>
      )}
    </div>
  );
}
