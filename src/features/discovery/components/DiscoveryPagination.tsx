import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DiscoveryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalLessons: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const DiscoveryPagination: React.FC<DiscoveryPaginationProps> = ({
  currentPage,
  totalPages,
  totalLessons,
  itemsPerPage,
  onPageChange,
}) => {
  const { t } = useTranslation('discovery');

  if (totalLessons === 0 || totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalLessons);

  const handlePageSelect = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rice-paper/80 border border-heritage-green/12">
      <div className="text-xs font-semibold text-text-secondary">
        {t('pagination.showing_summary', {
          start: startIdx,
          end: endIdx,
          total: totalLessons,
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handlePageSelect(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-xl bg-warm-ivory border border-heritage-green/14 text-heritage-green disabled:opacity-40 disabled:cursor-not-allowed hover:bg-mist-cloud transition-all shadow-xs cursor-pointer"
          title={t('pagination.prev_page')}
          aria-label={t('pagination.prev_page')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => handlePageSelect(page)}
              className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-heritage-green text-warm-ivory shadow-xs border border-antique-gold/50 scale-105'
                  : 'bg-warm-ivory text-text-body hover:bg-mist-cloud border border-heritage-green/10'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => handlePageSelect(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl bg-warm-ivory border border-heritage-green/14 text-heritage-green disabled:opacity-40 disabled:cursor-not-allowed hover:bg-mist-cloud transition-all shadow-xs cursor-pointer"
          title={t('pagination.next_page')}
          aria-label={t('pagination.next_page')}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DiscoveryPagination;