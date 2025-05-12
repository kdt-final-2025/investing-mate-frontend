// src/hooks/usePosts/useIsAuthor.ts
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getSessionOrThrow } from '@/utils/auth';

// 주어진 작성자 ID와 현재 세션 유저 ID를 비교해 작성자 여부를 반환하는 훅
// @param authorId 게시글 작성자 ID
// @returns 작성자 여부 (boolean)

export function useIsAuthor(authorId: string): boolean {
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const supabase = createClient();
        const session = await getSessionOrThrow(supabase);
        if (mounted) {
          setIsAuthor(session.user.id === authorId);
        }
      } catch {
        if (mounted) {
          setIsAuthor(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [authorId]);

  return isAuthor;
}
