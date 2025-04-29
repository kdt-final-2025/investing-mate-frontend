import { PostList } from '@/components/posts/PostList';
import { fetchPosts } from '@/components/posts/post.service';

export const dynamic = 'force-dynamic';

export default async function BoardPostsPage({
  params,
}: {
  params: { boardId: string };
}) {
  const posts = await fetchPosts(params.boardId, 0); // 첫 페이지는 0

  return <PostList initialPosts={posts} boardId={params.boardId} />;
}
