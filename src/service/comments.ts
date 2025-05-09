import axios from 'axios';
import { API_URL } from '@/env/constants';
import { createClient } from '@/utils/supabase/client';
import {
  CommentResponse,
  CreateCommentRequest,
  Pagemeta,
  CommentResponseAndPaging,
  CommentLikeResponse,
  Comment,
  PaginatedCommentResponse,
} from '@/types/comments';
import { getSessionOrThrow } from '@/utils/auth';

/**
 * 좋아요순 또는 최신순 정렬된 댓글+대댓글 조회 (페이징 포함)
 * 백엔드: GET /comments/likes
 */

// 댓글 생성 (대댓글 포함)
export async function createComment(
  request: CreateCommentRequest
): Promise<CommentResponse> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;
  const res = await axios.post(`${API_URL}/comments`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
    cache: 'no-store',
  });
  return res.data;
}

//댓글 수정
export async function updateComment(
  commentId: string,
  request: CreateCommentRequest
): Promise<void> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;
  const res = await axios.put(
    `${API_URL}/comments/${parseInt(commentId)}}`,
    request,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

// 댓글 삭제
export async function deleteComment(
  userId: string,
  commentId: string
): Promise<void> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;
  const res = await axios.delete(`${API_URL}/${commentId}`, {
    headers: {
      Authorization: userId,
    },
  });
  return res.data;
}

// 댓글 수정
export async function updateComment(
  userId: string,
  postId: number,
  parentId: number | undefined,
  commentId: number,
  request: CreateCommentRequest
): Promise<Comment> {
  const res = await axios.patch(`${API_URL}${commentId}`, {
    postId,
    parentId,
    headers: {
      Authorization: userId,
    },
    body: JSON.stringify(request),
  });
  return res.data;
}

// 댓글 좋아요 토글
export async function likeComment(
  userId: string,
  commentId: number
): Promise<{ likeCount: number; likedByMe: boolean }> {
  const res = await axios.post(`${API_URL}/comments/${commentId}/likes`, {
    headers: {
      Authorization: userId,
    },
  });
  return res.data;
}
