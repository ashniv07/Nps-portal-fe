import { useState, useRef, useEffect } from 'react'
import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const notifications = [
  { id: 1, text: 'New response from TechCorp Solutions', time: '2m ago', unread: true },
  { id: 2, text: 'Survey SRV-2024-041 hit 50% response rate', time: '1h ago', unread: true },
  { id: 3, text: 'Monthly report is ready for download', time: '3h ago', unread: false },
]

export function Navbar({ activeTab, surveyType = 'nps', onSurveyTypeChange }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const notifRef = useRef(null)
  const unread = notifications.filter((n) => n.unread).length
  const isCsat = surveyType === 'csat'

  const tabLabels = {
    analytics: 'Analytics Overview',
    survey: 'Survey Management',
    history: 'Survey History',
    'client-access': 'Client Access',
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-white/90 backdrop-blur-md border-b border-gray-100 z-20 flex items-center px-8 justify-between shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
      {/* Left */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-gray-900">
          {tabLabels[activeTab]}
        </h1>
        <p className="text-xs text-gray-400 font-body mt-0.5">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* NPS / CSAT Toggle - Only show on Analytics tab */}
        {activeTab === 'analytics' && (
          <div className="flex items-center bg-gray-100 rounded-[2px] p-1 gap-1 border border-gray-200">
            <button
              onClick={() => onSurveyTypeChange('nps')}
              className={`relative px-5 py-2 rounded-[2px] text-sm font-body font-semibold transition-all duration-250 ${
                surveyType !== 'csat' ? 'bg-neon text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              NPS
            </button>
            <button
              onClick={() => onSurveyTypeChange('csat')}
              className={`relative px-5 py-2 rounded-[2px] text-sm font-body font-semibold transition-all duration-250 ${
                surveyType === 'csat' ? 'bg-neon text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              CSAT
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2.5 rounded-[2px] border border-gray-200 text-sm font-body bg-gray-50 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 w-48 transition-all"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false) }}
            className="relative p-2.5 rounded-[2px] hover:bg-gray-100 transition-colors text-gray-600"
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-neon text-black text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-full mt-2 w-84 bg-white rounded-[2px] shadow-card-hover border border-gray-100 overflow-hidden z-50"
                style={{ width: '340px' }}
              >
                <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                  <span className="font-display font-semibold">Notifications</span>
                  <span className="text-xs text-teal font-body font-medium cursor-pointer hover:underline">
                    Mark all read
                  </span>
                </div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                      n.unread ? 'bg-neon/5' : ''
                    }`}
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
            className="flex items-center gap-3 pl-3 pr-2.5 py-2 rounded-[2px] hover:bg-gray-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-neon flex items-center justify-center text-sm font-bold text-black">
              AJ
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold font-body text-gray-800 leading-none">Ashley</p>
              <p className="text-xs text-gray-400 font-body mt-0.5">Admin</p>
            </div>
            <ChevronDown
              size={15}
              className={`text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-[2px] shadow-card-hover border border-gray-100 overflow-hidden z-50"
              >
                {/* User info */}
                <div className="px-4 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-neon flex items-center justify-center text-sm font-bold text-black shrink-0">
                      AJ
                    </div>
                    <div>
                      <p className="text-sm font-semibold font-body text-gray-900">Ashley J.</p>
                      <p className="text-xs text-gray-400 font-body">ashley@pulsescore.io</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-gray-700 hover:bg-gray-50 transition-colors text-left">
                    <User size={15} className="text-gray-400" />
                    Profile Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-gray-700 hover:bg-gray-50 transition-colors text-left">
                    <Settings size={15} className="text-gray-400" />
                    Preferences
                  </button>
                </div>

                <div className="border-t border-gray-100 py-1.5">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-rose-600 hover:bg-rose-50 transition-colors text-left">
                    <LogOut size={15} className="text-rose-500" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
