'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { PostResponse } from '@/types/posts';
import { updatePost, deletePost } from '@/service/posts';
import { MoreVertical } from 'lucide-react';
import { useClickOutside } from '@/hooks/useProfile/useClickOutside';
import LikeButton from '@/components/posts/LikeButton';
import { useIsAuthor } from '@/hooks/usePosts/useIsAuthor';
import PostEditForm, {
  PostEditFormValues,
} from '@/components/posts/PostEditForm';
import CommentList from '@/components/comments/CommentList';

interface Props {
  initialPost: PostResponse;
  postId: number;
}

export default function Post({ initialPost, postId }: Props) {
  const isAuthor = useIsAuthor(initialPost.userId);
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 외부 클릭 시 메뉴 닫기
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const onSubmit = async ({ postTitle, content }: PostEditFormValues) => {
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

  if (isEditing) {
    return (
      <PostEditForm
        initialTitle={initialPost.postTitle}
        initialContent={initialPost.content}
        onSubmit={onSubmit}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // 일반 보기 모드
  return (
    <main className="min-h-screen w-full max-w-none bg-[#131722] text-white p-8 flex flex-col">
      {/* 헤더 */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex space-x-2 text-sm text-gray-400">
          <span>{initialPost.userId}</span>
          <span>·</span>
          <span>{formattedDate}</span>
          <span>·</span>
          <span>조회 {initialPost.viewCount}</span>
        </div>

        {isAuthor && (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <MoreVertical size={20} />
            </button>
            {menuOpen && (
              <ul className="absolute right-0 mt-2 w-32 bg-[#2A2E39] rounded-md shadow-lg divide-y divide-gray-700 z-10">
                <li>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm"
                  >
                    수정
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 hover:bg-red-500/30 text-red-400 text-sm"
                  >
                    삭제
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </header>

      {/* 본문 */}
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

      {/* 푸터 */}
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
