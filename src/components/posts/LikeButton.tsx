'use client';

import { useState } from 'react';
import { API_URL } from '@/env/constants';

export async function LikeButton({
  postId,
  likedByMe,
  onUnlike,
}: {
  postId: number;
  likedByMe: boolean;
  onUnlike?: (postId: number) => void;
}) {
  const [liked, setLiked] = useState(likedByMe);

  const toggleLike = async () => {
    const res = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: liked ? 'DELETE' : 'POST',
      headers: {
        Authorization: 'Bearer your_token_here',
      },
    });

    if (res.ok) {
      setLiked(!liked);
      if (liked && onUnlike) {
        onUnlike(postId); // 좋아요 취소 -> 목록에서도 제거
      }
    }
  };

  return (
    <button
      onClick={toggleLike}
      className="text-xs text-blue-400 hover:text-blue-500"
    >
      {liked ? '좋아요 취소' : '좋아요'}
    </button>
  );
}
