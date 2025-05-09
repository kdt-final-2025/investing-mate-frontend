'use client';

import Link from 'next/link';

type Post = {
  id: number;
  postTitle: string;
  userId: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
};

export function PostItemClient({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.id}`} // 경로 수정 (app 디렉토리 구조에 맞게)
      className="block mb-4 bg-[#1E222D] p-4 rounded-xl shadow hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold text-white">{post.postTitle}</h3>
      <div className="mt-1 text-sm text-gray-400 flex space-x-4">
        <span>작성자: {post.userId}</span>
        <span>조회수: {post.viewCount}</span>
        <span>댓글: {post.commentCount}</span>
        <span>좋아요: {post.likeCount}</span>
      </div>
    </Link>
  );
}
