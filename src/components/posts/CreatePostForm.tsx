// src/components/posts/CreatePostForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import type { CreatePostRequest, PostResponse } from '@/types/posts';
import { usePostsImage } from '@/hooks/usePosts/usePostsImage';
import { ImageUpload } from '@/components/posts/ImageUpload';

interface FormValues {
  postTitle: string;
  content: string;
  imageUrls: { url: string }[];
}

export default function CreatePostForm({
  boardId,
  postId,
  initialData,
}: {
  boardId: number;
  postId?: number;
  initialData?: PostResponse;
}) {
  const router = useRouter();
  const isEdit = Boolean(postId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: initialData
      ? {
          postTitle: initialData.postTitle,
          content: initialData.content,
          imageUrls: initialData.imageUrls.map((u) => ({ url: u })),
        }
      : { postTitle: '', content: '', imageUrls: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'imageUrls',
  });
  const { handleCreatePost, handleUpdatePost } = usePostsImage(boardId);

  const onSubmit = async (data: FormValues) => {
    const payload: CreatePostRequest = {
      boardId,
      postTitle: data.postTitle,
      content: data.content,
      imageUrls: data.imageUrls.map((i) => i.url),
    };

    if (isEdit && postId) {
      await handleUpdatePost(postId, payload);
    } else {
      await handleCreatePost(payload);
    }

    router.push(`/boards/${boardId}/posts`);
  };

  return (
    <main className="min-h-screen bg-[#131722] text-white p-8 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 상단 액션 */}
          <div className="flex justify-between mb-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-indigo-400 hover:text-indigo-200 disabled:opacity-50"
            >
              {isSubmitting
                ? isEdit
                  ? '수정 중...'
                  : '작성 중...'
                : isEdit
                  ? '수정'
                  : '게시'}
            </button>
          </div>

          {/* 제목 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="제목을 입력하세요"
              {...register('postTitle', { required: '제목 입력 필요' })}
              className="w-full bg-transparent border-b border-gray-600 focus:outline-none pb-2 text-lg"
            />
            {errors.postTitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.postTitle.message}
              </p>
            )}
          </div>

          {/* 내용 */}
          <div className="mb-4">
            <textarea
              placeholder="내용을 입력하세요"
              rows={10}
              {...register('content', { required: '내용 입력 필요' })}
              className="w-full bg-transparent border-b border-gray-600 focus:outline-none pb-2 resize-none"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* 이미지 업로드 */}
          <ImageUpload
            boardId={boardId}
            fields={fields}
            append={append}
            remove={remove}
          />
        </form>
      </div>
    </main>
  );
}
