'use client';

import { useState } from 'react';
import { createBoard } from '../../service/boards';

export default function CreateBoardForm() {
    const [boardName, setBoardName] = useState('');

    const handleCreate = async () => {
        await createBoard(boardName, 'your_token_here');
        alert('생성 완료');
    };

    return (
        <div>
            <input
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="게시판 이름"
            />
            <button onClick={handleCreate}>생성</button>
        </div>
    );
}