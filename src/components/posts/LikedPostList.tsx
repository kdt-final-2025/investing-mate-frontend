// src/components/posts/LikedPostList.tsx
'use client';
import React, { useEffect } from 'react';
import { useLikedPosts } from '@/hooks/usePosts/useLikedPosts';
import type { PostsLikedResponse } from '@/types/posts';
import LikeButton from '@/components/posts/LikeButton';
import { PostItem } from '@/components/posts/PostItem';
import { PostLikePagination } from '@/components/posts/PostLikePagination';

interface LikedPostListProps {
  // 페이지당 불러올 개수
  pageSize?: number;
}

export default function LikedPostList({ pageSize = 10 }: LikedPostListProps) {
  const { posts, loading, currentPage, totalPages, loadPage } =
    useLikedPosts(pageSize);

  // 초기 로드
  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-6">
        {posts.map((post: PostsLikedResponse) => (
          <div key={post.postId} className="bg-[#1E222D] p-4 rounded-xl shadow">
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
            <div className="mt-4 pl-4 flex items-center">
              <LikeButton
                postId={post.postId}
                initialLiked={post.likeCount > 0}
                initialCount={post.likeCount}
                onToggle={(liked) => {
                  // 페이지네이션 방식이므로 언라이크 시 현재 페이지 재조회
                  loadPage(currentPage);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 페이지 네비게이션 */}
      <PostLikePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={loadPage}
        isLoading={loading}
      />
    </div>
  );
}
