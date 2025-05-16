'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  commentList,
  deleteComment,
  updateComment,
  likeComment,
} from '@/service/comments';
import { CommentResponse, CreateCommentRequest } from '@/types/comments';
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  // 상태 초기화: postId나 sortType가 바뀔 때 댓글과 페이지 정보를 리셋
  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [postId, sortType]);

  // 페이지 번호(page)가 바뀔 때마다 댓글을 불러옴
  useEffect(() => {
    if (page === 1) {
      loadComments();
    }
  }, [postId, sortType]);

  useEffect(() => {
    if (page !== 1) {
      loadComments();
    }
  }, [page]);

  // 댓글 데이터를 불러오는 API 호출 함수
  const loadComments = useCallback(async () => {
    if (loading || !hasMore) return; // API 중복 호출 방지 및 더 불러올 데이터가 없으면 중단
    setLoading(true);
    setError(null);
    try {
      const data = await commentList(postId, sortType, size, page);
      if (page === 1) {
        // 첫 페이지인 경우 기존 댓글을 교체
        setComments(data.items);
      } else {
        // 이후 페이지인 경우 중복 제거 후 추가
        setComments((prev) => {
          const existingIds = new Set(prev.map((c) => c.commentId));
          const newItems = data.items.filter(
            (c) => !existingIds.has(c.commentId)
          );
          return [...prev, ...newItems];
        });
      }
      // 페이지 정보에 따라 더 불러올 댓글이 있는지 결정
      if (data.pageMeta.pageNumber < data.pageMeta.totalPage) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
      setError('댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId, sortType, size, page, loading, hasMore]);

  // 무한 스크롤: loaderRef에 연결된 요소가 화면에 보이면 page를 증가시킴
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

  // 댓글 생성 핸들러: 최상위 댓글은 바로 추가, 대댓글은 전체 목록을 새로 불러오도록 함
  const handleCreated = (newComment: CommentResponse) => {
    if (!newComment.parentId) {
      setComments((prev) => [newComment, ...prev]);
    } else {
      setPage(1);
      setHasMore(true);
      // page가 초기화되면 useEffect에서 loadComments가 호출되어 전체 댓글이 새로 로드됨
    }
  };

  // 댓글 삭제 핸들러: API 요청까지 포함하여 CommentItem에서 직접 사용 가능하도록 재구성
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      return false;
    }

    try {
      await deleteComment(commentId);

      // 삭제 성공 시 상태 업데이트
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

  // 댓글 업데이트 핸들러: API 요청까지 포함
  const handleUpdateComment = async (commentId: number, content: string) => {
    if (!content.trim()) {
      return false;
    }

    const request: CreateCommentRequest = {
      postId,
      content: content,
    };

    try {
      await updateComment(commentId, request);

      // 업데이트 성공 시 상태 업데이트
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.commentId === commentId) {
            return {
              ...comment,
              content: content,
            };
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

  // 댓글 좋아요 핸들러: API 요청까지 포함
  const handleLikeComment = async (commentId: number) => {
    try {
      const result = await likeComment(commentId);

      // 좋아요 상태 업데이트
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

  // 답글 추가 핸들러
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
      {/* 최상위 댓글 작성 폼 */}
      <CommentForm postId={postId} onCreated={handleCreated} />

      {/* 댓글이 없을 때 표시 */}
      {!loading && comments.length === 0 && (
        <div className="text-center text-sm text-gray-400 py-4">
          아직 댓글이 없습니다.
        </div>
      )}

      {/* 댓글 목록 렌더링 */}
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
            onCreated={handleCreated}
          />
        ))}
      </div>

      {/* 무한 스크롤 감지를 위한 요소 */}
      <div ref={loaderRef} className="h-10" />

      {/* 로딩 상태 */}
      {loading && <div className="text-center py-2">댓글 불러오는 중...</div>}

      {/* 에러 메시지 */}
      {error && <div className="text-center text-red-500 py-2">{error}</div>}

      {/* 모든 댓글을 불러온 경우 메시지 */}
      {!hasMore && comments.length > 0 && (
        <div className="text-center text-sm text-gray-500 py-2">
          모든 댓글을 불러왔습니다.
        </div>
      )}
    </div>
  );
}
