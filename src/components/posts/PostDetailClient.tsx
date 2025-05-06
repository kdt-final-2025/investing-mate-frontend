'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { togglePostLike } from '@/service/posts';
import { API_URL } from '@/env/constants';

interface PostProps {
  initialPost: {
    postTitle: string;
    content: string;
    likedByMe: boolean;
    // 기타 필요한 속성
  };
  postId: string;
}

export default function PostDetailClient({ initialPost, postId }: PostProps) {
  const [liked, setLiked] = useState(initialPost.likedByMe);
  const [isEditing, setIsEditing] = useState(false);
  const [postTitle, setPostTitle] = useState(initialPost.postTitle);
  const [content, setContent] = useState(initialPost.content);
  const router = useRouter();

  const handleToggleLike = async () => {
    const success = await togglePostLike(postId, liked);
    if (success) setLiked((prev) => !prev);
  };

  const handleEdit = async () => {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer your_token_here',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postTitle, content, imageUrls: [] }),
    });
    if (res.ok) {
      alert('수정 완료');
      setIsEditing(false);
      router.refresh(); // 페이지 데이터 갱신
    } else alert('수정 실패');
  };

  const handleDelete = async () => {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer your_token_here' },
    });
    if (res.ok) router.push('/posts');
    else alert('삭제 실패');
  };

  return (
    <>
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="w-full bg-[#2A2E39] p-2 rounded text-white"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#2A2E39] p-2 rounded min-h-[200px] text-white"
          />
          <div className="flex space-x-4">
            <button
              onClick={handleEdit}
              className="px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
            >
              저장
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="flex space-x-4">
          <button
            onClick={handleToggleLike}
            className="px-4 py-1 bg-[#2A2E39] hover:bg-[#363B47] rounded-lg text-sm"
          >
            {liked ? '좋아요 취소' : '좋아요'}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
          >
            삭제
          </button>
        </div>
      )}
    </>
  );
}
