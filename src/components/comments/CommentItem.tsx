'use client';
import React, { useState } from 'react';
import {
  Comment,
  deleteComment,
  updateComment,
  likeComment,
} from '../../service/comments';
import { CreateCommentRequest } from '@/types/comments';
import CommentForm from './CommentForm';

interface Props {
  comment: Comment;
  postId: string;
  onDeleted: (id: string) => void;
  onUpdated: (c: Comment) => void;
  onLiked: (c: Comment) => void;
}

export default function CommentItem({
  comment,
  postId,
  onDeleted,
  onUpdated,
  onLiked,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [text, setText] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteComment(comment.id);
      onDeleted(comment.id);
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      setError('댓글 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (!text.trim()) {
      return;
    }

    setIsUpdating(true);
    setError(null);

    const request: CreateCommentRequest = {
      postId,
      parentId: comment.parentId ?? null,
      content: text,
    };

    try {
      await updateComment(String(comment.id), request);
      onUpdated({
        ...comment,
        content: text,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      setError('댓글 수정에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    setError(null);

    try {
      const result = await likeComment(String(comment.id));
      onLiked({
        ...comment,
        likeCount: result.likeCount,
        likedByMe: result.likedByMe,
      });
    } catch (err) {
      console.error('좋아요 토글 실패:', err);
      setError('좋아요 처리에 실패했습니다.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleReplyCreated = (newComment: Comment) => {
    // 새 답글 추가
    const updatedReplies = [...(comment.replies || []), newComment];
    onUpdated({
      ...comment,
      replies: updatedReplies,
    });
    setShowReplyForm(false);
  };

  // 시간 형식 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-[#1E222D] p-4 rounded-lg border border-[#363A45]">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-white">{comment.author}</span>
        <span className="text-xs text-gray-400">
          {formatDate(comment.createdAt)}
        </span>
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            className="w-full bg-[#1E222D] border border-[#363A45] text-white p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            disabled={isUpdating}
            rows={3}
          />
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating || !text.trim()}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md disabled:opacity-50"
            >
              {isUpdating ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setText(comment.content);
                setError(null);
              }}
              disabled={isUpdating}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-md disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-gray-200 whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      <div className="mt-3 flex space-x-3 text-xs">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="flex items-center space-x-1 text-gray-400 hover:text-white disabled:opacity-50"
        >
          <span>{comment.likedByMe ? '💖' : '🤍'}</span>
          <span>{comment.likeCount}</span>
        </button>

        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-gray-400 hover:text-white"
        >
          답글
        </button>

        <button
          onClick={() => setIsEditing(true)}
          className="text-gray-400 hover:text-white"
        >
          수정
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-gray-400 hover:text-red-400 disabled:opacity-50"
        >
          {isDeleting ? '삭제 중...' : '삭제'}
        </button>
      </div>

      {showReplyForm && (
        <div className="ml-4 mt-3 border-l-2 border-gray-700 pl-3">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onCreated={handleReplyCreated}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 mt-4 space-y-3 border-l-2 border-gray-700 pl-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onDeleted={onDeleted}
              onUpdated={onUpdated}
              onLiked={onLiked}
            />
          ))}
        </div>
      )}
    </div>
  );
}
