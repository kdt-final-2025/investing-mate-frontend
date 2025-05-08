import { API_URL } from '@/env/constants';
import { API_BASE } from '@/service/baseAPI';
import { createClient } from '@/utils/supabase/client';
import { getSessionOrThrow } from '@/utils/auth';

// API 응답 예시 스펙에 맞춘 타입 정의
export type Post = {
  id: number;
  postTitle: string;
  userId: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  createdAt: string;
};

interface PageInfo {
  pageNumber: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

interface PostListAndPagingResponse {
  boardName: string;
  postListResponse: Post[];
  pageInfo: PageInfo;
}

export interface PostsLikedResponse {
  boardId: number;
  boardName: string;
  postTitle: string;
  userId: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  createdAt: string; // ISO 문자열
}

export interface Page {
  pageNumber: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PostsLikedAndPagingResponse {
  likedPostsResponse: PostsLikedResponse[];
  pageInfo: Page;
}

//게시글 목록 + 페이징 + 보드명까지 모두 내려받는 함수
export async function fetchPostListAndPaging(
  boardId: string,
  pageNumber = 1,
  size = 10,
  postTitle?: string,
  userId?: string,
  sortBy = 'NEWEST',
  direction = 'DESC'
): Promise<PostListAndPagingResponse> {
  const params = new URLSearchParams({
    boardId,
    pageNumber: String(pageNumber),
    size: String(size),
    sortBy,
    direction,
  });
  if (postTitle) params.append('postTitle', postTitle);
  if (userId) params.append('userId', userId);

  const res = await fetch(`${API_BASE}/posts?${params.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('게시글 목록 조회 실패');

  // 전체 JSON 응답을 그대로 반환
  return (await res.json()) as PostListAndPagingResponse;
}

export async function fetchPostDetail(postId: string) {
  const res = await fetch(`${API_URL}/posts/${postId}`, {
    headers: { Authorization: 'Bearer your_token_here' },
  });
  return res.json();
}

export async function togglePostLike(postId: string, liked: boolean) {
  const res = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: liked ? 'DELETE' : 'POST',
    headers: { Authorization: 'Bearer your_token_here' },
  });
  return res.ok;
}

// 좋아요한 게시글 불러오기
export async function fetchLikedPosts(
  pageNumber: number = 0
): Promise<PostsLikedAndPagingResponse> {
  // 1) Supabase 세션에서 토큰 가져오기
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  // 2) API 호출
  const res = await fetch(
    `${API_BASE}/posts/liked?currentPage=${pageNumber}&size=10`,
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

  // 3) 응답 전체를 리턴 (likedPostsResponse  pageInfo)
  return await res.json();
}
