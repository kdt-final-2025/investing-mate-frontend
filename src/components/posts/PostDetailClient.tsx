// src/components/posts/PostDetailClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getSessionOrThrow } from '@/utils/auth';
import type { PostResponse } from '@/types/posts';
import { updatePost, deletePost, toggleLike } from '@/service/posts';

interface Props {
  initialPost: PostResponse;
  postId: string;
}

export default function PostDetailClient({ initialPost, postId }: Props) {
  const [liked, setLiked] = useState<boolean>(initialPost.likeCount > 0);
  const [likeCount, setLikeCount] = useState<number>(initialPost.likeCount);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [postTitle, setPostTitle] = useState(initialPost.postTitle);
  const [content, setContent] = useState(initialPost.content);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const supabase = createClient();
        const session = await getSessionOrThrow(supabase);
        if (session.user.id === initialPost.userId) {
          setIsAuthor(true);
        }
      } catch {
        setIsAuthor(false);
      }
    };
    fetchSession();
  }, [initialPost.userId]);

  const handleToggleLike = async () => {
    const { liked: newLiked, likeCount: newCount } = await toggleLike(
      Number(postId)
    );
    setLiked(newLiked);
    setLikeCount(newCount);
  };

  const handleEdit = async () => {
    await updatePost(Number(postId), {
      boardId: initialPost.boardId,
      postTitle,
      content,
      imageUrls: initialPost.imageUrls,
    });
    setIsEditing(false);
    router.refresh();
  };

  const handleDelete = async () => {
    await deletePost(Number(postId));
    router.push(`/boards/${initialPost.boardId}/posts`);
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <input
          type="text"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          className="w-full bg-[#2A2E39] p-2 rounded text-white"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-[#2A2E39] p-2 rounded min-h-[200px] text-white whitespace-pre-wrap"
        />
        <div className="flex space-x-4">
          <button
            onClick={handleEdit}
            className="px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
          >
            저장
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="space-y-6">
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleToggleLike}
          className="px-4 py-1 bg-[#2A2E39] hover:bg-[#363B47] rounded-lg text-sm"
        >
          {liked ? `좋아요 취소 (${likeCount})` : `좋아요 (${likeCount})`}
        </button>
        {isAuthor && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
            >
              삭제
            </button>
          </>
        )}
      </div>
      <div className="prose prose-invert">
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </article>
  );
}
