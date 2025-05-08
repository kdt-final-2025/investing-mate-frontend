import { API_URL } from '@/env/constants';
import { API_BASE } from '@/service/baseAPI';

export interface Board {
  id: number;
  boardName: string;
  postCount: number;
}

// 게시판 생성
export async function createBoard(boardName: string, token: string) {
  const res = await fetch(`${API_URL}/boards`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ boardName }),
  });
  if (!res.ok) throw new Error('게시판 생성 실패');
  return res.json();
}

// 전체 게시판 목록 조회
export async function getBoards(): Promise<Board[]> {
  const res = await fetch(`${API_BASE}/boards`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('게시판 목록 조회 실패');
  // JSON이 [ { id:…, boardName:…, postCount:… }, … ] 형태라고 가정
  const data: Board[] = await res.json();
  return data;
}
