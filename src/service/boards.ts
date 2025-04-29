import { API_URL } from '@/env/constants';

export async function createBoard(boardName: string, token: string) {
    const res = await fetch(`${API_URL}/boards`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boardName }),
    });

    if (!res.ok) {
        throw new Error('게시판 생성 실패');
    }

    return res.json();
}
