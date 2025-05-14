// src/components/posts/LikedPostList.tsx
'use client';
import React from 'react';
import { useLikedPosts } from '@/hooks/usePosts/useLikedPosts';
import type { PostsLikedResponse } from '@/types/posts';
import LikeButton from '@/components/posts/LikeButton';
import { PostItem } from '@/components/posts/PostItem';

interface LikedPostListProps {
  /** 페이지당 불러올 게시물 개수 */
  pageSize?: number;
}

export default function LikedPostList({ pageSize = 10 }: LikedPostListProps) {
  const { posts, loading, hasMore, loaderRef, removePost } =
    useLikedPosts(pageSize);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">좋아요한 글 목록</h2>
      <div className="space-y-6">
        {posts.map((post: PostsLikedResponse) => (
          <div key={post.postId} className="bg-[#1E222D] p-4 rounded-xl shadow">
            {/* 포스트 아이템 재사용 */}
            <PostItem
              post={{
                id: post.postId,
                postTitle: post.postTitle,
                userId: post.userId,
                viewCount: post.viewCount,
                commentCount: post.commentCount,
                likeCount: post.likeCount,
              }}
            />

            {/* 좋아요 버튼 왼쪽 정렬 - 카드 안쪽 왼쪽 여백만 적용 */}
            <div className="mt-4 pl-4">
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
