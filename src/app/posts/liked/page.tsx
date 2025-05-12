// src/app/posts/liked/page.tsx
'use client';

import { LikedPostList } from '@/components/posts/LikedPostList';

export default function LikedPostsPage() {
  // 초기 데이터 없이 부트스트랩하고, LikedPostList 내부에서 첫 로드를 합니다.
  return <LikedPostList initialPosts={[]} />;
}
