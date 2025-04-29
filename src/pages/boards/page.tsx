import { BoardList } from '@/components/boards/BoardList';
import { API_URL } from '@/env/constants';

export const dynamic = 'force-dynamic';

export default async function BoardsPage() {
  const res = await fetch(`${API_URL}/boards`, {
    headers: { Authorization: 'Bearer your_token_here' },
    cache: 'no-store',
  });
  const data = await res.json();

  return <BoardList boards={data.BoardResponse} />;
}
