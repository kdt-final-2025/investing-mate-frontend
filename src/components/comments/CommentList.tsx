'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Comment, commentList } from '@/service/comments';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

interface Props {
  userId: string;
  postId: string;
  size: string;
  pageNumber: string;
}

export default function CommentList({
  userId,
  postId,
  size,
  pageNumber,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadComments = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const data = await commentList(userId, postId, size, pageNumber);

      const mappedComments: Comment[] = data.items.map((item) => ({
        id: item.commentId,
        content: item.content,
        author: item.userId,
        createdAt: item.createdAt,
        likeCount: item.likeCount,
        likedByMe: item.likedByMe,
      }));

      setComments((prev) => [...prev, ...mappedComments]);
      setHasMore(page < data.pageMeta.totalPage);

      if (page < data.pageMeta.totalPage) {
        setPage((prev) => prev + 1);
      }
    } catch (e) {
      console.error(e);
      setError('댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false); // ✅ 반드시 필요!
    }
  }, [postId, page, loading, hasMore]);
  // 처음 마운트 시 댓글 로드
  useEffect(() => {
    loadComments();
  }, []);

  // IntersectionObserver 설정
  useEffect(() => {
    if (!loaderRef.current) return;

    // 기존 observer 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadComments();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loaderRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadComments, loading, hasMore]);

  const handleCreated = (newComment: Comment) => {
    // 새 댓글은 맨 위에 추가
    setComments((prev) => [newComment, ...prev]);
  };

  const handleDeleted = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdated = (updated: Comment) => {
    setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleLiked = (updated: Comment) => {
    setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  return (
    <div className="space-y-4">
      {/* 댓글 작성 폼 */}
      <CommentForm postId={postId} onCreated={handleCreated} />

      {/* 댓글이 없을 때 */}
      {!loading && comments.length === 0 && (
        <div className="text-center text-sm text-gray-400 py-4">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            onDeleted={handleDeleted}
            onUpdated={handleUpdated}
            onLiked={handleLiked}
          />
        ))}
      </div>

      {/* 스크롤 감지용 div */}
      <div ref={loaderRef} className="h-10" />

      {/* 로딩 상태 표시 */}
      {loading && (
        <div className="text-center text-sm text-gray-400 py-2">
          댓글 불러오는 중...
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="text-center text-sm text-red-500 py-2">{error}</div>
      )}

      {/* 더 이상 댓글이 없을 때 */}
      {!hasMore && comments.length > 0 && (
        <div className="text-center text-sm text-gray-500 py-2">
          모든 댓글을 불러왔습니다.
        </div>
      )}
    </div>
  );
}
