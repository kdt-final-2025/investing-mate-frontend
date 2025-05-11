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
  const [isSubmitting] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    const payload: CreatePostRequest = {
      boardId,
      postTitle,
      content,
      imageUrls: [],
    };
    await createPost(payload);
    router.push(`/boards/${boardId}/posts`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="postTitle" className="block text-sm font-medium mb-1">
          제목
        </label>
        <input
          id="postTitle"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full bg-[#2A2E39] text-white p-2 rounded border border-[#363A45] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={10}
          className="w-full bg-[#2A2E39] text-white p-2 rounded border border-[#363A45] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-[#363A45] hover:bg-[#404653] rounded-lg text-white transition"
        >
          취소
        </button>
        <button
          onClick={handleCreate}
          disabled={isSubmitting}
          className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? '작성 중...' : '작성하기'}
        </button>
      </div>
    </div>
  );
}
