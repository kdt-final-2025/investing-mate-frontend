// src/hooks/usePosts/useLikedPosts.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchLikedPosts } from '@/service/posts';
import type {
  PostsLikedAndPagingResponse,
  PostsLikedResponse,
} from '@/types/posts';

/**
 * 좋아요한 게시물 무한 스크롤 훅
 * @param pageSize 한 번에 불러올 개수 (기본값: 10)
 * @returns posts, loading, hasMore, loaderRef, removePost
 */
export function useLikedPosts(pageSize = 10) {
  const [posts, setPosts] = useState<PostsLikedResponse[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  /** 다음 페이지 데이터를 불러오는 함수 */
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { likedPostsResponse, pageInfo }: PostsLikedAndPagingResponse =
        await fetchLikedPosts(page, pageSize);

      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p.postId));
        const toAdd = likedPostsResponse.filter(
          (item) => !seen.has(item.postId)
        );
        return [...prev, ...toAdd];
      });

      setHasMore(pageInfo.pageNumber < pageInfo.totalPages);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error('좋아요 게시물 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageSize]);

  // 컴포넌트 마운트 시 첫 페이지 로드
  useEffect(() => {
    loadMore();
  }, [loadMore]);

  // IntersectionObserver로 무한 스크롤 감지
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) loadMore();
    });
    const el = loaderRef.current;
    if (el) obs.observe(el);
    return () => {
      if (el) obs.unobserve(el);
    };
  }, [loadMore]);

  // 특정 postId를 목록에서 제거하는 함수
  const removePost = useCallback((postId: number) => {
    setPosts((prev) => prev.filter((p) => p.postId !== postId));
  }, []);

  return { posts, loading, hasMore, loaderRef, removePost };
}
