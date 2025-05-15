// src/hooks/usePosts/usePostsImage.ts
import { useState } from 'react';
import type { CreatePostRequest } from '@/types/posts';
import { createPost, updatePost } from '@/service/posts';
import { uploadImage, deleteImage } from '@/service/s3';

export function usePostsImage(boardId: number) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File): Promise<string> => {
    setUploading(true);
    setError(null);
    try {
      return await uploadImage(file);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (key: string): Promise<void> => {
    setUploading(true);
    setError(null);
    try {
      await deleteImage(key);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setUploading(false);
    }
  };

  // now accepts full payload
  const handleCreatePost = (payload: CreatePostRequest) => {
    return createPost(payload);
  };

  const handleUpdatePost = (postId: number, payload: CreatePostRequest) => {
    return updatePost(postId, payload);
  };

  return {
    uploading,
    error,
    handleImageUpload,
    handleImageDelete,
    handleCreatePost,
    handleUpdatePost,
  };
}
