import { motion, AnimatePresence } from 'framer-motion'
import { BarChart2, Send, Clock, KeyRound, X } from 'lucide-react'
import { clsx } from 'clsx'
import { CPrimeLogo } from '../common/CPrimeLogo'

const baseNavItems = [
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'survey',    label: 'Survey',    icon: Send },
  { id: 'history',   label: 'History',   icon: Clock },
]

function SidebarContent({ activeTab, onTabChange, surveyType, role, onClose }) {
  const isCsat = surveyType === 'csat'
  const navItems = role === 'admin'
    ? [...baseNavItems, { id: 'client-access', label: 'Client Access', icon: KeyRound }]
    : baseNavItems

  return (
    <div className="flex flex-col h-full">
      {/* Logo + mobile close */}
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <CPrimeLogo size="lg" />
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4 font-body">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); onClose?.() }}
              className="w-full relative group"
            >
              <div className={clsx(
                'flex items-center gap-3.5 px-4 py-3.5 rounded-[2px] transition-all duration-200 font-body text-sm',
                isActive
                  ? 'bg-gray-900 text-white font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )}>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 w-full h-full bg-gray-900 rounded-[2px] -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon size={19} className={clsx(isActive && 'text-neon')} />
                <span className="text-base">{item.label}</span>
                {isActive && <span className="ml-auto w-2 h-2 rounded-full bg-neon" />}
              </div>
            </button>
          )
        })}
      </nav>

      {/* Bottom period card */}
      <div className="p-5 mx-4 mb-6 rounded-[2px] text-black bg-gradient-to-br from-neon to-yellow-300 shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-body text-black/60">Current Period</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-body bg-black/10 text-gray-900">
            {isCsat ? 'CSAT' : 'NPS'}
          </span>
        </div>
        <p className="font-display font-semibold">Q2 2024</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-black/10">
            <div className="h-1.5 rounded-full bg-black/40" style={{ width: '35%' }} />
          </div>
          <span className="text-[11px] text-black/40">35%</span>
        </div>
        <p className="text-[11px] text-black/40 mt-1.5">Apr 1 – Jun 30, 2024</p>
      </div>
    </div>
  )
}

export function Sidebar({ activeTab, onTabChange, surveyType = 'nps', role = 'admin', mobileOpen = false, onMobileClose }) {
  return (
    <>
      {/* ── Desktop sidebar ─────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 lg:w-72 bg-white border-r border-gray-100 flex-col z-30 shadow-[1px_0_0_0_rgba(0,0,0,0.04)]">
        <SidebarContent
          activeTab={activeTab}
          onTabChange={onTabChange}
          surveyType={surveyType}
          role={role}
        />
      </aside>

      {/* ── Mobile drawer ────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={onMobileClose}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 flex flex-col z-50 md:hidden shadow-xl"
            >
              <SidebarContent
                activeTab={activeTab}
                onTabChange={onTabChange}
                surveyType={surveyType}
                role={role}
                onClose={onMobileClose}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
