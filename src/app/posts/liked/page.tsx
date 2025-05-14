// src/app/posts/liked/page.tsx
import LikedPostList from '@/components/posts/LikedPostList';

export default function LikedPostsPage() {
  return (
    <main className="min-h-screen w-full max-w-none bg-[#131722] text-white p-8 flex flex-col">
      <LikedPostList />
    </main>
  );
}
