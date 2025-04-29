'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { API_URL } from '@/env/constants';
import { LikeButton } from './LikeButton'; // 기존에 만든 LikeButton 컴포넌트

type LikedPost = {
  id: number;
  boardId: number;
  boardName: string;
  postTitle: string;
  userId: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
};

export function LikedPostList({ initialPosts }: { initialPosts: LikedPost[] }) {
  const [posts, setPosts] = useState<LikedPost[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/posts/liked?pageNumber=${page}&size=10`,
        {
          headers: { Authorization: 'Bearer your_token_here' },
          cache: 'no-store',
        }
      );
      const data = await res.json();

      if (data.items.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...data.items]);
        setPage((prev) => prev + 1);
      }
    } catch (e) {
      console.error('좋아요한 글 불러오기 실패', e);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMorePosts();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMorePosts, hasMore, loading]);

  const handleLikeToggle = (postId: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">좋아요한 글 목록</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
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
                postId={post.id}
                likedByMe={true}
                onUnlike={() => handleLikeToggle(post.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 스크롤 감지용 div */}
      <div ref={loaderRef} />

      {/* UX 디테일 */}
      {loading && (
        <div className="text-center text-sm text-gray-400 mt-4">
          글 불러오는 중...
        </div>
      )}
      {!hasMore && (
        <div className="text-center text-sm text-gray-500 mt-4">
          모든 글을 불러왔습니다.
        </div>
      )}
    </div>
  );
}
