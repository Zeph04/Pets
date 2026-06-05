import { clsx } from 'clsx'

export function Skeleton({ className, rows = 1, ...props }) {
  if (rows > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={clsx('skeleton h-4', i === rows - 1 && 'w-3/4', className)} {...props} />
        ))}
      </div>
    )
  }
  return <div className={clsx('skeleton', className)} {...props} />
}

export function PetCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="skeleton h-52 rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="skeleton h-5 w-28 rounded-lg" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="skeleton h-4 w-20 rounded-lg" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-2/3 rounded-lg" />
        <div className="skeleton h-9 w-full rounded-xl mt-2" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="animate-pulse border-b border-neutral-200 dark:border-neutral-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 rounded w-full" />
        </td>
      ))}
    </tr>
  )
}
