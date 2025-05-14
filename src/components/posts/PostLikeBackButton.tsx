// src/components/ui/PostLikeBackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function PostLikeBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="px-4 py-2 rounded-full text-sm text-pink-400 border-2 border-pink-400 bg-transparent
                       hover:bg-pink-400 hover:text-white transition-colors"
    >
      ← 돌아가기
    </button>
  );
}
