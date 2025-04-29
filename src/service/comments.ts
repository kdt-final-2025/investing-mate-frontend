import axios from 'axios';
import { API_URL } from '@/env/constants';
// 댓글 및 대댓글 인터페이스 추가

export interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  parentId?: number;
  replies?: Comment[]; // 대댓글 배열
}
export interface PaginatedCommentResponse {
  totalPage: number;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: Comment[];
}
export async function fetchPaginatedComments(
  boardId: string,
  postId: string,
  page: number
): Promise<PaginatedCommentResponse> {
  const res = await axios.get(
    `${API_URL}/${boardId}/posts/${postId}/comments`,
    {
      params: { page },
    }
  );
  return res.data;
}

// 댓글 및 대댓글 fetch, 생성, 삭제, 업데이트 함수들
export async function fetchAllComments(
  boardId: string,
  postId: string
): Promise<Comment[]> {
  const res = await axios.get(`${API_URL}/${boardId}/posts/${postId}/comments`);
  return res.data;
}

export async function createComment(
  boardId: string,
  postId: string,
  content: string,
  parentId?: number // 대댓글을 위한 parentId
): Promise<Comment> {
  const res = await axios.post(
    `${API_URL}/${boardId}/posts/${postId}/comments`,
    { content, parentId }
  );
  return res.data;
}

export async function deleteComment(
  boardId: string,
  postId: string,
  commentId: number
): Promise<void> {
  await axios.delete(
    `${API_URL}/${boardId}/posts/${postId}/comments/${commentId}`
  );
}

export async function updateComment(
  boardId: string,
  postId: string,
  commentId: number,
  content: string
): Promise<Comment> {
  const res = await axios.patch(
    `${API_URL}/${boardId}/posts/${postId}/comments/${commentId}`,
    { content }
  );
  return res.data;
}
export async function likeComment(
  boardId: string,
  postId: string,
  commentId: number
): Promise<{ likeCount: number; likedByMe: boolean }> {
  const res = await axios.post(
    `${API_URL}/${boardId}/posts/${postId}/comments/${commentId}/like`
  );
  return res.data;
}
