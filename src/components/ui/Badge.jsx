import { clsx } from 'clsx'

const statusConfig = {
  Responded: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Sent: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  Active: { bg: 'bg-teal/10', text: 'text-teal', dot: 'bg-teal' },
  Completed: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
}

export function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Pending

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        cfg.bg,
        cfg.text
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {status}
    </span>
  )
}
