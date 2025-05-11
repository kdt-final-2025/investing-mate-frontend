// src/app/posts/new/page.tsx
import CreatePostForm from '@/components/posts/CreatePostForm';

interface NewPostPageProps {
  searchParams: Promise<{ boardId?: string }>;
}

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const { boardId } = await searchParams;
  const boardIdNum = boardId ? Number(boardId) : undefined;

  if (!boardIdNum) {
    return <p>잘못된 접근입니다. boardId가 없습니다.</p>;
  }

  return <CreatePostForm boardId={boardIdNum} />;
}
