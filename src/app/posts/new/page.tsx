'use client';

import { useState } from 'react';
import { API_URL } from '@/env/constants';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const [postTitle, setPostTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer your_token_here',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postTitle, content, imageUrls: [] }),
    });
    if (res.ok) {
      alert('게시글 작성 완료');
      router.push('/posts');
    } else {
      alert('작성 실패');
    }
  };

  return (
    <div>
      <input
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        placeholder="제목"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
      />
      <button onClick={handleCreate}>작성</button>
    </div>
  );
}
