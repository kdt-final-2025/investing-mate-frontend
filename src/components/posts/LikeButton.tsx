// src/components/posts/LikeButton.tsx
'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/service/posts';

interface LikeButtonProps {
  // 게시글 ID
  postId: number;
  // 초기 좋아요 여부
  initialLiked: boolean;
  // 초기 좋아요 카운트
  initialCount: number;
  className?: string;
}

export default function LikeButton({
  postId,
  initialLiked,
  initialCount,
  className = '',
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await toggleLike(postId);
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (err) {
      console.error('좋아요 토글 중 오류 발생:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center space-x-1 hover:text-red-400 transition text-sm ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
      <span>{likeCount}</span>
    </button>
  );
}
