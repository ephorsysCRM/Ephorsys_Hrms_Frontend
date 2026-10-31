import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <  1) {
    return null
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const getPages = () => {
    const pages = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      )
    } else {
      pages.push(
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
      )
    }

    return pages
  }

  return (
    <div className='border-t border-gray-100 bg-white px-3 py-4 sm:px-5'>
      <div className='flex items-center justify-between gap-2'>
        {/* Previous Button */}
        <button
          type='button'
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className='
            group flex shrink-0 items-center justify-center gap-1.5
            rounded-full
            border border-gray-200
            bg-white
            px-3 py-2
            text-sm font-medium text-gray-600
            shadow-sm
            transition-all duration-200

            hover:border-black
            hover:bg-black
            hover:text-white
            hover:shadow-md

            disabled:cursor-not-allowed
            disabled:border-gray-100
            disabled:bg-gray-50
            disabled:text-gray-300
            disabled:shadow-none

            sm:gap-2
            sm:px-4
            sm:py-2.5
          '
        >
          <ChevronLeft
            size={17}
            strokeWidth={2}
            className='
              transition-transform duration-200
              group-hover:-translate-x-0.5
            '
          />

          <span className='hidden sm:block'>Previous</span>
        </button>

        {/* Page Numbers */}
        <div
          className='
            flex min-w-0 items-center gap-0.5
            rounded-full
            bg-gray-50
            p-1
            sm:gap-1.5
          '
        >
          {getPages().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  className='
                    flex h-8 w-7
                    items-center justify-center
                    rounded-full
                    text-xs font-medium
                    text-gray-400
                    sm:h-9 sm:w-9 sm:text-sm
                  '
                >
                  •••
                </span>
              )
            }

            return (
              <button
                key={page}
                type='button'
                onClick={() => onPageChange(page)}
                className={`
                  flex h-8 min-w-8
                  items-center justify-center
                  rounded-full
                  px-2
                  text-xs font-medium
                  transition-all duration-200

                  sm:h-9 sm:min-w-9
                  sm:px-3
                  sm:text-sm

                  ${
                    currentPage === page
                      ? 'bg-black text-white shadow-md'
                      : 'text-gray-600 hover:bg-white hover:text-black hover:shadow-sm'
                  }
                `}
              >
                {page}
              </button>
            )
          })}
        </div>

        {/* Next Button */}
        <button
          type='button'
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className='
            group flex shrink-0 items-center justify-center gap-1.5
            rounded-full
            border border-gray-200
            bg-white
            px-3 py-2
            text-sm font-medium text-gray-600
            shadow-sm
            transition-all duration-200

            hover:border-black
            hover:bg-black
            hover:text-white
            hover:shadow-md

            disabled:cursor-not-allowed
            disabled:border-gray-100
            disabled:bg-gray-50
            disabled:text-gray-300
            disabled:shadow-none

            sm:gap-2
            sm:px-4
            sm:py-2.5
          '
        >
          <span className='hidden sm:block'>Next</span>

          <ChevronRight
            size={17}
            strokeWidth={2}
            className='
              transition-transform duration-200
              group-hover:translate-x-0.5
            '
          />
        </button>
      </div>
    </div>
  )
}

export default Pagination
