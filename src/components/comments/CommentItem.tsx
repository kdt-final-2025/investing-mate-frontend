// components/comments/CommentItem.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { CommentResponse } from '@/types/comments';
import CommentForm from './CommentForm';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '@/utils/supabase/client';
import { createComment } from '@/service/comments';

interface Props {
  comment: CommentResponse;
  postId: number;
  onDelete: (commentId: number) => Promise<boolean>;
  onUpdate: (commentId: number, newContent: string) => Promise<boolean>;
  onLike: (commentId: number) => Promise<boolean>;
  onAddReply: (parent: CommentResponse, reply: CommentResponse) => void;
}

export default function CommentItem({
  comment,
  postId,
  onDelete,
  onUpdate,
  onLike,
  onAddReply,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUserId(session?.user.id || null);
    };

    fetchUser();
  }, []);

  const isOwner = comment.userId === currentUserId;

  // 답글 저장 함수
  const handleReplySubmit = async (content: string) => {
    const req = { postId, content, parentId: comment.commentId };
    const newReply = await createComment(req);
    return newReply;
  };

  // 수정 저장 함수
  const handleEditSubmit = async (newContent: string) => {
    const success = await onUpdate(comment.commentId, newContent);
    if (success) setIsEditing(false);
  };

  return (
    <div className="border border-[#2A2E39] rounded-lg p-4 mb-4 bg-[#1E222D] text-white">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="font-semibold">{comment.userId}</span>
          <span className="ml-2 text-xs text-gray-400">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>

      {/* 수정 모드 */}
      {isEditing ? (
        <CommentForm
          initialContent={comment.content}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p className="mb-2 text-gray-100">{comment.content}</p>
      )}

      {/* 액션 버튼 */}
      {!isEditing && (
        <div className="flex gap-2 text-xs mb-2">
          <button
            onClick={() => onLike(comment.commentId)}
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-700 hover:text-white active:scale-95 active:bg-gray-600 transition duration-150 text-gray-400"
          >
            ❤️ {comment.likeCount}
          </button>

          {/* parentId가 없을 때만 답글 버튼 보임 */}
          {!comment.parentId && (
            <button
              onClick={() => setShowReplyForm((v) => !v)}
              className="px-2 py-1 rounded-md hover:bg-gray-700 hover:text-white active:scale-95 active:bg-gray-600 transition duration-150 text-gray-400"
            >
              답글
            </button>
          )}

          {isOwner && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-2 py-1 rounded-md hover:bg-gray-700 hover:text-white active:scale-95 active:bg-gray-600 transition duration-150 text-gray-400"
              >
                수정
              </button>
              <button
                onClick={() => onDelete(comment.commentId)}
                className="px-2 py-1 rounded-md hover:bg-red-600 hover:text-white active:scale-95 active:bg-red-500 transition duration-150 text-gray-400"
              >
                삭제
              </button>
            </>
          )}
        </div>
      )}

      {/* 답글 폼 */}
      {showReplyForm && (
        <div className="ml-4">
          <CommentForm
            postId={postId}
            parentId={comment.commentId}
            onSubmit={handleReplySubmit}
            onCreated={(reply) => {
              onAddReply(comment, reply);
              setShowReplyForm(false);
            }}
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
