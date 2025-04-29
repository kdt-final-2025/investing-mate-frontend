import { LikedPostList } from '@/components/posts/LikedPostList';
import { fetchLikedPosts } from '@/components/posts/post.service';

export const dynamic = 'force-dynamic';

export default async function LikedPostsPage() {
  const posts = await fetchLikedPosts(0);

  return <LikedPostList initialPosts={posts} />;
}
