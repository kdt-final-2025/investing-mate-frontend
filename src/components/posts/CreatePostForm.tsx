// src/components/posts/CreatePostForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { createPost } from '@/service/posts';
import type { CreatePostRequest } from '@/types/posts';

interface CreatePostFormProps {
  boardId: number;
}

// Form input 타입 정의
interface FormValues {
  postTitle: string;
  content: string;
  imageUrls: { url: string }[];
}

export default function CreatePostForm({ boardId }: CreatePostFormProps) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      postTitle: '',
      content: '',
      imageUrls: [{ url: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'imageUrls',
  });

  const onSubmit = async (data: FormValues) => {
    const filteredUrls = data.imageUrls
      .map((item) => item.url.trim())
      .filter((url) => url);
    const payload: CreatePostRequest = {
      boardId,
      postTitle: data.postTitle,
      content: data.content,
      imageUrls: filteredUrls,
    };

    try {
      await createPost(payload);
      router.push(`/boards/${boardId}/posts`);
    } catch (error: any) {
      alert(error.message || '게시물 생성 중 오류가 발생했습니다.');
    }
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
              {isSubmitting ? '작성 중...' : '게시'}
            </button>
          </div>

          {/* 제목 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="제목을 입력하세요"
              {...register('postTitle', { required: '제목을 입력해주세요' })}
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
              {...register('content', { required: '내용을 입력해주세요' })}
              className="w-full bg-transparent border-b border-gray-600 focus:outline-none pb-2 resize-none"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* 이미지 URL 입력 */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="text-gray-400">이미지 URL (선택)</span>
              {fields.length < 5 && (
                <button
                  type="button"
                  onClick={() => append({ url: '' })}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  + 추가
                </button>
              )}
            </div>
            <div className="space-y-2">
              {fields.map((field, idx) => (
                <div key={field.id} className="flex items-center">
                  <input
                    type="text"
                    placeholder="https://..."
                    {...register(`imageUrls.${idx}.url` as const)}
                    className="flex-1 bg-transparent border-b border-gray-600 focus:outline-none pb-1"
                  />
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
