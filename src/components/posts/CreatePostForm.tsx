// src/components/posts/CreatePostForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';

import type { CreatePostRequest, PostResponse } from '@/types/posts';
import { usePosts } from '@/hooks/usePosts/usePosts';

interface CreatePostFormProps {
  boardId: number;
  postId?: number;
  initialData?: PostResponse;
}

interface FormValues {
  postTitle: string;
  content: string;
  imageUrls: { url: string }[];
}

export default function CreatePostForm({
  boardId,
  postId,
  initialData,
}: CreatePostFormProps) {
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
  const {
    uploading,
    error: uploadError,
    handleImageUpload,
    handleCreatePost,
    handleUpdatePost,
  } = usePosts(boardId);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      try {
        const url = await handleImageUpload(file);
        append({ url });
      } catch {}
    }
  };

  const onSubmit = async (data: FormValues) => {
    const urls = data.imageUrls.map((i) => i.url);
    const payload: CreatePostRequest = {
      boardId,
      postTitle: data.postTitle,
      content: data.content,
      imageUrls: urls,
    };
    if (isEdit && postId) await handleUpdatePost(postId, payload);
    else await handleCreatePost(payload);
    router.push(`/boards/${boardId}/posts`);
  };

  return (
    <main className="min-h-screen bg-[#131722] text-white p-8 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
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

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="text-gray-400">이미지 업로드</span>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="ml-4 text-gray-400"
              />
            </div>
            {uploading && <p className="text-yellow-300 mt-2">업로드 중...</p>}
            {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {fields.map((f, i) => (
              <div key={f.id} className="relative">
                <img
                  src={f.url}
                  alt={`img-${i}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-0 right-0 bg-red-600 rounded-full p-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </form>
      </div>
    </main>
  );
}
