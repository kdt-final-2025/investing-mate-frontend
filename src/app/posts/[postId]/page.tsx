// src/app/posts/[postId]/page.tsx
import PostDetailClient from '@/components/posts/PostDetailClient';
import { getPost } from '@/service/posts';


interface Props {
  params: Promise<{ postId: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { postId } = await params;
  const post = await getPost(Number(postId));

  return (
    <div className="min-h-screen bg-[#131722] text-white container mx-auto p-6">
      <div className="relative mb-6">
        <h1 className="text-3xl font-bold text-center">{post.postTitle}</h1>
      </div>
      <PostDetailClient postId={postId} initialPost={post} />
    </div>
  );
}