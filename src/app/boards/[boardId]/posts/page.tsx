import { fetchPosts } from '@/service/posts';
import { PostListClient } from '@/components/posts/PostList';

interface Props {
  searchParams: { boardId?: string };
}

export default async function PostsPage({ searchParams }: Props) {
  const boardId = searchParams.boardId || 'default';

  try {
    const initialPosts = await fetchPosts(boardId, 0);

    return (
      <div className="min-h-screen bg-[#131722] text-white">
        <PostListClient initialPosts={initialPosts} boardId={boardId} />
      </div>
    );
  } catch (error) {
    console.error('게시글 불러오기 실패:', error);
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        게시글을 불러올 수 없습니다.
      </div>
    );
  }
}
