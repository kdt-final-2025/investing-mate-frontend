import { API_URL } from '@/env/constants';

export async function fetchPosts(boardId: string, pageNumber: number = 0) {
  const res = await fetch(
    `${API_URL}/posts?boardId=${boardId}&sortBy=createdAt&direction=desc&pageNumber=${pageNumber}&size=10`,
    {
      headers: { Authorization: 'Bearer your_token_here' },
      cache: 'no-store',
    }
  );
  const data = await res.json();
  return data.PostListDto;
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
export async function fetchLikedPosts(pageNumber: number = 0) {
  const res = await fetch(
    `${API_URL}/posts/liked?pageNumber=${pageNumber}&size=10`,
    {
      headers: { Authorization: 'Bearer your_token_here' },
      cache: 'no-store',
    }
  );
  const data = await res.json();
  return data.LikedPostListDto; // API 응답에 맞게 수정
}
