export interface CommentLikeResponse {
  commentId: number | undefined;
  likeCount: number;
  likedByMe: boolean;
}

export interface CommentResponse {
  commentId: number;
  userId: string;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
  children: CommentLikeResponse[];
}

export interface Pagemeta {
  totalPage: number;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
export interface CommentResponseAndPaging {
  items: CommentResponse[];
  pageMeta: Pagemeta;
}

export interface CreateCommentRequest {
  postId: number;
  parentId?: number;
  content: string;
}
// 댓글 및 대댓글 인터페이스
export interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  parentId?: number;
  replies?: Comment[]; // 대댓글 배열
}

export interface PaginatedCommentResponse {
  totalPage: number;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: Comment[];
}
