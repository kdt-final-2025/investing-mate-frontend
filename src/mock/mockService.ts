// mock/posts.mock.ts

type Post = {
  id: number;
  postTitle: string;
  userId: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
};

const MOCK_POSTS: Post[] = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  postTitle: `Mock Post Title ${index + 1}`,
  userId: `user${index + 1}`,
  viewCount: Math.floor(Math.random() * 1000),
  commentCount: Math.floor(Math.random() * 20),
  likeCount: Math.floor(Math.random() * 50),
}));

export async function fetchMockPosts(
  boardId: string,
  pageNumber = 0,
  size = 10
) {
  const start = pageNumber * size;
  const end = start + size;
  const paginated = MOCK_POSTS.slice(start, end);

  return new Promise<Post[]>((resolve) => {
    setTimeout(() => resolve(paginated), 300); // 네트워크 지연 시뮬레이션
  });
}
