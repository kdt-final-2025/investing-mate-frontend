'use client';

import { useState, useEffect } from 'react';
import { fetchLikedPosts } from '@/service/posts';
import { PostsLikedAndPagingResponse, PostsLikedResponse } from '@/types/posts';


export function useLikePosts(pageNumber: number = 0) {
  const [posts, setPosts] = useState<PostsLikedResponse[]>([]);
  const [pageInfo, setPageInfo] = useState<
    PostsLikedAndPagingResponse['pageInfo'] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    async function load() {
      try {
        const data = await fetchLikedPosts(pageNumber);
        setPosts(data.likedPostsResponse);
        setPageInfo(data.pageInfo);
      } catch (e) {
        console.error('좋아요한 게시글 로딩 오류', e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [pageNumber]);

  return { posts, pageInfo, loading };
}
