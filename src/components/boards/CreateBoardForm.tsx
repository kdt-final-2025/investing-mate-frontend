'use client';

import { useState } from 'react';
import { createBoard } from '@/service/boards';

export default function CreateBoardForm() {
    const [boardName, setBoardName] = useState('');

    const handleCreate = async () => {
        try {
            await createBoard(boardName, 'your_token_here');
            alert('게시판 생성 완료');
            setBoardName('');
        } catch (e: any) {
            alert(e.message);
        }
    };

    return (
        <div className="p-4">
            <input
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="게시판 이름"
                className="border p-2 mr-2"
            />
            <button onClick={handleCreate} className="px-4 py-2 bg-blue-500 text-white rounded">
                생성
            </button>
        </div>
    );
}
