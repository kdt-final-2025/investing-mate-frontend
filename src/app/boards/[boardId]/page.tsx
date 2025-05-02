// src/app/boards/[boardId]/page.tsx
import React from 'react';

type Props = { params: { boardId: string } };

interface Board {
    id: number;
    boardName: string;
    postCount: number;
}

const mockData: { BoardResponse: Board[] } = {
    BoardResponse: [
        { id: 1, boardName: '자유게시판', postCount: 200 },
        { id: 2, boardName: '공지게시판', postCount: 10 },
    ],
};

const BoardDetailPage: React.FC<Props> = ({ params }) => {
    const { boardId } = params;
    const boards = mockData.BoardResponse;

    return (
        <div className="min-h-screen bg-[#131722] text-white p-8">
            <h1 className="text-2xl font-bold mb-6">게시판 목록</h1>
            <div className="overflow-x-auto bg-[#1f2733] rounded">
                <table className="w-full text-left">
                    <thead>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">게시판명</th>
                        <th className="px-4 py-2">게시글 수</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boards.map((board) => (
                        <tr key={board.id} className="border-t border-[#2a2f36]">
                            <td className="px-4 py-2">{board.id}</td>
                            <td className="px-4 py-2">{board.boardName}</td>
                            <td className="px-4 py-2">{board.postCount}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <button className="mt-6 px-4 py-2 bg-[#3b4754] rounded hover:bg-[#4a5b68]">
                돌아가기
            </button>
        </div>
    );
};

export default BoardDetailPage;