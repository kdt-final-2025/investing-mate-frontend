export interface CommentLikeResponse {
  commentId: number | undefined;
  likeCount: number;
  likedByMe: boolean;
}

export interface CommentResponse {
  commentId: string;
  userId: string;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
  children: Comment[];
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
  postId: string;
  parentId?: string | null;
  content: string;
}
