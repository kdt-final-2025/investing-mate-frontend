// src/components/posts/PostDetailClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getSessionOrThrow } from '@/utils/auth';
import type { PostResponse } from '@/types/posts';
import { updatePost, deletePost, toggleLike } from '@/service/posts';
import { MoreVertical, Heart } from 'lucide-react';
import { useClickOutside } from '@/hooks/useProfile/useClickOutside';
import { useForm } from 'react-hook-form';

interface Props {
  initialPost: PostResponse;
  postId: string;
}

interface FormValues {
  postTitle: string;
  content: string;
}

export default function PostDetailClient({ initialPost, postId }: Props) {
  const [liked, setLiked] = useState(initialPost.likeCount > 0);
  const [likeCount, setLikeCount] = useState(initialPost.likeCount);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      postTitle: initialPost.postTitle,
      content: initialPost.content,
    },
  });

  // 외부 클릭 시 팝업 닫기
  useClickOutside(menuRef, () => setMenuOpen(false));

  // 작성자 여부 확인
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const session = await getSessionOrThrow(supabase);
        if (session.user.id === initialPost.userId) {
          setIsAuthor(true);
        }
      } catch {
        setIsAuthor(false);
      }
    })();
  }, [initialPost.userId]);

  // 좋아요 토글
  const handleToggleLike = async () => {
    const { liked: newLiked, likeCount: newCount } = await toggleLike(
      Number(postId)
    );
    setLiked(newLiked);
    setLikeCount(newCount);
  };

  // 수정 저장 핸들러
  const onSubmit = async (data: FormValues) => {
    await updatePost(Number(postId), {
      boardId: initialPost.boardId,
      postTitle: data.postTitle,
      content: data.content,
      imageUrls: initialPost.imageUrls,
    });
    setIsEditing(false);
    router.refresh();
  };

  // 삭제
  const handleDelete = async () => {
    await deletePost(Number(postId));
    router.push(`/boards/${initialPost.boardId}/posts`);
  };

  // 날짜 포맷
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

  // **편집 모드**
  if (isEditing) {
    return (
      <main className="min-h-screen bg-[#131722] text-white p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('postTitle', {
                required: '제목을 입력하세요.',
                maxLength: { value: 70, message: '제목은 최대 70자입니다.' },
              })}
              placeholder="제목을 입력하세요"
              className="w-full bg-[#2A2E39] p-2 rounded text-white"
            />
            {errors.postTitle && (
              <p className="text-red-400 text-sm mt-1">
                {errors.postTitle.message}
              </p>
            )}
          </div>

          <div>
            <textarea
              {...register('content', {
                required: '본문을 입력하세요.',
              })}
              placeholder="본문을 입력하세요"
              className="w-full bg-[#2A2E39] p-2 rounded min-h-[200px] text-white whitespace-pre-wrap"
            />
            {errors.content && (
              <p className="text-red-400 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-sm"
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm"
            >
              취소
            </button>
          </div>
        </form>
      </main>
    );
  }

  // **일반 보기 모드**
  return (
    <main className="min-h-screen bg-[#131722] text-white p-8 flex flex-col">
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
        {/* 1) 글 */}
        <div className="prose prose-invert">
          <p className="whitespace-pre-wrap">{initialPost.content}</p>
        </div>

        {/* 2) 사진 (글 아래에) */}
        {initialPost.imageUrls.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {initialPost.imageUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`post-img-${i}`}
                className="w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </article>

      {/* 푸터 */}
      <footer className="flex justify-between items-center pt-4 border-t border-gray-700">
        {/* 좋아요 (좌측) */}
        <button
          onClick={handleToggleLike}
          className="flex items-center space-x-1 hover:text-red-400 transition text-sm"
        >
          <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
          <span>{likeCount}</span>
        </button>

        {/* 추가 버튼 그룹(우측) */}
        <div className="flex space-x-4 text-gray-400 text-sm">
          <button className="hover:text-white transition">댓글</button>
        </div>
      </footer>
    </main>
  );
}
