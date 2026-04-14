import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  onClick,
  type = 'button',
  icon,
  ...props
}) {
  const variants = {
    primary:
      'bg-neon text-black font-semibold hover:brightness-105 shadow-neon',
    secondary:
      'border-2 border-gray-900 text-gray-900 bg-transparent hover:bg-gray-900 hover:text-white',
    ghost:
      'text-gray-600 bg-transparent hover:bg-gray-100',
    danger:
      'bg-magenta text-white font-semibold hover:brightness-110',
    teal:
      'bg-teal text-white font-semibold hover:brightness-110',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-7 py-3.5 text-base rounded-xl',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={clsx(
        'inline-flex items-center gap-2 font-body tracking-wide transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  )
}
