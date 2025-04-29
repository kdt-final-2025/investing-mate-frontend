'use client';
import React, { useState } from 'react';
import { createComment } from '../../service/comments';

interface Props {
  boardId: string;
  postId: string;
  parentId?: number;
  onCreated: (newComment: any) => void;
}

export default function CommentForm({
  boardId,
  postId,
  parentId,
  onCreated,
}: Props) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const newComment = await createComment(boardId, postId, content, parentId);
    setContent('');
    onCreated(newComment);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full bg-[#1E222D] border border-[#363A45] placeholder-gray-500 text-white px-3 py-2 rounded-lg focus:outline-none"
        placeholder={parentId ? 'Reply...' : 'Comment...'}
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 px-4 py-1 bg-[#2A2E39] hover:bg-[#363B47] rounded-lg text-sm text-white disabled:opacity-50"
      >
        {loading ? 'Posting...' : parentId ? 'Post Reply' : 'Post Comment'}
      </button>
    </form>
  );
}
