'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchLikedPosts } from '@/service/posts';
import LikeButton from '@/components/posts/LikeButton';

// PostsLikedResponse와 동일한 타입
interface LikedPost {
  postId: number;
  boardId: number;
  boardName: string;
  postTitle: string;
  userId: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
}

interface LikedPostListProps {
  /** 서버에서 미리 불러온 첫 페이지 데이터 (없으면 빈 배열) */
  initialPosts: LikedPost[];
  /** 한 페이지당 불러올 개수 (기본 10) */
  pageSize?: number;
}

export function LikedPostList({
  initialPosts,
  pageSize = 10,
}: LikedPostListProps) {
  const [posts, setPosts] = useState<LikedPost[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      // API에서 페이지 정보 포함된 응답 받기
      const { likedPostsResponse: items, pageInfo } = await fetchLikedPosts(
        page,
        pageSize
      );

      if (items.length > 0) {
        // 중복 없이 새 항목만 추가
        setPosts((prev) => {
          const existing = new Set(prev.map((p) => p.postId));
          const newItems = items.filter((item) => !existing.has(item.postId));
          return [...prev, ...newItems];
        });

        // 마지막 페이지라면 추가 로드 중지
        if (
          pageInfo.pageNumber >= pageInfo.totalPages ||
          items.length < pageSize
        ) {
          setHasMore(false);
        } else {
          setPage((prev) => prev + 1);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('좋아요한 글 불러오기 실패', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, pageSize]);

  // 무한 스크롤 관찰
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMorePosts();
      }
    });
    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) obs.unobserve(loaderRef.current);
    };
  }, [loadMorePosts, hasMore, loading]);

  const handleUnlike = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.postId !== postId));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">좋아요한 글 목록</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.postId}
            className="bg-[#1E222D] p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-white">
              {post.postTitle}
            </h3>
            <div className="mt-1 text-sm text-gray-400 flex space-x-4">
              <span>{post.boardName}</span>
              <span>{post.userId}</span>
              <span>조회수: {post.viewCount}</span>
              <span>댓글: {post.commentCount}</span>
              <span>좋아요: {post.likeCount}</span>
            </div>
            <div className="mt-2">
              <LikeButton
                postId={post.postId}
                initialLiked={post.likeCount > 0}
                initialCount={post.likeCount}
                onToggle={(liked) => {
                  if (!liked) handleUnlike(post.postId);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 스크롤 감지용 영역 */}
      <div ref={loaderRef} />

      {loading && (
        <div className="text-center text-sm text-gray-400 mt-4">로딩 중...</div>
      )}
      {!hasMore && (
        <div className="text-center text-sm text-gray-500 mt-4">
          모든 글을 불러왔습니다.
        </div>
      )}
    </div>
  );
}
