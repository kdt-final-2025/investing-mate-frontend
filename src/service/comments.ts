// service/comments.ts
import axios from 'axios';
import { createClient } from '@/utils/supabase/client';
import {
  CommentResponse,
  CreateCommentRequest,
  CommentResponseAndPaging,
  CommentLikeResponse,
} from '@/types/comments';
import { getSessionOrThrow } from '@/utils/auth';
import { API_BASE } from '@/service/baseAPI';

/**
 * 댓글 생성 (대댓글 포함)
 */
export async function createComment(
  request: CreateCommentRequest
): Promise<CommentResponse> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;
  const res = await axios.post(`${API_BASE}/comments`, request, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

/**
 * 댓글 수정
 */
export async function updateComment(
  commentId: number,
  request: CreateCommentRequest
): Promise<void> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;
  const res = await axios.put(`${API_BASE}/comments/${commentId}`, request, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

/**
 * 댓글 삭제
 */
export async function deleteComment(commentId: number): Promise<void> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;
  const res = await axios.delete(`${API_BASE}/comments/${commentId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('Deleting commentId:', commentId);
  return res.data;
}

/**
 * 댓글 좋아요 토글
 */
export async function likeComment(
  commentId: number
): Promise<CommentLikeResponse> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;
  const res = await axios.post(
    `${API_BASE}/comments/${commentId}/likes`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

/**
 * 댓글 조회 (페이징)
 * 백엔드에서 제공하는 트리 구조를 그대로 사용
 */
export async function commentList(
  postId: number,
  sortType: string,
  size: number,
  pageNumber: number
): Promise<CommentResponseAndPaging> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;
  const res = await axios.get(`${API_BASE}/comments`, {
    params: {
      postId,
      sortType,
      size,
      pageNumber,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
