import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface DictionaryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalDecks: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
}

export const DictionaryPagination: React.FC<DictionaryPaginationProps> = ({
  currentPage,
  totalPages,
  totalDecks,
  itemsPerPage,
  onPageChange,
}) => {
  const { t } = useTranslation('flashcards');

  if (totalDecks === 0 || totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalDecks);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="vocab-pagination" aria-label={t('pagination.aria_label', 'Vocabulary pagination')}>
      <div className="vocab-pagination-info" role="status">
        {t('pagination.showing', { start: startIdx, end: endIdx, total: totalDecks, defaultValue: `Showing ${startIdx}–${endIdx} of ${totalDecks} decks` })}
      </div>

      <div className="vocab-pagination-controls">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="vocab-pagination-button vocab-pagination-prev"
          title={t('pagination.prev_page', 'Previous page')}
          aria-label={t('pagination.prev_page', 'Previous page')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="vocab-pagination-pages">
          {pages.map((item, idx) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${idx}`} className="vocab-pagination-ellipsis" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={currentPage === item ? 'page' : undefined}
                aria-label={t('pagination.page_number', { page: item, defaultValue: `Page ${item}` })}
                className="vocab-pagination-button"
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="vocab-pagination-button vocab-pagination-next"
          title={t('pagination.next_page', 'Next page')}
          aria-label={t('pagination.next_page', 'Next page')}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
