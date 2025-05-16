// types/comments.ts
export interface CommentResponse {
  commentId: number;
  userId: string;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  parentId: number | null; // 부모 댓글 ID (null이면 최상위 댓글)
  createdAt: string;
  children: CommentResponse[]; // 자식 댓글 배열
}

export interface PageMeta {
  totalPage: number;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CommentResponseAndPaging {
  items: CommentResponse[];
  pageMeta: PageMeta;
}

export interface CreateCommentRequest {
  postId: number;
  parentId?: number | null; // 부모 댓글 ID (null이면 최상위 댓글)
  content: string;
}

export interface CommentLikeResponse {
  commentId: number;
  likeCount: number;
  likedByMe: boolean;
}
