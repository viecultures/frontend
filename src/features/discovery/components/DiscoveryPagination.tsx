import React from 'react';
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
        Hiển thị <strong className="text-heritage-green">{startIdx}</strong> -{' '}
        <strong className="text-heritage-green">{endIdx}</strong> trên tổng số{' '}
        <strong className="text-heritage-green">{totalLessons}</strong> bài học
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handlePageSelect(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-xl bg-warm-ivory border border-heritage-green/14 text-heritage-green disabled:opacity-40 disabled:cursor-not-allowed hover:bg-mist-cloud transition-all shadow-xs cursor-pointer"
          title="Trang trước"
          aria-label="Trang trước"
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
          title="Trang sau"
          aria-label="Trang sau"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DiscoveryPagination;
