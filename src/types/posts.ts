// src/types/posts.ts
export interface CreatePostRequest {
  boardId: number;
  postTitle: string;
  content: string;
  imageUrls: string[];
}

export interface DeletePostResponse {
  deletedAt: string;
}

export interface PageInfo {
  pageNumber: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PostDto {
  id: number;
  postTitle: string;
  userId: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  createdAt: string;
}

export interface PostListResponse {
  id: number;
  postTitle: string;
  userId: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  createdAt: string;
}

export interface PostListAndPagingResponse {
  boardName: string;
  postListResponse: PostListResponse[];
  pageInfo: PageInfo;
}

export interface PostResponse {
  boardId: number;
  id: number;
  postTitle: string;
  userId: string;
  viewCount: number;
  content: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
}

export interface PostLikeResponse {
  postId: number;
  liked: boolean;
  likeCount: number;
}

export interface PostsLikedResponse {
  boardId: number;
  boardName: string;
  postTitle: string;
  userId: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  createdAt: string;
}

export interface PostsLikedAndPagingResponse {
  likedPostsResponse: PostsLikedResponse[];
  pageInfo: PageInfo;
}
