// src/components/posts/CreatePostForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/service/posts';
import type { CreatePostRequest } from '@/types/posts';

interface CreatePostFormProps {
  boardId: number;
}

export default function CreatePostForm({ boardId }: CreatePostFormProps) {
  const [postTitle, setPostTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAddImageField = () => {
    if (imageUrls.length < 5) setImageUrls([...imageUrls, '']);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleRemoveImageField = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!postTitle.trim()) {
      alert('제목을 입력해주세요');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요');
      return;
    }

    const filteredUrls = imageUrls.filter((url) => url.trim());
    setIsSubmitting(true);
    try {
      const payload: CreatePostRequest = {
        boardId,
        postTitle,
        content,
        imageUrls: filteredUrls,
      };
      await createPost(payload);
      router.push(`/boards/${boardId}/posts`);
    } catch (e: any) {
      alert(e.message || '게시물 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#131722] text-white p-8 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        {/* 상단 텍스트 액션 */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
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
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="w-full bg-transparent border-b border-gray-600 focus:outline-none pb-2 text-lg"
          />
        </div>

        {/* 내용 */}
        <div className="mb-4">
          <textarea
            placeholder="내용을 입력하세요"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent border-b border-gray-600 focus:outline-none pb-2 resize-none"
          />
        </div>

        {/* 이미지 URL 입력 */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="text-gray-400">이미지 URL (선택)</span>
            {imageUrls.length < 5 && (
              <button
                onClick={handleAddImageField}
                className="ml-2 text-gray-400 hover:text-white"
              >
                + 추가
              </button>
            )}
          </div>
          <div className="space-y-2">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="text"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                  className="flex-1 bg-transparent border-b border-gray-600 focus:outline-none pb-1"
                />
                <button
                  onClick={() => handleRemoveImageField(idx)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
