// components/comments/CommentForm.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { createComment } from '@/service/comments';
import { CreateCommentRequest, CommentResponse } from '@/types/comments';

interface Props {
  postId: number;
  parentId?: number;

  /** 작성 모드에서, 새로 생성된 댓글을 부모로 전달할 콜백 */
  onCreated?: (newComment: CommentResponse) => void;

  /** 수정 모드 진입 시, textarea 초기값 */
  defaultValue?: string;
  /** 수정 모드에서, 변경된 내용을 서버에 보낼 핸들러 */
  onSubmit?: (newContent: string) => Promise<boolean>;
  /** 수정 모드 취소 시 호출 */
  onCancel?: () => void;
}

export default function CommentForm({
  postId,
  parentId,
  onCreated,
  defaultValue = '',
  onSubmit,
  onCancel,
}: Props) {
  const [content, setContent] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // defaultValue가 바뀌면 textarea에 반영
  useEffect(() => {
    setContent(defaultValue);
  }, [defaultValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      if (onSubmit) {
        // —— 수정 모드
        const ok = await onSubmit(content);
        if (ok && onCancel) onCancel(); // 성공하면 에디트 폼 닫기
      } else {
        // —— 작성 모드
        const req: CreateCommentRequest = {
          postId,
          content,
          ...(parentId && { parentId }),
        };
        const resp = await createComment(req);
        onCreated?.({
          ...resp,
          children: resp.children || [],
        });
        setContent('');
      }
    } catch (err) {
      console.error(err);
      setError(onSubmit ? '수정에 실패했습니다.' : '댓글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
        disabled={loading}
        rows={3}
        placeholder={parentId ? '답글을 입력하세요…' : '댓글을 입력하세요…'}
        className="w-full rounded p-2 bg-gray-50 border"
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="flex items-center justify-between mt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-500 hover:underline"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading
            ? '…'
            : onSubmit
              ? '저장'
              : parentId
                ? '답글 게시'
                : '댓글 게시'}
        </button>
      </div>
    </form>
  );
}
