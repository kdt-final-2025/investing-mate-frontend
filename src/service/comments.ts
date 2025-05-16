import {
  CommentResponse,
  CreateCommentRequest,
  CommentResponseAndPaging,
  CommentLikeResponse,
} from '@/types/comments';
import apiClient from '@/service/apiClinet';
/**
 * 댓글 생성 (대댓글 포함)
 */
export async function createComment(
  request: CreateCommentRequest
): Promise<CommentResponse> {
  const res = await apiClient.post('/comments', request);
  return res.data;
}

/**
 * 댓글 수정
 */
export async function updateComment(
  commentId: number,
  request: CreateCommentRequest
): Promise<void> {
  const res = await apiClient.put(`/comments/${commentId}`, request);
  return res.data;
}

/**
 * 댓글 삭제
 */
export async function deleteComment(commentId: number): Promise<void> {
  const res = await apiClient.delete(`/comments/${commentId}`);
  console.log('Deleting commentId:', commentId);
  return res.data;
}

/**
 * 댓글 좋아요 토글
 */
export async function likeComment(
  commentId: number
): Promise<CommentLikeResponse> {
  const res = await apiClient.post(`/comments/${commentId}/likes`, {});
  return res.data;
}

// 댓글 조회 (페이징)
export async function commentList(
  postId: number,
  sortType: string,
  size: number,
  pageNumber: number
): Promise<CommentResponseAndPaging> {
  const res = await apiClient.get('/comments', {
    params: {
      postId,
      sortType,
      size,
      pageNumber,
    },
  });
  return res.data;
}
