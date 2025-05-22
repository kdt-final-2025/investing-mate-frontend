// src/app/posts/new/page.tsx
import CreatePostForm from '@/components/posts/CreatePostForm';

interface NewPostPageProps {
  searchParams: Promise<{ boardId: number }>;
}

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const { boardId } = await searchParams;

  if (!boardId) {
    throw new Error('잘못된 접근입니다: boardId가 없습니다.');
  }

  const boardIdNum = Number(boardId);
  return <CreatePostForm boardId={boardIdNum} />;
}
