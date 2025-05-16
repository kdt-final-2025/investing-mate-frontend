// src/hooks/usePosts/useLikedPosts.ts
import { useState, useCallback } from 'react';
import { fetchLikedPosts } from '@/service/posts';
import type {
  PostsLikedResponse,
  PostsLikedAndPagingResponse,
} from '@/types/posts';

 // 좋아요한 게시물 페이지네이션 훅
 // @param pageSize 페이지당 불러올 개수 (기본값: 10)
 // @returns posts, loading, currentPage, totalPages, loadPage

export function useLikedPosts(pageSize = 10) {
  const [posts, setPosts] = useState<PostsLikedResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 특정 페이지 로드
  const loadPage = useCallback(
    async (pageNum: number) => {
      setLoading(true);
      try {
        const { likedPostsResponse, pageInfo }: PostsLikedAndPagingResponse =
          await fetchLikedPosts(pageNum, pageSize);

        setPosts(likedPostsResponse);
        setCurrentPage(pageNum);
        // totalElements 기반으로 전체 페이지 수 계산
        const total = pageInfo.totalElements ?? likedPostsResponse.length;
        const size = pageInfo.size || pageSize;
        setTotalPages(Math.max(1, Math.ceil(total / size)));
      } catch (error) {
        console.error('좋아요 게시물 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  return { posts, loading, currentPage, totalPages, loadPage };
}
