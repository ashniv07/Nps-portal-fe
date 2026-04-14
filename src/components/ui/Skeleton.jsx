import { clsx } from 'clsx'

export function Skeleton({ className }) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg',
        className
      )}
    />
  )
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="bg-white rounded-[2px] p-5 shadow-card border border-gray-100/60 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-10 w-1/2" />
      {Array.from({ length: lines - 2 }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  )
}
