import type { PaginationMeta } from '@/types/pagination';

type PaginationProps = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
};

function getPageNumbers(currentPage: number, totalPages: number): number[] {
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible - 1);

  start = Math.max(1, end - maxVisible + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, hasNext, hasPrev, totalPages } = pagination;

  if (!hasPrev && !hasNext && page === 1 && totalPages === 1) {
    return null;
  }

  const pageNumbers =
    totalPages && totalPages > 1 ? getPageNumbers(page, totalPages) : [page];

  return (
    <nav className="pagination" aria-label="Repository pages">
      <button
        type="button"
        className="pagination__control"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
      >
        Previous
      </button>

      <ul className="pagination__pages">
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber}>
            <button
              type="button"
              className="pagination__page"
              aria-current={pageNumber === page ? 'page' : undefined}
              onClick={() => onPageChange(pageNumber)}
              disabled={pageNumber === page}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="pagination__control"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
      >
        Next
      </button>
    </nav>
  );
}
