// mock/comments.mock.ts

export type Comment = {
  id: number;
  postId: number;
  userId: string;
  content: string;
  createdAt: string;
  likeCount: number;
};

export const MOCK_COMMENTS: Comment[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  postId: 1, // 테스트용 postId
  userId: `user${i + 1}`,
  content: `This is mock comment ${i + 1}`,
  createdAt: new Date().toISOString(),
  likeCount: Math.floor(Math.random() * 10),
}));

export async function fetchMockComments(postId: number) {
  const filtered = MOCK_COMMENTS.filter((c) => c.postId === postId);
  return new Promise<Comment[]>((resolve) =>
    setTimeout(() => resolve(filtered), 300)
  );
}
