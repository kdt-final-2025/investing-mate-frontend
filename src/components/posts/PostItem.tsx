// components/posts/PostItem.tsx
import Link from 'next/link';
import { PostListResponse } from '@/types/posts'; // 실제 경로로 수정

interface PostItemProps {
  post: PostListResponse;
}

export function PostItem({ post }: PostItemProps) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block mb-4 bg-[#1E222D] p-4 rounded-xl shadow hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold text-white">{post.postTitle}</h3>
      <div className="mt-1 text-sm text-gray-400 flex space-x-4">
        <span>작성자: {post.userId}</span>
        <span>조회수: {post.viewCount}</span>
        <span>댓글: {post.commentCount}</span>
        <span>좋아요: {post.likeCount}</span>
        <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
