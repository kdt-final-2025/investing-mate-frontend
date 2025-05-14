// src/components/posts/LikedPostList.tsx
'use client';
import React from 'react';
import { useLikedPosts } from '@/hooks/usePosts/useLikedPosts';
import type { PostsLikedResponse } from '@/types/posts';
import LikeButton from '@/components/posts/LikeButton';

/**
 * 좋아요한 글 목록 컴포넌트
 * @param pageSize 한 번에 불러올 게시물 개수 (기본값: 10)
 */
export default function LikedPostList({ pageSize = 10 }: { pageSize?: number }) {
  const { posts, loading, hasMore, loaderRef, removePost } = useLikedPosts(pageSize);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">좋아요한 글 목록</h2>
      <div className="space-y-6">
        {posts.map((post: PostsLikedResponse) => (
          <div key={post.postId} className="bg-card p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold">{post.postTitle}</h3>
            <div className="mt-2 text-sm text-gray-500 flex space-x-4">
              <span>{post.boardName}</span>
              <span>{post.userId}</span>
              <span>조회수: {post.viewCount}</span>
              <span>댓글: {post.commentCount}</span>
              <span>좋아요: {post.likeCount}</span>
            </div>
            <div className="mt-3">
              <LikeButton
                postId={post.postId}
                initialLiked={post.likeCount > 0}
                initialCount={post.likeCount}
                onToggle={(liked: boolean) => {
                  if (!liked) removePost(post.postId);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 무한 스크롤 감지 요소 */}
      <div ref={loaderRef} style={{ height: '1px' }} />

      {loading && <div className="text-center my-4">로딩 중...</div>}
      {!hasMore && <div className="text-center my-4">모두 불러왔습니다.</div>}
    </div>
  );
}
