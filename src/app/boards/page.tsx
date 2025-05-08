// src/app/boards/page.tsx
import Link from 'next/link';
import { getBoards, Board } from '@/service/boards';

export default async function BoardsPage() {
  // 1) 수정된 서비스 함수 호출
  const boards: Board[] = await getBoards();

  return (
    <main className="min-h-screen bg-[#131722] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">게시판 목록</h1>
      <table className="w-full text-left bg-[#1f2733] rounded overflow-hidden">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">게시판명</th>
            <th className="px-4 py-2">게시글 수</th>
          </tr>
        </thead>
        <tbody>
          {boards.map((b) => (
            <tr
              key={b.id}
              className="border-t border-[#2a2f36] hover:bg-[#2a2f36]"
            >
              <td className="px-4 py-2">{b.id}</td>
              <td className="px-4 py-2">
                <Link href={`/boards/${b.id}`}>
                  <span className="text-blue-300 hover:underline">
                    {b.boardName}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-2">{b.postCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
