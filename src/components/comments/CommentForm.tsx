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

  // 댓글 제출 처리 로직(제출 버튼과 엔터키 이벤트 모두에서 호출 가능)
  const submitComment = async () => {
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const request: CreateCommentRequest = {
        postId,
        content,
        ...(parentId && { parentId }), // parentId가 있을 경우에만 포함
      };

      console.log('댓글 요청 데이터:', request);

      const response = await createComment(request);
      console.log('서버 응답:', response);

      if (!response || typeof response !== 'object') {
        throw new Error('서버 응답 데이터가 올바르지 않습니다.');
      }

      const responseWithChildren = {
        ...response,
        children: response.children || [],
      };

      onCreated(responseWithChildren);
      setContent('');
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      setError('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 폼 제출 이벤트 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitComment();
  };

  // 엔터키 입력 시 제출 처리(Shift+Enter는 줄바꿈)
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await submitComment();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full bg-[#1E222D] border border-[#363A45] placeholder-gray-500 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        placeholder={parentId ? '댓글에 답변하기...' : '댓글 작성하기...'}
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
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
