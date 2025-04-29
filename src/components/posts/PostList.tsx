'use client';

import { useState } from 'react';
import { PostItem } from './PostItem';
import { fetchPosts } from './post.service';

type Post = {
  id: number;
  postTitle: string;
  userId: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
};

interface Props {
  initialPosts: Post[];
  boardId: string;
}

export function PostList({ initialPosts, boardId }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1); // 첫 페이지는 이미 불러왔으니까 1로 시작
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    const newPosts = await fetchPosts(boardId, page);
    if (newPosts.length === 0) {
      setHasMore(false);
      return;
    }
    setPosts((prev) => [...prev, ...newPosts]);
    setPage((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">게시글 목록</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
          >
            더 보기
          </button>
        </div>
      )}
    </div>
  );
}
