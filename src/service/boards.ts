import { API_URL } from '@/env/constants';

export type Board = {
    id: number;
    boardName: string;
    postCount: number;
};

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

// 게시판 전체 목록 조회
export async function getBoards(token: string): Promise<Board[]> {
    const res = await fetch(`${API_URL}/boards`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('게시판 목록 조회 실패');
    const data = await res.json();
    return data.BoardResponse;
}
