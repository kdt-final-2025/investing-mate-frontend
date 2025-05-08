import Link from 'next/link';
import { fetchPostListAndPaging, Post } from '@/service/posts';
import { PostListClient } from '@/components/posts/PostList';

interface PageProps {
  params: Promise<{ boardId: string }>;
}

export default async function BoardPostsPage({ params }: PageProps) {
  const { boardId } = await params;
  const { boardName, postListResponse: initialPosts } =
    await fetchPostListAndPaging(boardId, 1);

  return (
    <main className="min-h-screen bg-[#131722] text-white p-8">
      {/* 제목과 버튼을 같은 컨테이너에서 상대 위치로 배치 */}
      <div className="relative mb-6">
        {/* 왼쪽 상단: 뒤로가기 링크 */}
        <div className="absolute left-0 top-0">
          <Link href="/boards">
            <span className="text-white hover:underline cursor-pointer">
              ← 게시판 목록
            </span>
          </Link>
        </div>
        {/* 가운데 제목 */}
        <h1 className="text-3xl font-bold text-center">{boardName}</h1>
      </div>

      {/* 게시글 목록 */}
      <PostListClient initialPosts={initialPosts} boardId={boardId} />
    </main>
  );
}
