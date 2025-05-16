// src/app/posts/new/page.tsx
import CreatePostForm from '@/components/posts/CreatePostForm';

interface NewPostPageProps {
  searchParams: { boardId: number };
}

export default function NewPostPage({ searchParams }: NewPostPageProps) {
  const boardId = searchParams.boardId;
  return <CreatePostForm boardId={boardId} />;
}
