'use client';

import React, { useState, KeyboardEvent } from 'react';
import { CommentResponse } from '@/types/comments';

interface Props {
  postId?: number;
  parentId?: number;
  onSubmit?: (content: string) => Promise<any>;
  onCancel?: () => void;
  onCreated?: (c: CommentResponse) => void;
}

export default function CommentForm({
  postId,
  parentId,
  onSubmit,
  onCancel,
  onCreated,
}: Props) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // CommentList에서 전달받은 onSubmit 함수가 있다면 이를 사용하여 댓글 생성 API 호출
      if (onSubmit) {
        await onSubmit(content.trim());
        setContent(''); // 성공 시 입력란 초기화
      }
      // onSubmit 함수가 없을 경우, onCreated도 호출할 수 있도록 (하지만 주로 onSubmit을 사용)
      else if (onCreated) {
        console.error(
          'onSubmit 함수가 제공되지 않았습니다. onSubmit을 사용해 댓글 생성 API를 호출해주세요.'
        );
        setError('댓글을 저장할 콜백 함수가 제공되지 않았습니다.');
      } else {
        console.error('댓글을 저장할 적절한 콜백 함수가 제공되지 않았습니다.');
        setError('댓글을 저장할 수 없습니다.');
      }
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
        className="w-full rounded-md p-3 bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

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
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50 transition"
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
