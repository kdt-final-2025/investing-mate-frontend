// src/hooks/useCreateBoard.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBoard } from '@/service/boards';

export function useCreateBoard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  async function submit(boardName: string) {
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
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, submit };
}
