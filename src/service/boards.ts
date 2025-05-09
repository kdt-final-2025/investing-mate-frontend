import { getSessionOrThrow } from '@/utils/auth';
import { API_BASE } from '@/service/baseAPI';
import { createClient } from '@/utils/supabase/client';

export interface Board {
  id: number;
  boardName: string;
  postCount: number;
}

export interface CreateBoardRequest {
  boardName: string;
}

export interface BoardResponse {
  id: number;
  boardName: string;
  postCount: number;
}

// 게시판 생성
export async function createBoard(
  request: CreateBoardRequest
): Promise<BoardResponse> {
  // 유저 토큰 가져오기 (로그인 필요)
  const supabase = createClient();
  const session = await getSessionOrThrow(supabase);
  const token = session.access_token;

  const res = await fetch(`${API_BASE}/boards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request), // <-- 객체 자체를 직렬화
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`게시판 생성 실패: ${res.status} ${text}`);
  }
  return res.json();
}

// 전체 게시판 목록 조회
export async function getBoards(): Promise<Board[]> {
  const res = await fetch(`${API_BASE}/boards`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('게시판 목록 조회 실패');
  const data: Board[] = await res.json();
  return data;
}
