// src/app/boards/[boardId]/page.tsx
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  author: string;
  createdAt: string; // ISO string
  likes: number;
};

// TODO: 실제 API 호출로 교체하고, params.boardId를 함께 전달하세요
const mockPosts: Record<string, Post[]> = {
  '1': [
    {
      id: 101,
      title: '첫 번째 게시글',
      author: '홍길동',
      createdAt: '2025-05-01T10:00:00Z',
      likes: 5,
    },
    {
      id: 102,
      title: '두 번째 게시글',
      author: '이영희',
      createdAt: '2025-05-03T14:30:00Z',
      likes: 2,
    },
  ],
  '2': [
    {
      id: 201,
      title: '공지사항 1',
      author: '관리자',
      createdAt: '2025-04-28T09:00:00Z',
      likes: 10,
    },
  ],
};

interface Props {
  params: { boardId: string };
}

export default function BoardPostsPage({ params }: Props) {
  const { boardId } = params;
  const posts: Post[] = mockPosts[boardId] ?? [];

  return (
    <main className="min-h-screen bg-[#131722] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">게시판 {boardId}의 게시글</h1>

      <div className="overflow-x-auto bg-[#1f2733] rounded">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-2">번호</th>
              <th className="px-4 py-2">제목</th>
              <th className="px-4 py-2">작성자</th>
              <th className="px-4 py-2">작성일</th>
              <th className="px-4 py-2">좋아요</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-t border-[#2a2f36] hover:bg-[#2a2f36]"
                >
                  <td className="px-4 py-2">{post.id}</td>
                  <td className="px-4 py-2">
                    <Link href={`/boards/${boardId}/posts/${post.id}`}>
                      <span className="text-blue-300 hover:underline">
                        {post.title}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-2">{post.author}</td>
                  <td className="px-4 py-2">
                    {new Date(post.createdAt).toLocaleString('ko-KR')}
                  </td>
                  <td className="px-4 py-2">{post.likes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-2" colSpan={5}>
                  게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Link href="/boards">
          <button className="px-4 py-2 bg-[#3b4754] rounded hover:bg-[#4a5b68]">
            ← 게시판 목록으로
          </button>
        </Link>
      </div>
    </main>
  );
}
