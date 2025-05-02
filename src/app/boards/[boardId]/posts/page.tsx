// src/app/boards/[boardId]/posts/page.tsx
import React from 'react';

interface Props {
  params: { boardId: string };
  searchParams: {
    postTitle?: string;
    userId?: string;
    sortBy?: string;
    direction?: string;
    pageNumber?: string;
    size?: string;
  };
}

const PostsPage: React.FC<Props> = ({ params, searchParams }) => {
  const { boardId } = params;
  const {
    postTitle = '',
    userId = '',
    sortBy = 'createdAt',
    direction = 'desc',
    pageNumber = '1',
    size = '10',
  } = searchParams;

  return (
      <div className="min-h-screen bg-[#131722] text-white p-8">
        <h1 className="text-2xl font-bold mb-6">게시판: {boardId}</h1>

        <div className="flex flex-wrap items-center justify-between mb-4 space-y-4">
          {/* 검색 필터 */}
          <div className="flex flex-wrap gap-4">
            <input
                type="text"
                placeholder="제목 검색"
                defaultValue={postTitle}
                className="px-4 py-2 bg-[#1f2733] rounded focus:outline-none"
            />
            <input
                type="text"
                placeholder="작성자 검색"
                defaultValue={userId}
                className="px-4 py-2 bg-[#1f2733] rounded focus:outline-none"
            />
          </div>

          {/* 정렬 옵션 */}
          <div className="flex flex-wrap gap-4">
            <select
                defaultValue={sortBy}
                className="px-4 py-2 bg-[#1f2733] rounded focus:outline-none"
            >
              <option value="createdAt">생성 날짜</option>
              <option value="liked">좋아요 순</option>
            </select>
            <select
                defaultValue={direction}
                className="px-4 py-2 bg-[#1f2733] rounded focus:outline-none"
            >
              <option value="asc">오름차순</option>
              <option value="desc">내림차순</option>
            </select>
          </div>
        </div>

        {/* 게시글 목록 테이블 */}
        <div className="overflow-x-auto">
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
            {/* TODO: 실제 데이터를 map을 사용해 렌더링하세요 */}
            <tr>
              <td className="px-4 py-2" colSpan={5}>게시글이 없습니다.</td>
            </tr>
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6 space-x-2">
          {/* TODO: 페이지네이션 로직/컴포넌트를 연결하세요 */}
          <button className="px-3 py-1 bg-[#1f2733] rounded">이전</button>
          <span className="px-3 py-1">{pageNumber}</span>
          <button className="px-3 py-1 bg-[#1f2733] rounded">다음</button>
        </div>
      </div>
  );
};

export default PostsPage;