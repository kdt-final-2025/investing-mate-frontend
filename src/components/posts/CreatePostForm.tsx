'use client';

import { useState } from 'react';
import { useCreateBoard } from '@/hooks/useCreateBoard';

export default function CreateBoardForm() {
  const [boardName, setBoardName] = useState('');
  const { isLoading, error, submit } = useCreateBoard();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(boardName);
      }}
    >
      {/* ... */}
      <input
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        disabled={isLoading}
        /* ... */
      />
      {error && <p className="text-red-500">{error}</p>}
      <button disabled={isLoading}>
        {isLoading ? '생성 중...' : '게시판 생성'}
      </button>
    </form>
  );
}
