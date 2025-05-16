// src/app/posts/[postId]/page.tsx
import Link from 'next/link';
import Post from '@/components/posts/Post';
import { getPost } from '@/service/posts';

interface Props {
  params: Promise<{ postId: number }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { postId } = await params;
  const post = await getPost(postId);

  return (
    <main className="min-h-screen bg-[#131722] text-white p-8">
      <div className="relative mb-6 flex flex-col items-center">
        <div className="self-start">
          <Link href={`/boards/${post.boardId}/posts`}>
            <button className="px-4 py-2 bg-[#3b4754] hover:bg-[#4a5b68] rounded-full text-white text-sm">
              ← 게시물 목록
            </button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center mt-4">
          {post.postTitle}
        </h1>
      </div>
      <Post postId={postId} initialPost={post} />
    </main>
  );
}
