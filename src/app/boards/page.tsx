import { getBoards } from '@/service/boards';
import { BoardList } from '@/components/boards/BoardList';

export default async function BoardsPage() {
  const boards = await getBoards('your_token_here');
  return <BoardList boards={boards} />;
}
