import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export function Pagination({ currentPage, lastPage, onPageChange, className }) {
  if (lastPage <= 1) return null

  const pages = getPaginationRange(currentPage, lastPage)

  return (
    <div className={clsx('flex items-center justify-center gap-1.5', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page, idx) =>
        page === '…' ? (
          <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-neutral-600">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={clsx(
              'w-9 h-9 rounded-xl text-sm font-medium transition-all',
              page === currentPage
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

function getPaginationRange(current, last) {
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  let prev = 0
  for (const page of range) {
    if (prev && page - prev > 1) {
      rangeWithDots.push('…')
    }
    rangeWithDots.push(page)
    prev = page
  }

  return rangeWithDots
}
