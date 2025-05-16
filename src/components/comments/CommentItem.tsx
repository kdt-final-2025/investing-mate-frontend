// components/comments/CommentItem.tsx
'use client';
import React, { useState } from 'react';
import { CommentResponse } from '@/types/comments';
import CommentForm from './CommentForm';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  comment: CommentResponse;
  postId: number;
  onDelete: (commentId: number) => Promise<boolean>;
  onUpdate: (commentId: number, newContent: string) => Promise<boolean>;
  onLike: (commentId: number) => Promise<boolean>;
  onAddReply: (parent: CommentResponse, reply: CommentResponse) => void;
  onCreated: (c: CommentResponse) => void;
}

export default function CommentItem({
  comment,
  postId,
  onDelete,
  onUpdate,
  onLike,
  onAddReply,
  onCreated,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplyCreated = (reply: CommentResponse) => {
    onAddReply(comment, reply);
    setShowReplyForm(false);
  };

  return (
    <div className="border rounded p-4 mb-4 bg-white">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="font-semibold">{comment.userId}</span>
          <span className="ml-2 text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>

      {/* 수정 모드 */}
      {isEditing ? (
        <CommentForm
          postId={postId}
          defaultValue={comment.content}
          onSubmit={async (newText) => {
            const ok = await onUpdate(comment.commentId, newText);
            return ok;
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p className="mb-2">{comment.content}</p>
      )}

      {/* 액션 버튼 */}
      {!isEditing && (
        <div className="flex gap-4 text-xs text-gray-600 mb-2">
          <button onClick={() => onLike(comment.commentId)}>
            ❤️ {comment.likeCount}
          </button>
          <button onClick={() => setShowReplyForm((v) => !v)}>답글</button>
          <button onClick={() => setIsEditing(true)}>수정</button>
          <button onClick={() => onDelete(comment.commentId)}>삭제</button>
        </div>
      )}

      {/* 답글 폼 */}
      {showReplyForm && (
        <div className="ml-4">
          <CommentForm
            postId={postId}
            parentId={comment.commentId}
            onCreated={handleReplyCreated}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* 대댓글 */}
      {comment.children?.length > 0 && (
        <div className="ml-4 mt-4 space-y-4">
          {comment.children.map((child) => (
            <CommentItem
              key={child.commentId}
              comment={child}
              postId={postId}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onLike={onLike}
              onAddReply={onAddReply}
              onCreated={onCreated}
            />
          ))}
        </div>
      )}
    </div>
  );
}
