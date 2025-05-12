// src/components/posts/PostEditForm.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

export interface PostEditFormValues {
  postTitle: string;
  content: string;
}

interface PostEditFormProps {
  initialTitle: string;
  initialContent: string;
  onSubmit: (data: PostEditFormValues) => void | Promise<void>;
  onCancel: () => void;
}

export default function PostEditForm({
  initialTitle,
  initialContent,
  onSubmit,
  onCancel,
}: PostEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostEditFormValues>({
    defaultValues: { postTitle: initialTitle, content: initialContent },
  });

  return (
    <main className="min-h-screen w-full max-w-none bg-[#131722] text-white p-8">
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
            {...register('content', { required: '본문을 입력하세요.' })}
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
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm"
          >
            취소
          </button>
        </div>
      </form>
    </main>
  );
}
