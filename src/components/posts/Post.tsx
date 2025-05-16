// src/components/posts/Post.tsx
'use client';

import { useRouter } from 'next/navigation';
import type { PostResponse } from '@/types/posts';
import { deletePost } from '@/service/posts';
import LikeButton from '@/components/posts/LikeButton';
import { useIsAuthor } from '@/hooks/usePosts/useIsAuthor';

interface PostProps {
  initialPost: PostResponse;
  postId: number;
}

export default function Post({ initialPost, postId }: PostProps) {
  const isAuthor = useIsAuthor(initialPost.userId);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/posts/${postId}/edit`);
  };

  const handleDelete = async () => {
    await deletePost(Number(postId));
    router.push(`/boards/${initialPost.boardId}/posts`);
  };

  const formattedDate = new Date(initialPost.createdAt).toLocaleString(
    'ko-KR',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <main className="min-h-screen w-full max-w-none bg-[#131722] text-white p-8 flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <div className="flex space-x-2 text-sm text-gray-400">
          <span>{initialPost.userId}</span>
          <span>·</span>
          <span>{formattedDate}</span>
          <span>·</span>
          <span>조회 {initialPost.viewCount}</span>
        </div>
        {isAuthor && (
          <div className="relative flex space-x-2">
            <button
              onClick={handleEdit}
              className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-2 py-1 bg-red-600 rounded hover:bg-red-500 text-sm"
            >
              삭제
            </button>
          </div>
        )}
      </header>

      <article className="flex-1 mb-8 space-y-4">
        <div className="prose prose-invert">
          <p className="whitespace-pre-wrap">{initialPost.content}</p>
        </div>
        {initialPost.imageUrls.length > 0 && (
          <div className="flex flex-col space-y-4 items-center">
            {initialPost.imageUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`post-img-${i}`}
                className="max-w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </article>

      <footer className="flex justify-between items-center pt-4 border-t border-gray-700">
        <LikeButton
          postId={Number(postId)}
          initialLiked={initialPost.likeCount > 0}
          initialCount={initialPost.likeCount}
        />
        <div className="flex space-x-4 text-gray-400 text-sm">
          <button className="hover:text-white transition">댓글</button>
        </div>
      </footer>
    </main>
  );
}
