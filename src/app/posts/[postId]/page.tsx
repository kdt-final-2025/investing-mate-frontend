// src/app/posts/[postId]/page.tsx
import Link from 'next/link';
import Post from '@/components/posts/Post';
import { getPost } from '@/service/posts';
import CommentList from '@/components/comments/CommentList';
import { commentList } from '@/service/comments';

interface Props {
  params: Promise<{ postId: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { postId } = await params;
  const post = await getPost(Number(postId));
  const commentData = await commentList(postId, 'TIME', 10, 1);
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
      {/* 댓글 섹션 */}
      <section className="mt-8 pt-6 border-t border-gray-700">
        <h2 className="text-xl font-semibold mb-4">댓글</h2>
        <CommentList
          userId={post.userId}
          postId={Number(postId)}
          sortType="TIME" // 최신순으로 정렬
          size={10} // 한 페이지에 표시할 댓글 수
          pageNumber={1} // 시작 페이지
        />
      </section>
    </main>
  );
}
