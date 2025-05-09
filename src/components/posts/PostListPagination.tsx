import Link from 'next/link';

interface PaginationProps {
  boardId: string;
  totalPages: number;
  currentPage: number;
}

export function Pagination({ boardId, totalPages, currentPage }: PaginationProps) {
  return (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <Link
          key={num}
          href={`/boards/${boardId}/posts?page=${num}`}
          className={`px-4 py-2 rounded-lg text-white text-sm transition ${
            num === currentPage ? 'bg-[#4a5b68]' : 'bg-[#3b4754] hover:bg-[#4a5b68]'
          }`}
        >
          {num}
        </Link>
      ))}
    </div>
  );
}
