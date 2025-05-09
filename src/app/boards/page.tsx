// src/app/boards/page.tsx
import { BoardList } from '@/components/boards/BoardList';
import { getBoards } from '@/service/boards';

export default async function BoardsPage() {
  const boards = await getBoards();

  return (
    <main className="min-h-screen bg-[#131722] p-8">
      <BoardList boards={boards} />
    </main>
  );
}
