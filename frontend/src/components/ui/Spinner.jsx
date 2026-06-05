import { clsx } from 'clsx'

export function Spinner({ size = 'md', className }) {
  const sizes = {
    xs: 'h-3 w-3 border',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-[3px]',
    xl: 'h-16 w-16 border-4',
  }
  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-brand-500 border-t-transparent',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}
