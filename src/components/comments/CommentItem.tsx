'use client';
import React, { useState } from 'react';
import {
  Comment,
  deleteComment,
  updateComment,
  likeComment,
} from '../../service/comments';
import CommentForm from './CommentForm';
interface Props {
  comment: Comment;
  boardId: string;
  postId: string;
  onDeleted: (id: number) => void;
  onUpdated: (c: Comment) => void;
  onLiked: (c: Comment) => void;
}

export default function CommentItem({
  comment,
  boardId,
  postId,
  onDeleted,
  onUpdated,
  onLiked,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [text, setText] = useState(comment.content);

  const handleDelete = async () => {
    await deleteComment(boardId, postId, comment.id);
    onDeleted(comment.id);
  };

  const handleUpdate = async () => {
    const updated = await updateComment(boardId, postId, comment.id, text);
    onUpdated(updated);
    setIsEditing(false);
  };

  const handleLike = async () => {
    const result = await likeComment(boardId, postId, comment.id);
    onLiked({
      ...comment,
      likeCount: result.likeCount,
      likedByMe: result.likedByMe,
    });
  };

  const handleReplyCreated = (newComment: Comment) => {
    // bubble up new reply
    onUpdated({
      ...comment,
      replies: [...(comment.replies || []), newComment],
    });
    setShowReplyForm(false);
  };

  return (
    <div className="bg-[#1E222D] p-4 rounded-lg border border-[#363A45]">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-white">{comment.author}</span>
        <span className="text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      {isEditing ? (
        <textarea
          className="w-full bg-[#1E222D] border border-[#363A45] text-white mt-2 p-2 rounded-lg"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
      ) : (
        <p className="mt-2">{comment.content}</p>
      )}

      <div className="mt-2 flex space-x-4">
        <button onClick={handleLike} className="btn btn-xs">
          {comment.likedByMe ? '💖' : '🤍'} {comment.likeCount}
        </button>
        {isEditing ? (
          <>
            <button onClick={handleUpdate} className="btn btn-sm">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn btn-sm">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="btn btn-sm">
              Edit
            </button>
            <button onClick={handleDelete} className="btn btn-sm">
              Delete
            </button>
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="btn btn-sm"
            >
              Reply
            </button>
          </>
        )}
      </div>

      {showReplyForm && (
        <div className="ml-6 mt-2">
          <CommentForm
            boardId={boardId}
            postId={postId}
            parentId={comment.id}
            onCreated={handleReplyCreated}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              boardId={boardId}
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
