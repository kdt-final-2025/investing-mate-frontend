import Link from 'next/link';
import { fetchPosts, Post } from '@/service/posts';
import { PostListClient } from '@/components/posts/PostList';

interface PageProps {
  params: Promise<{ boardId: string }>;
}

export default async function BoardPostsPage({ params }: PageProps) {
  // 1) params를 await 해서 boardId를 꺼내고
  const { boardId } = await params;

  // 2) 그 boardId로 최초 1페이지만 미리 받아오기
  const initialPosts: Post[] = await fetchPosts(boardId, 1);

  return (
    <main className="min-h-screen bg-[#131722] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">게시판 {boardId}의 게시글</h1>

      {/* 3) PostListClient에 initialPosts를 반드시 넘겨야 합니다. */}
      <PostListClient initialPosts={initialPosts} boardId={boardId} />

      <div className="mt-6">
        <Link href="/boards">
          <button className="px-4 py-2 bg-[#3b4754] rounded hover:bg-[#4a5b68]">
            ← 게시판 목록으로
          </button>
        </Link>
      </div>
    </main>
  );
}
