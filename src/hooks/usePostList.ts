// src/hooks/usePostList.ts
import { useState, useCallback } from 'react';
import { fetchPostListAndPaging, Post } from '@/service/posts';

export function usePostList(boardId: string, initial: Post[]) {
  const [posts, setPosts] = useState<Post[]>(initial);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const { postListResponse: newPosts } = await fetchPostListAndPaging(
        boardId,
        page
      );
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      }
    } catch (e) {
      console.error('더 불러오기 실패', e);
    } finally {
      setIsLoading(false);
    }
  }, [boardId, page, isLoading, hasMore]);

  return { posts, hasMore, isLoading, loadMore };
}
