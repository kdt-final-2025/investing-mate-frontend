// src/hooks/usePostList.ts
import { useState, useCallback } from 'react';
import { fetchPostList } from '@/service/posts';
import type { PostListResponse as Post, PageInfo as Page } from '@/types/posts';

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
        const { postListResponse, pageInfo: newPageInfo } = await fetchPostList(
          {
            boardId: parseInt(boardId, 10),
            pageNumber,
            size: pageInfo.size,
          }
        );
        setPosts(postListResponse);
        setPageInfo(newPageInfo);
      } catch (error) {
        console.error(error);
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
