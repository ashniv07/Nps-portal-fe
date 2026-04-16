import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, Send, Users, BarChart2,
  ThumbsUp, Minus, ThumbsDown,
  ArrowUpRight, Star, SmilePlus, Meh, Frown,
  Tag, TrendingDown, ChevronDown, MapPin, X,
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { Tooltip } from '../ui/Tooltip'
import { MapPanel } from '../charts/WorldMapChart'
import { AISuggestionsWidget } from '../widgets/AISuggestionsWidget'
import { YoYWidget } from '../widgets/YoYWidget'
import { ActionTrackerWidget } from '../widgets/ActionTrackerWidget'
import {
  npsData, csatData, kpiData, csatDistributionData,
  clientsData, prospectsData, drillDownData,
} from '../../data/dummyData'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

function StatDelta({ value, positive = true }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-body font-medium px-2 py-0.5 rounded-full ${
      positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
    }`}>
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
        <circle cx="50" cy="50" r="42" fill="none" stroke="url(#npsGauge)" strokeWidth="9"
          strokeLinecap="round" strokeDasharray={`${(pct / 100) * 263.9} 263.9`} />
        <defs>
          <linearGradient id="npsGauge" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CDDE33" />
            <stop offset="100%" stopColor="#25A28F" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-4xl text-gray-900 leading-none">{score}</span>
        <span className="text-xs text-gray-400 font-body mt-1">NPS</span>
      </div>
    </div>
  )
}

const csatSatisfied    = csatDistributionData.filter((d) => d.label.includes('5') || d.label.includes('4')).reduce((a, b) => a + b.value, 0)
const csatNeutral      = csatDistributionData.find((d) => d.label.includes('3'))?.value || 0
const csatDissatisfied = csatDistributionData.filter((d) => d.label.includes('1') || d.label.includes('2')).reduce((a, b) => a + b.value, 0)

// ─── Widget 1 Drill-down Panel ───────────────────────────────────────────────
function DrillDownPanel({ categoryKey, isCsat, onClose }) {
  const [activeTab, setActiveTab]     = useState('themes')
  const [accountDetail, setAccountDetail] = useState(null)
  const data = drillDownData[categoryKey]
  if (!data) return null

  const tabs = [
    { id: 'themes',   label: 'Themes' },
    { id: 'causal',   label: 'Causal Analysis' },
    { id: 'clusters', label: 'Theme Clusters' },
    { id: 'accounts', label: 'Accounts' },
  ]

  const sentimentColor = {
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    neutral:  'bg-amber-50 text-amber-700 border-amber-200',
    negative: 'bg-rose-50 text-rose-600 border-rose-200',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setAccountDetail(null) }}
              className={`text-xs font-body font-semibold px-3 py-1.5 rounded-lg transition-all ${
                activeTab === t.id
                  ? 'bg-gray-900 text-neon'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="p-5">
        {/* ── Themes tab ── */}
        {activeTab === 'themes' && (
          <div>
            <p className="text-xs text-gray-400 font-body mb-3">
              Positive and negative themes from responses in this category
            </p>
            <div className="flex flex-wrap gap-2">
              {data.themes.map((t, i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-body font-semibold ${sentimentColor[t.sentiment]}`}>
                  <span>{t.text}</span>
                  <span className="opacity-60">{t.count}</span>
                  <span className="font-bold">{t.impact}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Causal Analysis tab ── */}
        {activeTab === 'causal' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 font-body mb-1">
              Factors explaining {isCsat ? 'CSAT' : 'NPS'} movement for this category
            </p>
            {data.causal.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  c.direction === 'up' ? 'bg-emerald-100' : 'bg-rose-100'
                }`}>
                  {c.direction === 'up'
                    ? <TrendingUp  size={14} className="text-emerald-600" />
                    : <TrendingDown size={14} className="text-rose-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-semibold text-gray-800">{c.factor}</p>
                </div>
                <span className={`text-sm font-bold font-display shrink-0 ${
                  c.direction === 'up' ? 'text-emerald-600' : 'text-rose-500'
                }`}>
                  {c.direction === 'up' ? '+' : '-'}{c.pts}pts
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Theme Clusters tab ── */}
        {activeTab === 'clusters' && (
          <div>
            <p className="text-xs text-gray-400 font-body mb-3">
              Common theme clusters and their impact on {isCsat ? 'CSAT' : 'NPS'} score
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.clusters.map((cl, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <p className="text-sm font-display font-semibold text-gray-800 mb-2">{cl.name}</p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-2xl font-bold font-display text-gray-900">{cl.score}</span>
                    <span className="text-xs text-gray-400 font-body mb-0.5">/10</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-body">
                    <span className="text-gray-400">{cl.responses} responses</span>
                    <span className={`font-semibold ${cl.change >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {cl.change >= 0 ? '▲' : '▼'} {Math.abs(cl.change)}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-100">
                    <div
                      className={`h-1.5 rounded-full ${cl.score >= 8 ? 'bg-emerald-400' : cl.score >= 6 ? 'bg-amber-400' : 'bg-rose-400'}`}
                      style={{ width: `${(cl.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Accounts tab ── */}
        {activeTab === 'accounts' && !accountDetail && (
          <div>
            <p className="text-xs text-gray-400 font-body mb-3">
              Account-level summary for this category — click to view detailed breakdown
            </p>
            <div className="space-y-2">
              {data.accounts.map((acc, i) => (
                <button
                  key={i}
                  onClick={() => setAccountDetail(acc)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-neon/30 hover:bg-neon/[0.02] transition-all group text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                    {acc.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-semibold text-gray-800">{acc.name}</p>
                    <p className="text-xs text-gray-400 font-body flex items-center gap-1 mt-0.5">
                      <MapPin size={9} />{acc.city} · {acc.respondents} respondents
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-body">NPS</p>
                      <p className="text-sm font-bold font-display text-gray-800">{acc.nps}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-body">YoY</p>
                      <p className={`text-sm font-bold font-display ${acc.yoy >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {acc.yoy >= 0 ? '+' : ''}{acc.yoy}
                      </p>
                    </div>
                    <ArrowUpRight size={14} className="text-gray-300 group-hover:text-neon transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Account Detail (Drill-down 2) ── */}
        {activeTab === 'accounts' && accountDetail && (
          <div>
            <button
              onClick={() => setAccountDetail(null)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 font-body font-semibold mb-4 transition-colors"
            >
              ← Back to accounts
            </button>
            <div className="flex items-start gap-4 mb-5 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
                {accountDetail.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <h4 className="font-display font-semibold text-gray-900">{accountDetail.name}</h4>
                <p className="text-xs text-gray-500 font-body flex items-center gap-1 mt-0.5">
                  <MapPin size={9} />{accountDetail.city} · {accountDetail.respondents} respondents
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'NPS Score', value: accountDetail.nps, color: accountDetail.nps >= 9 ? 'text-emerald-600' : accountDetail.nps >= 7 ? 'text-amber-500' : 'text-rose-500' },
                { label: 'CSAT Score', value: `${accountDetail.csat}/5`, color: 'text-teal' },
                { label: 'YoY Change', value: `${accountDetail.yoy >= 0 ? '+' : ''}${accountDetail.yoy}`, color: accountDetail.yoy >= 0 ? 'text-emerald-600' : 'text-rose-500' },
                { label: 'Sentiment', value: accountDetail.yoy >= 10 ? 'Very Positive' : accountDetail.yoy >= 0 ? 'Positive' : 'Declining', color: accountDetail.yoy >= 0 ? 'text-emerald-600' : 'text-rose-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="border border-gray-100 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 font-body uppercase tracking-wide">{label}</p>
                  <p className={`text-lg font-bold font-display mt-0.5 ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="bg-neon/5 border border-neon/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-700 font-body mb-1">Sentimental Analysis</p>
              <p className="text-sm text-gray-600 font-body leading-relaxed">
                {accountDetail.yoy >= 10
                  ? `${accountDetail.name} shows strong positive momentum with a ${accountDetail.yoy > 0 ? '+' : ''}${accountDetail.yoy} YoY NPS improvement. Clients are particularly satisfied with support quality and platform reliability. No immediate risk signals detected.`
                  : accountDetail.yoy >= 0
                  ? `${accountDetail.name} shows stable to slightly improving satisfaction. Response themes suggest a neutral-to-positive experience with minor friction around response times. Monitor for conversion to promoter status.`
                  : `${accountDetail.name} shows a declining NPS trend of ${accountDetail.yoy} YoY. Response themes indicate dissatisfaction with onboarding or support. Recommend immediate account review to prevent churn.`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main AnalyticsTab ───────────────────────────────────────────────────────
export function AnalyticsTab({ surveyType = 'nps' }) {
  const isCsat           = surveyType === 'csat'
  const [drillCategory, setDrillCategory] = useState(null)   // 'promoters' | 'passives' | 'detractors'
  const [actionPrefill,  setActionPrefill]  = useState(null)

  const handleCategoryClick = (key) => {
    setDrillCategory((prev) => (prev === key ? null : key))
  }

  const handleCreateAction = (suggestion) => {
    setActionPrefill(suggestion)
    // scroll to action tracker
    setTimeout(() => document.getElementById('action-tracker')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  // Category card config for NPS and CSAT modes
  const categoryCards = isCsat ? [
    { key: 'promoters',  icon: SmilePlus,  label: 'Satisfied',   sublabel: 'Rating 4–5 · Happy clients',       pct: csatSatisfied,    border: 'border-t-teal',    color: 'text-teal',    bar: 'bg-neon',       iconBg: 'bg-neon/10 text-gray-800' },
    { key: 'passives',   icon: Meh,        label: 'Neutral',     sublabel: 'Rating 3 · Room to improve',        pct: csatNeutral,      border: 'border-t-amber-400', color: 'text-amber-500', bar: 'bg-amber-400', iconBg: 'bg-amber-50 text-amber-500' },
    { key: 'detractors', icon: Frown,      label: 'Dissatisfied', sublabel: 'Rating 1–2 · Needs attention',    pct: csatDissatisfied, border: 'border-t-rose-500',  color: 'text-rose-500', bar: 'bg-rose-500',  iconBg: 'bg-rose-50 text-rose-500' },
  ] : [
    { key: 'promoters',  icon: ThumbsUp,   label: 'Promoters',   sublabel: 'Score 9–10 · Brand advocates',      pct: npsData.promoters,  border: 'border-t-emerald-500', color: 'text-emerald-600', bar: 'bg-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600' },
    { key: 'passives',   icon: Minus,      label: 'Passives',    sublabel: 'Score 7–8 · Satisfied, neutral',     pct: npsData.passives,   border: 'border-t-amber-400',   color: 'text-amber-500',  bar: 'bg-amber-400',   iconBg: 'bg-amber-50 text-amber-500' },
    { key: 'detractors', icon: ThumbsDown, label: 'Detractors',  sublabel: 'Score 0–6 · At-risk clients',        pct: npsData.detractors, border: 'border-t-rose-500',    color: 'text-rose-500',   bar: 'bg-rose-500',    iconBg: 'bg-rose-50 text-rose-500' },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* ═══════════════════════════════════════════════════════════
          WIDGET 1 — NPS / CSAT Results with Drill-down
      ═══════════════════════════════════════════════════════════ */}
      <motion.div variants={item}>
        {/* Section label */}
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400">Widget 1 · NPS/CSAT Results</p>
        </div>

        {/* Hero + KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          {isCsat ? (
            <Card className="col-span-1 relative overflow-visible">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon/8 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-body text-gray-400 uppercase tracking-wider mb-1">Customer Satisfaction Score</p>
                    <div className="flex items-center gap-2">
                      <StatDelta value={csatData.change} />
                      <span className="text-xs text-gray-400 font-body">vs last quarter</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-teal/10 text-teal">
                    <ArrowUpRight size={16} />
                  </div>
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
                      <Star key={i} size={22} className={i < Math.floor(csatData.score) ? 'fill-teal text-teal' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 font-body mt-2">{csatData.percentage}% of clients satisfied</p>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-gray-100">
                  <motion.div className="h-2.5 rounded-full bg-gradient-teal" initial={{ width: 0 }} animate={{ width: `${csatData.percentage}%` }} transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="col-span-1 relative overflow-visible">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon/8 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-body text-gray-400 uppercase tracking-wider mb-1">Net Promoter Score</p>
                    <div className="flex items-center gap-2">
                      <StatDelta value={`${npsData.change} pts`} />
                      <span className="text-xs text-gray-400 font-body">vs last quarter</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-neon/10 text-gray-600">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <NpsGauge score={npsData.score} />
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-50">
                  {[
                    { label: 'Promoters', pct: npsData.promoters, color: 'text-emerald-600' },
                    { label: 'Passives',  pct: npsData.passives,  color: 'text-amber-500' },
                    { label: 'Detractors',pct: npsData.detractors,color: 'text-rose-500' },
                  ].map(({ label, pct, color }) => (
                    <div key={label} className="text-center">
                      <p className={`text-xl font-bold font-display ${color}`}>{pct}%</p>
                      <p className="text-[11px] text-gray-400 font-body">{label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* KPI mini-cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 content-start">
            <Card className="p-5" hover>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><Send size={17} /></div>
                <div>
                  <p className="text-2xl font-bold font-display text-gray-900">{kpiData.surveysSent.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 font-body">Surveys Sent</p>
                </div>
              </div>
            </Card>
            <Card className="p-5" hover>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center text-gray-800"><BarChart2 size={17} /></div>
                <div>
                  <p className="text-2xl font-bold font-display text-gray-900">{kpiData.responseRate}%</p>
                  <p className="text-xs text-gray-400 font-body">Response Rate</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 col-span-2" hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500"><Users size={17} /></div>
                  <div>
                    <p className="text-2xl font-bold font-display text-gray-900">{kpiData.activeClients}</p>
                    <p className="text-xs text-gray-400 font-body">Active Clients</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-display text-gray-900">{kpiData.avgResponseTime}</p>
                  <p className="text-xs text-gray-400 font-body">Avg Response Time</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Category Breakdown cards (clickable → drill-down) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-3">
          {categoryCards.map(({ key, icon: Icon, label, sublabel, pct, border, color, bar, iconBg }) => (
            <Card
              key={key}
              className={`border-t-4 ${border} cursor-pointer transition-all duration-200 ${
                drillCategory === key ? 'ring-2 ring-neon/40 shadow-neon' : ''
              }`}
              onClick={() => handleCategoryClick(key)}
            >
              <CardContent className="pt-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex items-center gap-1">
                    <ChevronDown
                      size={15}
                      className={`text-gray-300 transition-transform duration-200 ${drillCategory === key ? 'rotate-180 text-neon' : ''}`}
                    />
                  </div>
                </div>
                <p className={`text-4xl font-bold font-display ${color}`}>{pct}%</p>
                <p className="font-body font-semibold text-gray-800 mt-1">{label}</p>
                <p className="text-xs text-gray-400 font-body mt-1">{sublabel}</p>
                <div className="mt-3 h-1.5 rounded-full bg-gray-100">
                  <div className={`h-1.5 rounded-full ${bar}`} style={{ width: `${pct}%` }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Inline Drill-down Panel */}
        <AnimatePresence>
          {drillCategory && (
            <DrillDownPanel
              key={drillCategory}
              categoryKey={drillCategory}
              isCsat={isCsat}
              onClose={() => setDrillCategory(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          WIDGET 2 + WIDGET 3 — AI Suggestions & YoY
      ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div variants={item}>
          <div className="mb-2">
            <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400">Widget 2 · AI Improvement Suggestions</p>
          </div>
          <AISuggestionsWidget onCreateAction={handleCreateAction} />
        </motion.div>

        <motion.div variants={item}>
          <div className="mb-2">
            <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400">Widget 3 · Year-over-Year Comparison</p>
          </div>
          <YoYWidget surveyType={surveyType} />
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          Global Client Map
      ═══════════════════════════════════════════════════════════ */}
      <motion.div variants={item}>
        <div className="rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-4 sm:px-6 pt-5 pb-3 bg-white flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-display font-semibold text-gray-900">Global Client Map</h3>
              <p className="text-xs text-gray-400 font-body mt-0.5">Click a pin to view clients &amp; prospects at that location</p>
            </div>
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
          <MapPanel clients={clientsData} prospects={prospectsData} surveyType={surveyType} />
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          WIDGET 4 — Action Tracker
      ═══════════════════════════════════════════════════════════ */}
      <motion.div variants={item} id="action-tracker">
        <div className="mb-2">
          <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400">Widget 4 · Action Tracker</p>
        </div>
        <ActionTrackerWidget prefillAction={actionPrefill} />
      </motion.div>

    </motion.div>
  )
}
