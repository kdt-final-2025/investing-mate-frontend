'use client';
import React, { useState } from 'react';
import { Comment, createComment } from '../../service/comments';
import { CreateCommentRequest } from '@/types/comments';
interface Props {
  postId: string;
  parentId?: string;
  onCreated: (newComment: Comment) => void;
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

      const response = await createComment(request);
      const newComment: Comment = {
        id: response.commentId,
        content: response.content,
        author: response.userId,
        createdAt: response.createdAt,
        likeCount: response.likeCount,
        likedByMe: response.likedByMe,
      };
      onCreated(newComment); // 이 부분도 Comment 타입으로 수정 필요할 수 있음
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
