import { motion } from 'framer-motion'
import { BarChart2, Send, Clock } from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'survey', label: 'Survey', icon: Send },
  { id: 'history', label: 'History', icon: Clock },
]

function PulseLogo() {
  return (
    <div className="w-11 h-11 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
      <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 10 L5.5 10 L8 3 L11.5 17 L14.5 7 L17 13 L19.5 10 L25 10"
          stroke="#CDDE33"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export function Sidebar({ activeTab, onTabChange, surveyType = 'nsat' }) {
  const isCsat = surveyType === 'csat'

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 flex flex-col z-30 shadow-[1px_0_0_0_rgba(0,0,0,0.04)]">
      {/* Logo */}
      <div className="px-7 py-6 border-b border-gray-50">
        <div className="flex items-center gap-3.5">
          <PulseLogo />
          <div>
            <span className="font-display font-semibold text-gray-900 text-xl leading-none block">
              PulseScore
            </span>
            <span className="text-xs text-gray-400 font-body mt-0.5 block">Analytics Platform</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-7 space-y-1.5">
        <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4 font-body">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="w-full relative group"
            >
              <div
                className={clsx(
                  'flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 font-body text-sm',
                  isActive
                    ? 'bg-gray-900 text-white font-medium'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 w-full h-full bg-gray-900 rounded-xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon size={19} className={clsx(isActive && 'text-neon')} />
                <span className="text-base">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-neon" />
                )}
              </div>
            </button>
          )
        })}
      </nav>

      {/* Bottom card */}
      <div className={`p-5 mx-4 mb-6 rounded-xl text-white transition-colors duration-500 ${
        isCsat
          ? 'bg-gradient-to-br from-teal to-teal-light'
          : 'bg-gradient-to-br from-gray-900 to-gray-800'
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-body text-white/60">Current Period</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-body ${
            isCsat ? 'bg-white/20 text-white' : 'bg-neon/20 text-neon'
          }`}>
            {isCsat ? 'CSAT' : 'NSAT'}
          </span>
        </div>
        <p className="font-display font-semibold">Q2 2024</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-white/10">
            <div
              className={`h-1.5 rounded-full ${isCsat ? 'bg-white' : 'bg-neon'}`}
              style={{ width: '35%' }}
            />
          </div>
          <span className="text-[11px] text-white/50">35%</span>
        </div>
        <p className="text-[11px] text-white/50 mt-1.5">Apr 1 – Jun 30, 2024</p>
      </div>
    </aside>
  )
}
