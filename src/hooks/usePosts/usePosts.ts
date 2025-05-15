// src/hooks/usePosts.ts
import { useState } from 'react';
import type { CreatePostRequest } from '@/types/posts';
import { createPost, updatePost } from '@/service/posts';
import { uploadImage } from '@/service/s3';

export function usePosts(boardId: number) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File): Promise<string> => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      setUploadedUrls((prev) => [...prev, url]);
      return url;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setUploading(false);
    }
  };

  const handleCreatePost = async (data: {
    postTitle: string;
    content: string;
  }) => {
    const payload: CreatePostRequest = {
      boardId,
      postTitle: data.postTitle,
      content: data.content,
      imageUrls: uploadedUrls,
    };
    return await createPost(payload);
  };

  const handleUpdatePost = async (
    postId: number,
    data: { postTitle: string; content: string }
  ) => {
    const payload: CreatePostRequest = {
      boardId,
      postTitle: data.postTitle,
      content: data.content,
      imageUrls: uploadedUrls,
    };
    return await updatePost(postId, payload);
  };

  return {
    uploadedUrls,
    uploading,
    error,
    handleImageUpload,
    handleCreatePost,
    handleUpdatePost,
  };
}
