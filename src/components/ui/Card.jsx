import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export function Card({ children, className, onClick, hover = true, ...props }) {
  const base =
    'bg-white rounded-xl shadow-card border border-gray-100/60 overflow-hidden'

  if (onClick || hover) {
    return (
      <motion.div
        className={clsx(base, onClick && 'cursor-pointer', className)}
        onClick={onClick}
        whileHover={hover ? { y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={clsx(base, className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx('px-5 pt-5 pb-3', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }) {
  return (
    <div className={clsx('px-5 pb-5', className)}>
      {children}
    </div>
  )
}
