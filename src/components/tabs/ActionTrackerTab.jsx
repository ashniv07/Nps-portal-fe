import { motion } from 'framer-motion'
import { CheckSquare } from 'lucide-react'
import { ActionTrackerWidget } from '../widgets/ActionTrackerWidget'

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

export function ActionTrackerTab() {
  return (
    <motion.div variants={item} initial="hidden" animate="show" className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-neon/15 flex items-center justify-center shrink-0">
          <CheckSquare size={18} className="text-gray-700" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-gray-900 text-xl">Action Tracker</h2>
          <p className="text-sm text-gray-400 font-body mt-0.5">
            Track follow-ups, owners, and recovery actions outside the analytics dashboard.
          </p>
        </div>
      </div>

      <ActionTrackerWidget />
    </motion.div>
  )
}
