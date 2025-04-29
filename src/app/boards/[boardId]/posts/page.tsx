import { fetchPosts } from '@/service/posts';
import { PostListClient } from '@/components/posts/PostList';

interface Props {
  searchParams: { boardId?: string };
}

export default async function PostsPage({ searchParams }: Props) {
  const boardId = searchParams.boardId || 'default'; // URL 파라미터에서 boardId 가져오기

  // 초기 게시글 데이터 서버에서 가져오기 (SSR)
  const initialPosts = await fetchPosts(boardId, 0);

  return (
    <div className="min-h-screen bg-[#131722] text-white">
      <PostListClient initialPosts={initialPosts} boardId={boardId} />
    </div>
  );
}
