//components/comments/CommentForm.tsx
'use client';
import React, { useState } from 'react';
import { createComment } from '../../service/comments';
import { CreateCommentRequest, CommentResponse } from '@/types/comments';

interface Props {
  postId: number;
  parentId?: number;
  onCreated: (newComment: CommentResponse) => void;
}

export default function CommentForm({ postId, parentId, onCreated }: Props) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const request: CreateCommentRequest = {
        postId: postId,
        content,
        ...(parentId && { parentId }), // parentId가 있을 때만 포함
      };

      // 요청 데이터 로깅
      console.log('댓글 요청 데이터:', request);

      const response = await createComment(request);

      // 서버 응답 로깅
      console.log('서버 응답:', response);

      // 응답 데이터 구조 검증
      if (!response || typeof response !== 'object') {
        throw new Error('서버 응답 데이터가 올바르지 않습니다.');
      }

      // 백엔드에서 children 필드가 없을 경우 빈 배열로 초기화
      const responseWithChildren = {
        ...response,
        children: response.children || [],
      };

      // 응답을 onCreated 핸들러에 전달
      onCreated(responseWithChildren);
      setContent('');
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      setError('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full bg-[#1E222D] border border-[#363A45] placeholder-gray-500 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        placeholder={parentId ? '댓글에 답변하기...' : '댓글 작성하기...'}
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
        disabled={loading}
        rows={3}
        required
      />

      <div className="flex justify-between items-center mt-2">
        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-1 bg-[#2A2E39] hover:bg-[#363B47] rounded-lg text-sm text-white disabled:opacity-50 transition-colors"
        >
          {loading ? '게시 중...' : parentId ? '답변 게시' : '댓글 게시'}
        </button>
      </div>
    </form>
  );
}
