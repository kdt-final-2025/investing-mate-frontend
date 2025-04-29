'use client';

import { useState } from 'react';
import { API_URL } from '@/env/constants';

export default function CreateBoardPage() {
  const [boardName, setBoardName] = useState('');

  const handleCreate = async () => {
    await fetch(`${API_URL}/boards`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer your_token_here',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ boardName }),
    });
    alert('게시판 생성 완료');
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
