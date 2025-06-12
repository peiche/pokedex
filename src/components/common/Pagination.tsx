import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
  showPageInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void; // For client-side pagination
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  baseUrl,
  className = '',
  showPageInfo = false,
  totalItems,
  itemsPerPage = 20,
  onPageChange
}) => {
  const navigate = useNavigate();
  
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null;

  const generatePageUrl = (page: number): string => {
    // Handle homepage pagination
    if (baseUrl === '/') {
      return page === 1 ? '/' : `/page/${page}`;
    }
    
    // Handle type pages
    if (baseUrl.startsWith('/type/')) {
      return page === 1 ? baseUrl : `${baseUrl}/page/${page}`;
    }
    
    // Handle abilities page (client-side pagination)
    if (baseUrl === '/abilities') {
      return `${baseUrl}?page=${page}`;
    }
    
    // Default case
    return page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
  };

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      // Client-side pagination
      onPageChange(page);
    } else {
      // URL-based pagination
      navigate(generatePageUrl(page));
    }
  };

  const generatePageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    
    // Handle edge case: 7 or fewer pages - show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    // Determine the range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust range if we're near the beginning
    if (currentPage <= 3) {
      startPage = 2;
      endPage = 4;
    }

    // Adjust range if we're near the end
    if (currentPage >= totalPages - 2) {
      startPage = totalPages - 3;
      endPage = totalPages - 1;
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('ellipsis');
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('ellipsis');
    }

    // Always show last page (if it's not already included)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const PaginationButton: React.FC<{ 
    page: number; 
    disabled?: boolean; 
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
  }> = ({ page, disabled = false, children, className: buttonClassName = '', 'aria-label': ariaLabel }) => {
    if (onPageChange) {
      return (
        <button
          onClick={() => !disabled && handlePageClick(page)}
          disabled={disabled}
          className={buttonClassName}
          aria-label={ariaLabel}
        >
          {children}
        </button>
      );
    }

    return (
      <Link
        to={!disabled ? generatePageUrl(page) : '#'}
        className={buttonClassName}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav 
      className={`flex flex-col items-center gap-4 ${className}`}
      aria-label="Pagination navigation"
    >
      {/* Page info */}
      {showPageInfo && totalItems && (
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
        </div>
      )}

      {/* Mobile pagination - Previous/Next only */}
      <div className="flex sm:hidden items-center justify-between w-full max-w-xs gap-4">
        {/* Previous button */}
        <PaginationButton
          page={currentPage - 1}
          disabled={!hasPrevious}
          aria-label="Go to previous page"
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
            min-h-[44px] flex-1 justify-center
            ${hasPrevious
              ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </PaginationButton>

        {/* Page indicator */}
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium px-2">
          {currentPage} / {totalPages}
        </div>

        {/* Next button */}
        <PaginationButton
          page={currentPage + 1}
          disabled={!hasNext}
          aria-label="Go to next page"
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
            min-h-[44px] flex-1 justify-center
            ${hasNext
              ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
            }
          `}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </PaginationButton>
      </div>

      {/* Desktop pagination - Full pagination with page numbers */}
      <div className="hidden sm:flex items-center gap-1 md:gap-2">
        {/* Previous button */}
        <PaginationButton
          page={currentPage - 1}
          disabled={!hasPrevious}
          aria-label="Go to previous page"
          className={`
            flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
            min-h-[44px] min-w-[44px] justify-center
            ${hasPrevious
              ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden md:inline">Previous</span>
        </PaginationButton>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              );
            }

            const isCurrentPage = page === currentPage;
            
            return (
              <PaginationButton
                key={page}
                page={page}
                aria-label={isCurrentPage ? `Current page, page ${page}` : `Go to page ${page}`}
                className={`
                  flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-all
                  min-h-[44px] min-w-[44px]
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                  ${isCurrentPage
                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                  }
                `}
              >
                {page}
              </PaginationButton>
            );
          })}
        </div>

        {/* Next button */}
        <PaginationButton
          page={currentPage + 1}
          disabled={!hasNext}
          aria-label="Go to next page"
          className={`
            flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
            min-h-[44px] min-w-[44px] justify-center
            ${hasNext
              ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
            }
          `}
        >
          <span className="hidden md:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </PaginationButton>
      </div>
    </nav>
  );
};