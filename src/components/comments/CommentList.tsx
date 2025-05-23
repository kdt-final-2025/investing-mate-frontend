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
import CommentSortSelector from '@/components/comments/CommentSortSelector';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  userId: string;
  sortType: string; // '최신순' 또는 '좋아요순'
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
  const [sortOrder, setSortOrder] = useState<string>(sortType);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // ✅ 정렬 라벨을 백엔드 키로 매핑
  const getSortKeyForBackend = (label: string): string => {
    return label === '좋아요순' ? 'LIKE' : 'TIME';
  };

  // 정렬이 바뀌면 초기화만 수행
  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [postId, sortOrder]);

  // 페이지가 바뀔 때마다 댓글을 로드
  useEffect(() => {
    loadComments();
  }, [page, postId, sortOrder]);

  const loadComments = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const data: CommentResponseAndPaging = await commentList(
        postId,
        getSortKeyForBackend(sortOrder), // ✅ 정렬 조건 변환 적용
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
      if (data.pageMeta.pageNumber < data.pageMeta.totalPage) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (e: any) {
      console.error(e);
      const isAuthError =
        typeof e.message === 'string' && e.message.includes('로그인');

      if (isAuthError) {
        setError('댓글은 로그인 후 확인할 수 있습니다.');
        setHasMore(false);
      } else {
        setError('댓글을 불러오는 중 오류가 발생했습니다.');
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [postId, sortOrder, size, page, loading, hasMore]);

  useEffect(() => {
    const element = loaderRef.current;
    if (!element) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (
          isIntersecting &&
          !loading &&
          hasMore &&
          scrollTop > 0 &&
          comments.length > 0
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    observerRef.current.observe(element);
    return () => observerRef.current?.disconnect();
  }, [loading, hasMore, comments]);

  const handleSortChange = (newSort: string) => {
    if (newSort === sortOrder) return;
    setSortOrder(newSort); // 상태 리셋은 useEffect에서 처리됨
  };

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
      setComments((prev) => [newComment, ...prev]);
    } catch (err) {
      console.error('댓글 생성 실패:', err);
    }
  };

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
      {/* 정렬 선택 UI */}
      <CommentSortSelector sortOrder={sortOrder} onChange={handleSortChange} />

      <CommentForm postId={postId} onSubmit={handleCreateComment} />

      {!loading && comments.length === 0 && (
        <div className="text-center text-sm text-gray-400 py-4">
          아직 댓글이 없습니다.
        </div>
      )}

      <AnimatePresence mode="wait">
        {!loading && comments.length > 0 && (
          <motion.div
            key={sortOrder} // 정렬이 바뀌면 완전 새로 렌더링되도록 key 지정
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {comments.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                postId={postId}
                onDelete={handleDeleteComment}
                onUpdate={handleUpdateComment}
                onLike={handleLikeComment}
                onAddReply={handleAddReply}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={loaderRef} className="h-10" />
      {loading && (
        <div className="text-center py-2 text-gray-400">
          댓글 불러오는 중...
        </div>
      )}
      {error && <div className="text-center py-2 text-red-500">{error}</div>}
      {!hasMore && comments.length > 0 && (
        <div className="text-center text-sm text-gray-400 py-2">
          모든 댓글을 불러왔습니다.
        </div>
      )}
    </div>
  );
}
