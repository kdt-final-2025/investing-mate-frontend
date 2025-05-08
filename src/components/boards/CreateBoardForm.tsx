'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBoard } from '@/service/boards';

export default function CreateBoardForm() {
  const [boardName, setBoardName] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!boardName.trim()) {
      setError('게시판명을 입력해주세요.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await createBoard({ boardName });
      router.push('/boards');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-[#1F2733] p-6 rounded-2xl shadow"
    >
      <label htmlFor="boardName" className="block text-white mb-2">
        게시판명
      </label>
      <input
        id="boardName"
        name="boardName"
        type="text"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        disabled={isLoading}
        className="w-full p-2 rounded bg-[#2A2F36] text-white mb-4 focus:outline-none focus:ring-2 focus:ring-[#4A5B68]"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 bg-[#3B4754] hover:bg-[#4A5B68] text-white font-semibold rounded transition ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? '생성 중...' : '게시판 생성'}
      </button>
    </form>
  );
}
