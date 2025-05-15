// src/app/posts/new/page.tsx
import CreatePostForm from '@/components/posts/CreatePostForm';
import { getPost } from '@/service/posts';
import type { PostResponse } from '@/types/posts';

interface NewPostPageProps {
  searchParams: Promise<{ boardId?: string; postId?: string }>;
}

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const { boardId, postId } = await searchParams;
  const boardIdNum = boardId ? Number(boardId) : undefined;

  if (!boardIdNum) {
    return <p>잘못된 접근입니다. boardId가 없습니다.</p>;
  }

  let initialData: PostResponse | undefined;
  if (postId) {
    try {
      initialData = await getPost(Number(postId));
    } catch {
      return <p>게시물을 불러오는 데 실패했습니다.</p>;
    }
  }

  return (
    <CreatePostForm
      boardId={boardIdNum}
      postId={postId ? Number(postId) : undefined}
      initialData={initialData}
    />
  );
}
