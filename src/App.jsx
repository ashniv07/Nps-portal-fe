import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './components/layout/Sidebar'
import { Navbar } from './components/layout/Navbar'
import { AnalyticsTab } from './components/tabs/AnalyticsTab'
import { SurveyTab } from './components/tabs/SurveyTab'
import { HistoryTab } from './components/tabs/HistoryTab'
import { SkeletonCard } from './components/ui/Skeleton'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function LoadingState() {
  return (
    <div className="space-y-5 pt-2">
      <div className="grid grid-cols-2 gap-5">
        <SkeletonCard lines={6} />
        <div className="space-y-5">
          <SkeletonCard lines={4} />
          <div className="grid grid-cols-2 gap-4">
            <SkeletonCard lines={3} />
            <SkeletonCard lines={3} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3"><SkeletonCard lines={8} /></div>
        <div className="col-span-2"><SkeletonCard lines={7} /></div>
      </div>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('analytics')
  const [loading, setLoading] = useState(true)
  const [surveyType, setSurveyType] = useState('nsat')

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  // Simulate tab switch loading
  const handleTabChange = (tab) => {
    setLoading(true)
    setActiveTab(tab)
    setTimeout(() => setLoading(false), 600)
  }

  const bgColor = surveyType === 'nsat' ? '#FAFAF4' : '#EEF5F3'

  return (
    <div className="min-h-screen font-body transition-colors duration-500" style={{ backgroundColor: bgColor }}>
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} surveyType={surveyType} />
      <Navbar activeTab={activeTab} surveyType={surveyType} onSurveyTypeChange={setSurveyType} />

      <main className="ml-72 pt-20 min-h-screen">
        <div className="px-8 py-8 max-w-[1400px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingState />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                {activeTab === 'analytics' && <AnalyticsTab surveyType={surveyType} />}
                {activeTab === 'survey' && <SurveyTab surveyType={surveyType} />}
                {activeTab === 'history' && <HistoryTab surveyType={surveyType} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
