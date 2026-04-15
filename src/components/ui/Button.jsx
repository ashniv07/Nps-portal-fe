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
      'bg-neon text-black font-semibold hover:bg-gradient-primary shadow-neon',
    secondary:
      'border-2 border-black text-black bg-transparent hover:bg-black hover:text-white',
    ghost:
      'text-gray-600 bg-transparent hover:bg-gray-100',
    danger:
      'bg-magenta text-white font-semibold hover:brightness-110',
    teal:
      'bg-teal text-white font-semibold hover:brightness-110',
  }

  const sizes = {
    sm: 'h-10 px-3 text-xs rounded-[2px]',
    md: 'h-14 px-6 text-sm rounded-[2px]',
    lg: 'h-14 px-8 text-base rounded-[2px]',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={clsx(
        'inline-flex items-center gap-2 font-body uppercase tracking-[0.2em] transition-all duration-200',
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
