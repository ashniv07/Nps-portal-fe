import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Send,
  Users,
  BarChart2,
  ThumbsUp,
  Minus,
  ThumbsDown,
  ArrowUpRight,
  Star,
  SmilePlus,
  Meh,
  Frown,
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { Tooltip } from '../ui/Tooltip'
import { NpsTrendChart } from '../charts/NpsTrendChart'
import { CsatBarChart } from '../charts/CsatBarChart'
import { MapPanel } from '../charts/WorldMapChart'
import { InsightModal } from '../modals/InsightModal'
import { npsData, csatData, kpiData, csatDistributionData, clientsData, prospectsData } from '../../data/dummyData'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

function StatDelta({ value, positive = true }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-body font-medium px-2 py-0.5 rounded-full ${
        positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}
    >
      <TrendingUp size={10} />
      {value}
    </span>
  )
}

function NpsGauge({ score }) {
  const pct = ((score + 100) / 200) * 100
  return (
    <div className="relative w-36 h-36 mx-auto mt-2">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="url(#npsGauge)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 263.9} 263.9`}
        />
        <defs>
          <linearGradient id="npsGauge" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CDDE33" />
            <stop offset="100%" stopColor="#25A28F" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
        <span className="font-display font-bold text-4xl text-gray-900 leading-none">{score}</span>
        <span className="text-xs text-gray-400 font-body mt-1">NPS</span>
      </div>
    </div>
  )
}

// Computed CSAT satisfaction groups
const csatSatisfied = csatDistributionData
  .filter((d) => d.label.includes('5') || d.label.includes('4'))
  .reduce((a, b) => a + b.value, 0) // 42+28 = 70
const csatNeutral = csatDistributionData.find((d) => d.label.includes('3'))?.value || 0 // 16
const csatDissatisfied = csatDistributionData
  .filter((d) => d.label.includes('1') || d.label.includes('2'))
  .reduce((a, b) => a + b.value, 0) // 6+8 = 14


export function AnalyticsTab({ surveyType = 'nps' }) {
  const [modal, setModal] = useState(null)
  const isCsat = surveyType === 'csat'

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* Hero Row */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {isCsat ? (
            /* ── CSAT HERO ── */
            <Card className="col-span-1 relative overflow-visible" onClick={() => setModal('csat')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon/8 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-body text-gray-400 uppercase tracking-wider mb-1">
                      Customer Satisfaction Score
                    </p>
                    <div className="flex items-center gap-2">
                      <StatDelta value={csatData.change} />
                      <span className="text-xs text-gray-400 font-body">vs last quarter</span>
                    </div>
                  </div>
                  <Tooltip content="Click for deep insights">
                    <div className="p-2 rounded-xl bg-teal/10 text-teal hover:bg-teal/20 transition-colors">
                      <ArrowUpRight size={16} />
                    </div>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-3">
                  <div className="flex items-end gap-1">
                    <span className="font-display font-bold text-8xl text-gray-900 leading-none">{csatData.score}</span>
                    <span className="text-2xl text-gray-300 font-display mb-2">/5</span>
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={22}
                        className={i < Math.floor(csatData.score) ? 'fill-teal text-teal' : 'text-gray-200 fill-gray-200'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 font-body mt-2">{csatData.percentage}% of clients satisfied</p>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-gray-100">
                  <motion.div
                    className="h-2.5 rounded-full bg-gradient-teal"
                    initial={{ width: 0 }}
                    animate={{ width: `${csatData.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            /* ── NSAT / NPS HERO ── */
            <Card className="col-span-1 relative overflow-visible" onClick={() => setModal('nps')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon/8 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-body text-gray-400 uppercase tracking-wider mb-1">
                      Net Promoter Score
                    </p>
                    <div className="flex items-center gap-2">
                      <StatDelta value={`${npsData.change} pts`} />
                      <span className="text-xs text-gray-400 font-body">vs last quarter</span>
                    </div>
                  </div>
                  <Tooltip content="Click for deep insights">
                    <div className="p-2 rounded-xl bg-neon/10 text-gray-600 hover:bg-neon/20 transition-colors">
                      <ArrowUpRight size={16} />
                    </div>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <NpsGauge score={npsData.score} />
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-50">
                  <div className="text-center">
                    <p className="text-xl font-bold font-display text-emerald-600">{npsData.promoters}%</p>
                    <p className="text-[11px] text-gray-400 font-body">Promoters</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold font-display text-amber-500">{npsData.passives}%</p>
                    <p className="text-[11px] text-gray-400 font-body">Passives</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold font-display text-rose-500">{npsData.detractors}%</p>
                    <p className="text-[11px] text-gray-400 font-body">Detractors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* KPI mini cards — always shown */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 content-start">
            <Card className="p-5" hover>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                  <Send size={17} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-gray-900">
                    {kpiData.surveysSent.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 font-body">Surveys Sent</p>
                </div>
              </div>
            </Card>
            <Card className="p-5" hover>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  'bg-neon/10 text-gray-800'
                }`}>
                  <BarChart2 size={17} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-gray-900">
                    {kpiData.responseRate}%
                  </p>
                  <p className="text-xs text-gray-400 font-body">Response Rate</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 col-span-2" hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                    <Users size={17} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-gray-900">
                      {kpiData.activeClients}
                    </p>
                    <p className="text-xs text-gray-400 font-body">Active Clients</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-display text-gray-900">
                    {kpiData.avgResponseTime}
                  </p>
                  <p className="text-xs text-gray-400 font-body">Avg Response Time</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <motion.div variants={item} className="col-span-1 lg:col-span-3">
            <Card hover={false}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-gray-900">
                      {isCsat ? 'CSAT Trend' : 'NPS Trend'}
                    </h3>
                    <p className="text-xs text-gray-400 font-body mt-0.5">Last 8 months</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-body">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 rounded inline-block bg-neon" />
                      <span className="text-gray-500">{isCsat ? 'CSAT %' : 'NPS'}</span>
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <NpsTrendChart mode={surveyType} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="col-span-1 lg:col-span-2">
            {isCsat ? (
              <Card hover={false}>
                <CardHeader>
                  <h3 className="font-display font-semibold text-gray-900">CSAT Distribution</h3>
                  <p className="text-xs text-gray-400 font-body mt-0.5">Rating breakdown</p>
                </CardHeader>
                <CardContent>
                  <CsatBarChart />
                </CardContent>
              </Card>
            ) : (
              <Card hover={false}>
                <CardHeader>
                  <h3 className="font-display font-semibold text-gray-900">NPS Breakdown</h3>
                  <p className="text-xs text-gray-400 font-body mt-0.5">Response distribution</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 pt-2">
                    {[
                      { label: 'Promoters', sublabel: 'Score 9–10', pct: npsData.promoters, color: 'bg-emerald-500', text: 'text-emerald-600' },
                      { label: 'Passives', sublabel: 'Score 7–8', pct: npsData.passives, color: 'bg-amber-400', text: 'text-amber-500' },
                      { label: 'Detractors', sublabel: 'Score 0–6', pct: npsData.detractors, color: 'bg-rose-500', text: 'text-rose-500' },
                    ].map(({ label, sublabel, pct, color, text }) => (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <span className="text-sm font-body font-semibold text-gray-800">{label}</span>
                            <span className="text-xs text-gray-400 font-body ml-2">{sublabel}</span>
                          </div>
                          <span className={`text-sm font-bold font-display ${text}`}>{pct}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-gray-100">
                          <motion.div
                            className={`h-2.5 rounded-full ${color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-50">
                      <p className="text-xs text-gray-400 font-body">
                        Based on {npsData.totalResponses.toLocaleString()} total responses
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Breakdown Cards */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {isCsat ? (
            /* ── CSAT breakdown: Satisfied / Neutral / Dissatisfied ── */
            <>
              <Card className="border-t-4 border-t-teal" onClick={() => setModal('promoters')}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center text-gray-800">
                      <SmilePlus size={18} />
                    </div>
                    <ArrowUpRight size={15} className="text-gray-300" />
                  </div>
                  <p className="text-4xl font-bold font-display text-teal">{csatSatisfied}%</p>
                  <p className="font-body font-semibold text-gray-800 mt-1">Satisfied</p>
                  <p className="text-xs text-gray-400 font-body mt-1">Rating 4–5 · Happy clients</p>
                  <div className="mt-3 h-1.5 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full bg-neon" style={{ width: `${csatSatisfied}%` }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-amber-400" onClick={() => setModal('passives')}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                      <Meh size={18} />
                    </div>
                    <ArrowUpRight size={15} className="text-gray-300" />
                  </div>
                  <p className="text-4xl font-bold font-display text-amber-500">{csatNeutral}%</p>
                  <p className="font-body font-semibold text-gray-800 mt-1">Neutral</p>
                  <p className="text-xs text-gray-400 font-body mt-1">Rating 3 · Room to improve</p>
                  <div className="mt-3 h-1.5 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${csatNeutral}%` }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-rose-500" onClick={() => setModal('detractors')}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                      <Frown size={18} />
                    </div>
                    <ArrowUpRight size={15} className="text-gray-300" />
                  </div>
                  <p className="text-4xl font-bold font-display text-rose-500">{csatDissatisfied}%</p>
                  <p className="font-body font-semibold text-gray-800 mt-1">Dissatisfied</p>
                  <p className="text-xs text-gray-400 font-body mt-1">Rating 1–2 · Needs attention</p>
                  <div className="mt-3 h-1.5 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full bg-rose-500" style={{ width: `${csatDissatisfied}%` }} />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* ── NPS breakdown: Promoters / Passives / Detractors ── */
            <>
              <Card className="border-t-4 border-t-emerald-500" onClick={() => setModal('promoters')}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <ThumbsUp size={18} />
                    </div>
                    <ArrowUpRight size={15} className="text-gray-300" />
                  </div>
                  <p className="text-4xl font-bold font-display text-emerald-600">{npsData.promoters}%</p>
                  <p className="font-body font-semibold text-gray-800 mt-1">Promoters</p>
                  <p className="text-xs text-gray-400 font-body mt-1">Score 9–10 · Brand advocates</p>
                  <div className="mt-3 h-1.5 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${npsData.promoters}%` }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-amber-400" onClick={() => setModal('passives')}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                      <Minus size={18} />
                    </div>
                    <ArrowUpRight size={15} className="text-gray-300" />
                  </div>
                  <p className="text-4xl font-bold font-display text-amber-500">{npsData.passives}%</p>
                  <p className="font-body font-semibold text-gray-800 mt-1">Passives</p>
                  <p className="text-xs text-gray-400 font-body mt-1">Score 7–8 · Satisfied, neutral</p>
                  <div className="mt-3 h-1.5 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${npsData.passives}%` }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-rose-500" onClick={() => setModal('detractors')}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                      <ThumbsDown size={18} />
                    </div>
                    <ArrowUpRight size={15} className="text-gray-300" />
                  </div>
                  <p className="text-4xl font-bold font-display text-rose-500">{npsData.detractors}%</p>
                  <p className="font-body font-semibold text-gray-800 mt-1">Detractors</p>
                  <p className="text-xs text-gray-400 font-body mt-1">Score 0–6 · At-risk clients</p>
                  <div className="mt-3 h-1.5 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full bg-rose-500" style={{ width: `${npsData.detractors}%` }} />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>

        {/* Map Section */}
        <motion.div variants={item}>
          <div className="rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            <div className="px-4 sm:px-6 pt-5 pb-3 bg-white flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-display font-semibold text-gray-900">Global Client Map</h3>
                <p className="text-xs text-gray-400 font-body mt-0.5">
                  Click a pin to view clients &amp; prospects at that location
                </p>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {(isCsat ? [
                  { color: '#CDDE33', label: 'Satisfied' },
                  { color: '#F59E0B', label: 'Neutral' },
                  { color: '#EF4444', label: 'Dissatisfied' },
                ] : [
                  { color: '#10B981', label: 'Promoter' },
                  { color: '#F59E0B', label: 'Passive' },
                  { color: '#EF4444', label: 'Detractor' },
                ]).concat([
                  { color: '#9CA3AF', label: 'No response' },
                  { color: '#A78BFA', label: 'Prospect' },
                ]).map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-xs text-gray-500 font-body">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <MapPanel
              clients={clientsData}
              prospects={prospectsData}
              surveyType={surveyType}
            />
          </div>
        </motion.div>

      </motion.div>

      {/* Modal */}
      <InsightModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        type={modal}
      />
    </>
  )
}
