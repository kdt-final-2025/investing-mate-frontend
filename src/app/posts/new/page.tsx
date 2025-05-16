// src/app/posts/new/page.tsx
import CreatePostForm from '@/components/posts/CreatePostForm';

interface NewPostPageProps {
  searchParams: { boardId: string };
}

export default function NewPostPage({ searchParams }: NewPostPageProps) {
  const boardId = Number(searchParams.boardId);
  return <CreatePostForm boardId={boardId} />;
}
