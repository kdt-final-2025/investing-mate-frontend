'use client';

import React, { useState, KeyboardEvent } from 'react';
import { CommentResponse } from '@/types/comments';

interface Props {
  postId?: number;
  parentId?: number;
  onSubmit: (content: string) => Promise<any>;
  onCancel?: () => void;
  onCreated?: (c: CommentResponse) => void;
  initialContent?: string;
}

export default function CommentForm({
  postId,
  parentId,
  onSubmit,
  onCancel,
  onCreated,
  initialContent = '',
}: Props) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await onSubmit(content.trim());
      setContent('');
      if (onCreated && result) onCreated(result as CommentResponse);
    } catch (err) {
      console.error('댓글 저장 실패:', err);
      setError('댓글 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        rows={3}
        placeholder={parentId ? '답글을 입력하세요…' : '댓글을 입력하세요…'}
        className="
          w-full rounded-lg p-3
          bg-[#1E222D] border border-[#2A2E39]
          text-white placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-400
          resize-none
        "
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="flex items-center justify-between mt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-400 hover:underline"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="
            px-4 py-1.5 rounded-lg text-sm font-medium
            bg-[#2A2E39] hover:bg-[#1E222D] text-white
            disabled:opacity-50 transition
          "
        >
          {loading
            ? '…'
            : onCancel
              ? '저장'
              : parentId
                ? '답글 게시'
                : '댓글 게시'}
        </button>
      </div>
    </form>
  );
}
