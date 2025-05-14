// src/app/posts/liked/page.tsx
import React from 'react';
import PostLikeBackButton from '@/components/posts/PostLikeBackButton';
import LikedPostList from '@/components/posts/LikedPostList';

export default function LikedPostsPage() {
  return (
    <main className="min-h-screen w-full bg-[#131722] text-white p-8 flex flex-col">
      {/* 상단 헤더: 돌아가기 버튼 */}
      <div className="relative mb-6 h-12 flex items-center justify-center">
        <div className="absolute left-0">
          <PostLikeBackButton />
        </div>
        <h1 className="text-2xl font-bold">좋아요한 글 목록</h1>
      </div>

      <LikedPostList />
    </main>
  );
}
