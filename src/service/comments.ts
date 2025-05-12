import axios from 'axios';
import { API_URL } from '@/env/constants';
import { createClient } from '@/utils/supabase/client';
import {
  CommentResponse,
  CreateCommentRequest,
  CommentResponseAndPaging,
  CommentLikeResponse,
} from '@/types/comments';
import { getSessionOrThrow } from '@/utils/auth';
// 댓글 및 대댓글 인터페이스
export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  parentId?: string;
  replies?: Comment[]; // 대댓글 배열
}

export interface PaginatedCommentResponse {
  totalPage: number;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: Comment[];
}
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
  const res = await axios.post(`${API_URL}/comments`, request, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
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
    `${API_URL}/comments/${parseInt(commentId)}`,
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
export async function deleteComment(commentId: string): Promise<void> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;
  const res = await axios.delete(`${API_URL}/comments/${parseInt(commentId)}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

// 댓글 좋아요 토글
export async function likeComment(
  commentId: string
): Promise<CommentLikeResponse> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;
  const res = await axios.post(
    `${API_URL}/comments/${parseInt(commentId)}/likes`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}
//댓글 조회
export async function commentList(
  postId: string,
  sortType: string,
  size: string,
  pageNumber: string
): Promise<CommentResponseAndPaging> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;
  const res = await axios.get(`${API_URL}/comments`, {
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
