import { clsx } from 'clsx'

const statusMap = {
  available:   'badge-available',
  pending:     'badge-pending',
  adopted:     'badge-adopted',
  rejected:    'badge-rejected',
  reviewing:   'badge-reviewing',
  approved:    'badge-approved',
  unavailable: 'badge bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  completed:   'badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  admin:       'badge-admin',
  staff:       'badge bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  adopter:     'badge bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
}

export function Badge({ children, status, className }) {
  return (
    <span className={clsx(status ? statusMap[status] : 'badge', className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const labels = {
    available:   '● Available',
    pending:     '● Pending',
    adopted:     '● Adopted',
    rejected:    '✕ Rejected',
    reviewing:   '◎ Reviewing',
    approved:    '✓ Approved',
    unavailable: '○ Unavailable',
    completed:   '✓ Completed',
  }
  return <Badge status={status}>{labels[status] ?? status}</Badge>
}
