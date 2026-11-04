import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DiscoveryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  totalLessons?: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
  summaryText?: string;
  itemLabel?: string;
  showSinglePage?: boolean;
}

export function getDiscoveryPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
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

export const DiscoveryPagination: React.FC<DiscoveryPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  totalLessons,
  itemsPerPage,
  onPageChange,
  ariaLabel,
  summaryText,
  itemLabel,
  showSinglePage = false,
}) => {
  const { t, i18n } = useTranslation('discovery');
  const isEn = i18n.language === 'en';

  const count = totalItems ?? totalLessons ?? 0;
  if (count === 0 || (totalPages <= 1 && !showSinglePage)) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, count);
  const pages = getDiscoveryPageNumbers(currentPage, totalPages);

  const defaultSummary = isEn
    ? `Showing ${startIdx}–${endIdx} of ${count} ${itemLabel || 'series'}`
    : `Hiển thị ${startIdx}–${endIdx} trên ${count} ${itemLabel || 'chuỗi bài'}`;

  return (
    <nav className="journey-pagination" aria-label={ariaLabel || t('journey.pagination_aria', { defaultValue: 'Series pagination' })}>
      <div className="journey-pagination-info" role="status">
        {summaryText || defaultSummary}
      </div>

      <div className="journey-pagination-controls">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="journey-pagination-button journey-pagination-prev"
          title={t('pagination.prev_page', { defaultValue: 'Previous page' })}
          aria-label={t('pagination.prev_page', { defaultValue: 'Previous page' })}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="journey-pagination-pages">
          {pages.map((item, idx) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${idx}`} className="journey-pagination-ellipsis" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={currentPage === item ? 'page' : undefined}
                aria-label={t('pagination.page_number', { page: item, defaultValue: isEn ? `Page ${item}` : `Trang ${item}` })}
                className="journey-pagination-button"
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
          className="journey-pagination-button journey-pagination-next"
          title={t('pagination.next_page', { defaultValue: 'Next page' })}
          aria-label={t('pagination.next_page', { defaultValue: 'Next page' })}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

export default DiscoveryPagination;
