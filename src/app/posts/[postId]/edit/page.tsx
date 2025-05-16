// src/app/posts/[postId]/edit/page.tsx
import CreatePostForm from '@/components/posts/CreatePostForm';
import { getPost } from '@/service/posts';

interface EditPostPageProps {
  params: { postId: number };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPost(params.postId);
  return (
    <CreatePostForm
      boardId={post.boardId}
      postId={post.id}
      initialData={post}
    />
  );
}
