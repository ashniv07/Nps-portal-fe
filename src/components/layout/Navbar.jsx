import { useState, useRef, useEffect } from 'react'
import { Bell, ChevronDown, LogOut, User, Settings, BarChart2, Send, Clock, KeyRound, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const notifications = [
  { id: 1, text: 'New response from TechCorp Solutions', time: '2m ago', unread: true },
  { id: 2, text: 'Survey SRV-2024-041 hit 50% response rate', time: '1h ago', unread: true },
  { id: 3, text: 'Monthly report is ready for download', time: '3h ago', unread: false },
]

const baseNavItems = [
  { id: 'analytics',    label: 'Analytics',     icon: BarChart2 },
  { id: 'survey',       label: 'Survey',        icon: Send },
  { id: 'history',      label: 'History',       icon: Clock },
]

export function Navbar({ activeTab, onTabChange, surveyType = 'nps', onSurveyTypeChange, role = 'admin' }) {
  const [notifOpen, setNotifOpen]     = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const profileRef = useRef(null)
  const notifRef   = useRef(null)
  const unread = notifications.filter((n) => n.unread).length

  const navItems = role === 'admin'
    ? [...baseNavItems, { id: 'client-access', label: 'Access', icon: KeyRound }]
    : baseNavItems

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleTabChange(tab) {
    onTabChange(tab)
    setMobileOpen(false)
    setNotifOpen(false)
    setProfileOpen(false)
  }

  return (
    <div className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-30">

      {/* ── Floating pill ──────────────────────────────────────── */}
      <div className="bg-white/92 backdrop-blur-lg border border-gray-200/70 shadow-[0_4px_32px_rgba(0,0,0,0.10)] rounded-full px-4 sm:px-5 h-13 sm:h-14 flex items-center gap-2 sm:gap-3">

        {/* Brand */}
        <span className="font-display font-bold text-gray-900 text-sm sm:text-base tracking-tight shrink-0 select-none">
          CPRIME
        </span>

        {/* Divider — only when nav is visible */}
        <div className="hidden lg:block w-px h-5 bg-gray-200 shrink-0" />

        {/* Desktop nav — lg+ only so it fits without overflow */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 xl:px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-neon' : ''} />
                <span className="hidden xl:inline">{item.label}</span>
                <span className="xl:hidden">{item.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </nav>

        {/* Spacer on mobile/tablet */}
        <div className="flex-1 lg:hidden" />

        {/* Right controls */}
        <div className="flex items-center gap-1 shrink-0">

          {/* NPS / CSAT toggle — lg+ only to avoid overflow */}
          {activeTab === 'analytics' && (
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full p-1 gap-0.5 border border-gray-200 mr-1">
              <button
                onClick={() => onSurveyTypeChange('nps')}
                className={`px-2.5 xl:px-3 py-1 rounded-full text-xs font-body font-semibold transition-all duration-200 ${
                  surveyType !== 'csat' ? 'bg-gray-900 text-neon shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                NPS
              </button>
              <button
                onClick={() => onSurveyTypeChange('csat')}
                className={`px-2.5 xl:px-3 py-1 rounded-full text-xs font-body font-semibold transition-all duration-200 ${
                  surveyType === 'csat' ? 'bg-gray-900 text-neon shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                CSAT
              </button>
            </div>
          )}

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false) }}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
            >
              <Bell size={17} />
              {unread > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-neon text-black text-[9px] font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 top-full mt-3 w-[min(320px,calc(100vw-2rem))] bg-white rounded-2xl shadow-card-hover border border-gray-100 overflow-hidden z-50"
                >
                  <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                    <span className="font-display font-semibold text-sm">Notifications</span>
                    <span className="text-xs text-teal font-body font-medium cursor-pointer hover:underline">
                      Mark all read
                    </span>
                  </div>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${n.unread ? 'bg-neon/5' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {n.unread && <span className="mt-1.5 w-2 h-2 rounded-full bg-neon shrink-0" />}
                        <div className={n.unread ? '' : 'pl-5'}>
                          <p className="text-sm font-body text-gray-700">{n.text}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false) }}
              className="flex items-center gap-1.5 pl-1 pr-2 sm:pr-2.5 py-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center text-xs font-bold text-black shrink-0">
                AJ
              </div>
              <span className="hidden sm:block text-sm font-semibold font-body text-gray-800 leading-none">
                Ashley
              </span>
              <ChevronDown
                size={12}
                className={`hidden sm:block text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-card-hover border border-gray-100 overflow-hidden z-50"
                >
                  <div className="px-4 py-3.5 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-neon flex items-center justify-center text-sm font-bold text-black shrink-0">
                        AJ
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold font-body text-gray-900 truncate">Ashley J.</p>
                        <p className="text-xs text-gray-400 font-body truncate">ashley@pulsescore.io</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-gray-700 hover:bg-gray-50 transition-colors text-left">
                      <User size={14} className="text-gray-400" /> Profile Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-gray-700 hover:bg-gray-50 transition-colors text-left">
                      <Settings size={14} className="text-gray-400" /> Preferences
                    </button>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-rose-600 hover:bg-rose-50 transition-colors text-left">
                      <LogOut size={14} className="text-rose-500" /> Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hamburger — shows up to lg */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors ml-0.5"
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* ── Mobile / tablet dropdown ──────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="mt-2 bg-white/96 backdrop-blur-lg border border-gray-200/70 shadow-[0_4px_32px_rgba(0,0,0,0.10)] rounded-2xl p-2 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-body font-semibold transition-all ${
                      isActive
                        ? 'bg-gray-900 text-white col-span-1'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={15} className={isActive ? 'text-neon' : 'text-gray-400'} />
                    {item.label}
                  </button>
                )
              })}
            </div>

            {/* NPS/CSAT + separator */}
            {activeTab === 'analytics' && (
              <div className="flex items-center gap-2 px-4 py-2.5 mt-1 border-t border-gray-100">
                <span className="text-xs text-gray-400 font-body shrink-0">View:</span>
                <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5 border border-gray-200">
                  <button
                    onClick={() => onSurveyTypeChange('nps')}
                    className={`px-3 py-1 rounded-full text-xs font-body font-semibold transition-all ${
                      surveyType !== 'csat' ? 'bg-gray-900 text-neon' : 'text-gray-500'
                    }`}
                  >NPS</button>
                  <button
                    onClick={() => onSurveyTypeChange('csat')}
                    className={`px-3 py-1 rounded-full text-xs font-body font-semibold transition-all ${
                      surveyType === 'csat' ? 'bg-gray-900 text-neon' : 'text-gray-500'
                    }`}
                  >CSAT</button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
