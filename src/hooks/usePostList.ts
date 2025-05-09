// src/hooks/usePostList.ts
import { useState, useCallback } from 'react';
import { fetchPostListAndPaging, Post, Page } from '@/service/posts';

export function usePostList(
  boardId: string,
  initialPosts: Post[],
  initialPageInfo: Page
) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [pageInfo, setPageInfo] = useState<Page>(initialPageInfo);
  const [isLoading, setIsLoading] = useState(false);

  const goToPage = useCallback(
    async (pageNumber: number) => {
      if (isLoading || pageNumber === pageInfo.pageNumber) return;
      setIsLoading(true);
      try {
        const { postListResponse: newPosts, pageInfo: newPageInfo } =
          await fetchPostListAndPaging(boardId, pageNumber, pageInfo.size);
        setPosts(newPosts);
        setPageInfo(newPageInfo);
      } catch (e) {
        console.error('페이지 로드 실패', e);
      } finally {
        setIsLoading(false);
      }
    },
    [boardId, isLoading, pageInfo.pageNumber, pageInfo.size]
  );

  return {
    posts,
    pageInfo,
    isLoading,
    goToPage,
  };
}
