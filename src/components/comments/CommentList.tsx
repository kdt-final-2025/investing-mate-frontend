'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Comment, fetchPaginatedComments } from './comment.service';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

interface Props {
  boardId: string;
  postId: string;
}

export default function CommentList({ boardId, postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadComments = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchPaginatedComments(boardId, postId, page); // ⭐️ page 넘겨야함
      setComments((prev) => [...prev, ...data.items]);
      setHasMore(data.pageNumber < data.totalPage); // 아직 더 가져올게 있으면 true

      setPage((prev) => prev + 1);
    } catch (e) {
      console.error(e);
      setError('댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [boardId, postId, page, hasMore, loading]);

  useEffect(() => {
    loadComments(); // 처음 mount 시 1페이지 가져오기
  }, [loadComments]);

  // IntersectionObserver: 스크롤 맨 밑 감지
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadComments();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, []); // 🚨 빈 deps로 고정 (한번만 실행)

  const handleCreated = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleDeleted = (id: number) => {
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
      <CommentForm
        boardId={boardId}
        postId={postId}
        onCreated={handleCreated}
      />
      {!loading && comments.length === 0 && (
        <div className="text-center text-sm text-gray-400">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </div>
      )}

      {/* 댓글 목록 */}
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          boardId={boardId}
          postId={postId}
          onDeleted={handleDeleted}
          onUpdated={handleUpdated}
          onLiked={handleLiked}
        />
      ))}

      {/* 스크롤 감지용 div */}
      <div ref={loaderRef} />

      {/* UX 디테일 */}
      {loading && (
        <div className="text-center text-sm text-gray-400">
          댓글 불러오는 중...
        </div>
      )}
      {error && <div className="text-center text-sm text-red-500">{error}</div>}
      {!hasMore && (
        <div className="text-center text-sm text-gray-500">
          모든 댓글을 불러왔습니다.
        </div>
      )}
    </div>
  );
}
