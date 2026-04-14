import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import cprimeLogo from '../../img/output.auto (1).jpg'

export function CPrimeLogo({
  size = 'md',
  showText = true,
  showSubtitle = true,
  link = true,
  className,
}) {
  const sizes = {
    sm: 'h-7',
    md: 'h-8',
    lg: 'h-10',
  }

  const content = (
    <div className={clsx('flex items-center gap-3', className)}>
      <img
        src={cprimeLogo}
        alt="CPRIME logo"
        className={clsx(sizes[size] || sizes.md, 'object-contain')}
      />
      {showText && (
        <div>
          <span className="font-display font-semibold text-gray-600 text-base leading-none block">
            Pulse Survey
          </span>
          {showSubtitle && (
            <span className="text-xs text-gray-400 font-body mt-0.5 block">
              Analytics Platform
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (!link) return content

  return (
    <Link to="/login" aria-label="CPRIME home">
      {content}
    </Link>
  )
}
