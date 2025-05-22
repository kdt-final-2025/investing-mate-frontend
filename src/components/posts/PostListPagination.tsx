import Link from 'next/link';

interface PostListPaginationProps {
  boardId: number;
  totalPages: number;
  currentPage: number;
  searchTerm?: string;
  direction?: 'DESC' | 'ASC' | undefined;
}

export function PostListPagination({
  boardId,
  totalPages,
  currentPage,
  searchTerm,
  direction,
}: PostListPaginationProps) {
  return (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
        const params = new URLSearchParams();
        params.set('page', num.toString());
        if (searchTerm) params.set('postTitle', searchTerm);
        if (direction) params.set('direction', direction);
        const href = `/boards/${boardId}/posts?${params.toString()}`;

        return (
          <Link
            key={num}
            href={href}
            className={`px-4 py-2 rounded-lg text-white text-sm transition ${
              num === currentPage
                ? 'bg-[#4a5b68]'
                : 'bg-[#3b4754] hover:bg-[#4a5b68]'
            }`}
          >
            {num}
          </Link>
        );
      })}
    </div>
  );
}
