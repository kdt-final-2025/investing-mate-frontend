'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  commentList,
  createComment,
  deleteComment,
  updateComment,
  likeComment,
} from '@/service/comments';
import {
  CommentResponse,
  CreateCommentRequest,
  CommentResponseAndPaging,
} from '@/types/comments';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

interface Props {
  userId: string;
  sortType: string;
  postId: number;
  size: number;
  pageNumber?: number;
}

export default function CommentList({
  userId,
  postId,
  sortType,
  size = 150,
}: Props) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // postId나 sortType이 변경되면 댓글 목록 상태를 초기화합니다.
  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [postId, sortType]);

  // 댓글 목록 API 호출 함수 (페이징 포함)
  const loadComments = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const data: CommentResponseAndPaging = await commentList(
        postId,
        sortType,
        size,
        page
      );
      if (page === 1) {
        setComments(data.items);
      } else {
        setComments((prev) => {
          const existingIds = new Set(prev.map((c) => c.commentId));
          const newItems = data.items.filter(
            (c) => !existingIds.has(c.commentId)
          );
          return [...prev, ...newItems];
        });
      }
      // 페이지 정보에 따라 추가 호출 여부 결정
      if (data.pageMeta.pageNumber < data.pageMeta.totalPage) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
      setError('댓글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId, sortType, size, page, loading, hasMore]);

  // 페이지 번호가 변경될 때마다 댓글 목록을 불러옵니다.
  useEffect(() => {
    loadComments();
  }, [page, loadComments]);

  // 무한 스크롤: loaderRef 요소가 화면에 보이면 다음 페이지를 요청합니다.
  useEffect(() => {
    const element = loaderRef.current;
    if (!element) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    observerRef.current.observe(element);
    return () => observerRef.current?.disconnect();
  }, [loading, hasMore]);

  // [댓글 생성] — CommentList에서 createComment API를 호출하는 함수
  // 이 함수는 CommentForm의 onSubmit으로 전달되어, 사용자가 댓글 게시 버튼(또는 Enter 키)를 누르면 호출됩니다.
  const handleCreateComment = async (content: string): Promise<void> => {
    if (!postId) {
      console.error('postId가 제공되지 않았습니다.');
      return;
    }
    try {
      const newComment = await createComment({
        postId,
        content: content.trim(),
      });
      // 최상위 댓글인 경우 새 댓글을 상태 배열의 맨 앞에 추가합니다.
      setComments((prev) => [newComment, ...prev]);
    } catch (err) {
      console.error('댓글 생성 실패:', err);
    }
  };

  // [댓글 삭제]
  const handleDeleteComment = async (commentId: number): Promise<boolean> => {
    if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) return false;
    try {
      await deleteComment(commentId);
      setComments((prev) => {
        const newComments = prev.filter((c) => c.commentId !== commentId);
        return newComments.map((comment) => ({
          ...comment,
          children: comment.children
            ? comment.children.filter((c) => c.commentId !== commentId)
            : [],
        }));
      });
      return true;
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      return false;
    }
  };

  // [댓글 수정]
  const handleUpdateComment = async (
    commentId: number,
    content: string
  ): Promise<boolean> => {
    if (!content.trim()) return false;
    const request: CreateCommentRequest = { postId, content };
    try {
      await updateComment(commentId, request);
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.commentId === commentId) {
            return { ...comment, content };
          }
          if (comment.children && comment.children.length > 0) {
            return {
              ...comment,
              children: comment.children.map((child) =>
                child.commentId === commentId ? { ...child, content } : child
              ),
            };
          }
          return comment;
        })
      );
      return true;
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      return false;
    }
  };

  // [댓글 좋아요 토글]
  const handleLikeComment = async (commentId: number): Promise<boolean> => {
    try {
      const result = await likeComment(commentId);
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.commentId === commentId) {
            return {
              ...comment,
              likeCount: result.likeCount,
              likedByMe: result.likedByMe,
            };
          }
          if (comment.children && comment.children.length > 0) {
            return {
              ...comment,
              children: comment.children.map((child) =>
                child.commentId === commentId
                  ? {
                      ...child,
                      likeCount: result.likeCount,
                      likedByMe: result.likedByMe,
                    }
                  : child
              ),
            };
          }
          return comment;
        })
      );
      return true;
    } catch (err) {
      console.error('좋아요 토글 실패:', err);
      return false;
    }
  };

  // [답글 추가] — 상위 댓글에 새로운 대댓글(답글)을 추가합니다.
  const handleAddReply = (
    parentComment: CommentResponse,
    newReply: CommentResponse
  ) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.commentId === parentComment.commentId) {
          return {
            ...comment,
            children: [...(comment.children || []), newReply],
          };
        }
        return comment;
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* CommentForm에 handleCreateComment 함수를 onSubmit으로 전달 */}
      <CommentForm postId={postId} onSubmit={handleCreateComment} />

      {!loading && comments.length === 0 && (
        <div className="text-center text-sm text-gray-400 py-4">
          아직 댓글이 없습니다.
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            postId={postId}
            onDelete={handleDeleteComment}
            onUpdate={handleUpdateComment}
            onLike={handleLikeComment}
            onAddReply={handleAddReply}
            // onCreated도 필요에 따라 전달할 수 있습니다(답글 생성 등)
            onCreated={handleCreateComment}
          />
        ))}
      </div>

      {/* 무한 스크롤 감지를 위한 요소 */}
      <div ref={loaderRef} className="h-10" />

      {loading && <div className="text-center py-2">댓글 불러오는 중...</div>}
      {error && <div className="text-center text-red-500 py-2">{error}</div>}
      {!hasMore && comments.length > 0 && (
        <div className="text-center text-sm text-gray-500 py-2">
          모든 댓글을 불러왔습니다.
        </div>
      )}
    </div>
  );
}
