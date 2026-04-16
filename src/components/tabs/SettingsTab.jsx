import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

export function SettingsTab({ children }) {
  const [activeSubTab, setActiveSubTab] = useState('access')

  return (
    <motion.div variants={item} initial="hidden" animate="show" className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
          <Settings size={18} className="text-gray-600" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-gray-900 text-xl">Settings</h2>
          <p className="text-sm text-gray-400 font-body mt-0.5">
            Manage team preferences, permissions, and access from one place.
          </p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab('access')}
          className={`px-4 py-3 text-sm font-semibold font-body border-b-2 transition-colors ${
            activeSubTab === 'access'
              ? 'border-neon text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Team Access
        </button>
      </div>

      {/* Content */}
      {activeSubTab === 'access' && children}
    </motion.div>
  )
}
