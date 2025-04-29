import { BoardList } from '@/components/boards/BoardList';
import { API_URL } from '@/env/constants';

export const dynamic = 'force-dynamic';

export default async function BoardsPage() {
  try {
    const res = await fetch(`${API_URL}/boards`, {
      headers: { Authorization: 'Bearer your_token_here' },
      cache: 'no-store',
    });

    if (!res.ok) {
      // 서버에서 에러 응답
      throw new Error('서버 응답 실패');
    }

    const data = await res.json();

    return <BoardList boards={data.BoardResponse} />;
  } catch (error) {
    // 에러 발생 시 fallback UI
    return <div>게시판 데이터를 불러올 수 없습니다.</div>;
  }
}
