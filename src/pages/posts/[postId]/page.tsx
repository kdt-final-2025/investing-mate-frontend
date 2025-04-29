'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchPostDetail,
  togglePostLike,
} from '@/components/posts/post.service';
import { API_URL } from '@/env/constants';

interface Props {
  params: { postId: string };
}

export default function PostDetailPage({ params }: Props) {
  const { postId } = params;
  const [postTitle, setPostTitle] = useState('');
  const [content, setContent] = useState('');
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  const fetchPostData = async () => {
    const res = await fetch(`${API_URL}/posts/${postId}`);
    const data = await res.json();
    setPostTitle(data.postTitle);
    setContent(data.content);
    setLiked(data.likedByMe);
  };
  useEffect(() => {
    async function load() {
      const data = await fetchPostDetail(postId);
      setPostTitle(data.postTitle);
      setContent(data.content);
      setLiked(data.likedByMe);
    }
    load();
  }, [postId]);

  useEffect(() => {
    fetchPostData();
  }, [postId]);

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
      router.refresh();
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
    <div className="min-h-screen bg-[#131722] text-white container mx-auto p-6">
      <div className="bg-[#1E222D] p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">{postTitle}</h1>
        <p className="whitespace-pre-wrap mb-6">{content}</p>
        <div className="flex space-x-4">
          <button
            onClick={handleToggleLike}
            className="px-4 py-1 bg-[#2A2E39] hover:bg-[#363B47] rounded-lg text-sm"
          >
            {liked ? '좋아요 취소' : '좋아요'}
          </button>
          <button
            onClick={handleEdit}
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
      </div>
    </div>
  );
}
