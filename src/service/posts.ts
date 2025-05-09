// src/services/posts.ts
import { API_BASE } from '@/service/baseAPI';
import { createClient } from '@/utils/supabase/client';
import { getSessionOrThrow } from '@/utils/auth';
import {
  CreatePostRequest,
  DeletePostResponse,
  PageInfo,
  PostDto,
  PostListResponse,
  PostListAndPagingResponse,
  PostResponse,
  PostLikeResponse,
  PostsLikedAndPagingResponse,
} from '@/types/posts';

// 게시물 생성
export async function createPost(
  request: CreatePostRequest
): Promise<PostResponse> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('게시물 생성에 실패했습니다.');
  }
  return res.json();
}

// 게시물 상세 조회
export async function getPost(postId: number): Promise<PostResponse> {
  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('게시물 조회에 실패했습니다.');
  }
  return res.json();
}

// 게시물 수정
export async function updatePost(
  postId: number,
  request: CreatePostRequest
): Promise<PostResponse> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('게시물 수정에 실패했습니다.');
  }
  return res.json();
}

// 게시물 삭제
export async function deletePost(postId: number): Promise<DeletePostResponse> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('게시물 삭제에 실패했습니다.');
  }
  return res.json();
}

// 게시물 목록 조회
export async function fetchPostList(params: {
  boardId: number;
  postTitle?: string;
  userId?: string;
  sortBy?: 'NEWEST' | 'OLDEST';
  direction?: 'DESC' | 'ASC';
  pageNumber?: number;
  size?: number;
}): Promise<PostListAndPagingResponse> {
  const query = new URLSearchParams();
  query.append('boardId', params.boardId.toString());
  if (params.postTitle) query.append('postTitle', params.postTitle);
  if (params.userId) query.append('userId', params.userId);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.direction) query.append('direction', params.direction);
  if (params.pageNumber)
    query.append('pageNumber', params.pageNumber.toString());
  if (params.size) query.append('size', params.size.toString());

  const res = await fetch(`${API_BASE}/posts?${query.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('게시물 목록을 불러오는 데 실패했습니다.');
  }
  return res.json();
}

// 좋아요 토글
export async function toggleLike(postId: number): Promise<PostLikeResponse> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('좋아요 처리에 실패했습니다.');
  }
  return res.json();
}

// 좋아요한 게시물 목록 조회
export async function fetchLikedPosts(
  pageNumber: number = 1,
  size: number = 10
): Promise<PostsLikedAndPagingResponse> {
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const res = await fetch(
    `${API_BASE}/posts/liked?currentPage=${pageNumber}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw new Error('좋아요한 게시글을 불러오는 데 실패했습니다.');
  }
  return res.json();
}
