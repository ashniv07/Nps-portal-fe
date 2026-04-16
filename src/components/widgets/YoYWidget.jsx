import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, TrendingUp, TrendingDown, ChevronLeft, X, Calendar, Users, Star, MapPin, Mail } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { NpsTrendChart } from '../charts/NpsTrendChart'
import { yoyComparisonData, historyData } from '../../data/dummyData'

const catConfig = {
  Promoter:  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Passive:   { bg: 'bg-amber-100',   text: 'text-amber-700' },
  Detractor: { bg: 'bg-rose-100',    text: 'text-rose-600' },
}

// map 3-letter month abbr → JS month index (0-based)
const monthIndex = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 }

function npsChipColor(s) {
  return s >= 9 ? 'bg-emerald-100 text-emerald-700' : s >= 7 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-600'
}

function MovementRow({ m }) {
  const fromC = catConfig[m.from] || catConfig.Passive
  const toC   = catConfig[m.to]   || catConfig.Passive
  const isUp  = m.npsChange > 0
  const same  = m.from === m.to
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-body font-semibold text-gray-800 truncate">{m.account}</p>
        <p className="text-[10px] text-gray-400 font-body">{m.region}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-body ${fromC.bg} ${fromC.text}`}>{m.from}</span>
        <ArrowRight size={10} className={same ? 'text-gray-300' : isUp ? 'text-emerald-500' : 'text-rose-400'} />
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-body ${toC.bg} ${toC.text}`}>{m.to}</span>
      </div>
      <div className={`text-xs font-bold font-display shrink-0 w-9 text-right ${
        m.npsChange > 0 ? 'text-emerald-600' : m.npsChange < 0 ? 'text-rose-500' : 'text-gray-400'
      }`}>
        {m.npsChange > 0 ? '+' : ''}{m.npsChange}
      </div>
    </div>
  )
}

// ─── Drill-down level 3: client responses ────────────────────────────────────
function ClientDetailView({ client, isCsat, onBack }) {
  const responded = client.respondents.filter(r => r.status === 'Responded')
  const npsScores = responded.filter(r => r.nps != null).map(r => r.nps)
  const csatScores = responded.filter(r => r.csat != null).map(r => r.csat)
  const avgNps = npsScores.length ? (npsScores.reduce((a,b) => a+b,0) / npsScores.length).toFixed(1) : '—'
  const avgCsat = csatScores.length ? (csatScores.reduce((a,b) => a+b,0) / csatScores.length).toFixed(1) : '—'

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold font-body text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft size={13} /> Back to clients
      </button>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
          {client.company.split(' ').map(n => n[0]).join('').slice(0,2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-gray-900">{client.company}</p>
          <p className="text-xs text-gray-400 font-body flex items-center gap-1 mt-0.5">
            <MapPin size={9} />{client.city}, {client.country}
          </p>
        </div>
        <div className="flex gap-4 shrink-0">
          {!isCsat && (
            <div className="text-center">
              <p className="text-[10px] text-gray-400 font-body">Avg NPS</p>
              <p className="text-base font-bold font-display text-gray-800">{avgNps}</p>
            </div>
          )}
          {isCsat && (
            <div className="text-center">
              <p className="text-[10px] text-gray-400 font-body">Avg CSAT</p>
              <p className="text-base font-bold font-display text-gray-800">{avgCsat}/5</p>
            </div>
          )}
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-body">Responded</p>
            <p className="text-base font-bold font-display text-gray-800">{responded.length}/{client.respondents.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {client.respondents.map(r => (
          <div key={r.id} className="p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                r.status === 'Responded' ? 'bg-neon/20 text-gray-800' : 'bg-gray-100 text-gray-400'
              }`}>
                {r.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold font-body text-gray-800">{r.name}</span>
                  <span className="text-xs text-gray-400 font-body">{r.role}</span>
                </div>
                <p className="text-xs text-gray-400 font-body flex items-center gap-1 mt-0.5">
                  <Mail size={9} />{r.email}
                </p>
                {r.feedback && (
                  <p className="text-xs text-gray-500 font-body mt-1 italic">"{r.feedback}"</p>
                )}
              </div>
              <div className="shrink-0 text-right space-y-1">
                {r.status === 'Responded' ? (
                  isCsat && r.csat != null ? (
                    <div className="flex gap-0.5 justify-end">
                      {Array.from({length:5}).map((_,i) => (
                        <Star key={i} size={10} className={i < r.csat ? 'text-teal fill-teal' : 'text-gray-200 fill-gray-200'} />
                      ))}
                    </div>
                  ) : r.nps != null ? (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg font-body ${npsChipColor(r.nps)}`}>{r.nps}/10</span>
                  ) : null
                ) : (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-body uppercase ${
                    r.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>{r.status}</span>
                )}
                {r.date && (
                  <p className="text-[10px] text-gray-400 font-body">
                    {new Date(r.date).toLocaleDateString('en-US', { month:'short', day:'numeric' })}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Drill-down level 2: campaign clients ─────────────────────────────────────
function CampaignDetailView({ campaign, isCsat, onBack, onSelectClient }) {
  const allRespondents = campaign.clients.flatMap(c => c.respondents)
  const responded = allRespondents.filter(r => r.status === 'Responded')
  const responseRate = Math.round((responded.length / allRespondents.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold font-body text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft size={13} /> Back to surveys
      </button>

      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <p className="font-display font-semibold text-gray-900">{campaign.title}</p>
            <p className="text-xs text-gray-400 font-body flex items-center gap-1 mt-0.5">
              <Calendar size={9} />
              {new Date(campaign.sentDate).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 font-body">Response Rate</p>
              <p className="text-base font-bold font-display text-gray-800">{responseRate}%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 font-body">{isCsat ? 'Avg CSAT' : 'Avg NPS'}</p>
              <p className="text-base font-bold font-display text-gray-800">
                {isCsat ? `${campaign.avgCsat}/5` : campaign.avgNps}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs font-body text-gray-400 px-1">
        {campaign.clients.length} {campaign.clients.length === 1 ? 'client' : 'clients'} — click a client to see individual responses
      </p>

      <div className="space-y-2">
        {campaign.clients.map(client => {
          const cResponded = client.respondents.filter(r => r.status === 'Responded')
          const cNps = cResponded.filter(r => r.nps != null).map(r => r.nps)
          const avgNps = cNps.length ? Math.round(cNps.reduce((a,b) => a+b,0) / cNps.length) : null
          const cCsat = cResponded.filter(r => r.csat != null).map(r => r.csat)
          const avgCsat = cCsat.length ? (cCsat.reduce((a,b) => a+b,0) / cCsat.length).toFixed(1) : null

          return (
            <button
              key={client.clientId}
              onClick={() => onSelectClient(client)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-neon/30 hover:bg-neon/[0.02] transition-all group text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                {client.company.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold font-body text-gray-800">{client.company}</p>
                <p className="text-xs text-gray-400 font-body flex items-center gap-1 mt-0.5">
                  <MapPin size={9} />{client.city}, {client.country}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-gray-400 font-body">
                    <Users size={9} className="inline mr-0.5" />{cResponded.length}/{client.respondents.length}
                  </p>
                  {isCsat && avgCsat ? (
                    <p className="text-xs font-bold font-display text-teal">{avgCsat}/5</p>
                  ) : avgNps != null ? (
                    <span className={`text-xs font-bold font-display ${avgNps >= 9 ? 'text-emerald-600' : avgNps >= 7 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {avgNps}/10
                    </span>
                  ) : null}
                </div>
                <ArrowRight size={13} className="text-gray-300 group-hover:text-neon transition-colors" />
              </div>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Drill-down level 1: campaigns for a month ───────────────────────────────
function MonthDrillDown({ month, isCsat, onClose, onSelectCampaign }) {
  const mIdx = monthIndex[month]
  const campaigns = historyData.filter(c => {
    const d = new Date(c.sentDate)
    return d.getMonth() === mIdx
  })

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-3 border border-neon/20 bg-neon/[0.02] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neon/10">
          <p className="text-sm font-display font-semibold text-gray-800">Surveys in {month}</p>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={13} />
          </button>
        </div>
        <div className="p-3">
          {campaigns.length === 0 ? (
            <p className="text-sm text-gray-400 font-body py-3 text-center">No surveys sent in {month}</p>
          ) : (
            <div className="space-y-2">
              {campaigns.map(c => {
                const responseRate = Math.round((c.totalResponses / c.totalSent) * 100)
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectCampaign(c)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-neon/30 hover:bg-white transition-all group text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold font-body text-gray-800">{c.title}</p>
                      <p className="text-xs text-gray-400 font-body mt-0.5">
                        {new Date(c.sentDate).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                        {' · '}{c.clients.length} clients · {responseRate}% response rate
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-gray-400 font-body">{isCsat ? 'CSAT' : 'NPS'}</p>
                      <p className="text-sm font-bold font-display text-gray-800">
                        {isCsat ? `${c.avgCsat}/5` : c.avgNps}
                      </p>
                    </div>
                    <ArrowRight size={13} className="text-gray-300 group-hover:text-neon transition-colors shrink-0" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main widget ─────────────────────────────────────────────────────────────
export function YoYWidget({ surveyType }) {
  const isCsat = surveyType === 'csat'
  const { quarterly, movements } = yoyComparisonData

  const key    = isCsat ? 'csat' : 'nps'
  const latest = quarterly[quarterly.length - 1]
  const prev   = quarterly[quarterly.length - 2]

  const yoyChange = latest[`${key}2024`] - latest[`${key}2023`]
  const qoqChange = latest[`${key}2024`] - prev[`${key}2024`]
  const movedUp   = movements.filter((m) => m.from !== 'Promoter' && m.to === 'Promoter').length
  const movedDown = movements.filter((m) => m.from === 'Promoter' && m.to !== 'Promoter').length

  // Drill-down state: month → campaign → client
  const [drillMonth,    setDrillMonth]    = useState(null)  // e.g. 'Mar'
  const [drillCampaign, setDrillCampaign] = useState(null)  // campaign object
  const [drillClient,   setDrillClient]   = useState(null)  // client object

  const handleMonthClick = (month) => {
    if (drillMonth === month) {
      setDrillMonth(null)
      setDrillCampaign(null)
      setDrillClient(null)
    } else {
      setDrillMonth(month)
      setDrillCampaign(null)
      setDrillClient(null)
    }
  }

  const handleSelectCampaign = (c) => {
    setDrillCampaign(c)
    setDrillClient(null)
  }

  const handleBackToMonth = () => {
    setDrillCampaign(null)
    setDrillClient(null)
  }

  const handleBackToCampaign = () => {
    setDrillClient(null)
  }

  const closeDrill = () => {
    setDrillMonth(null)
    setDrillCampaign(null)
    setDrillClient(null)
  }

  return (
    <Card hover={false}>
      <CardHeader>
        <h3 className="font-display font-semibold text-gray-900">
          {isCsat ? 'CSAT' : 'NPS'} Trend &amp; Year-over-Year
        </h3>
        <p className="text-xs text-gray-400 font-body mt-0.5">
          Performance over time — click a point on the chart to explore surveys
        </p>

        {/* Quick stat pills */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            {
              label: 'YoY Change',
              value: `${yoyChange > 0 ? '+' : ''}${yoyChange}${isCsat ? '%' : 'pts'}`,
              color: yoyChange >= 0 ? 'text-emerald-600' : 'text-rose-500',
              icon: yoyChange >= 0 ? TrendingUp : TrendingDown,
            },
            { label: 'Moved Up',   value: movedUp,   color: 'text-emerald-600', icon: TrendingUp },
            { label: 'Moved Down', value: movedDown,  color: 'text-rose-500',   icon: TrendingDown },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-gray-400 font-body uppercase tracking-wide mb-0.5">{label}</p>
              <div className="flex items-center justify-center gap-1">
                <Icon size={11} className={color} />
                <p className={`text-base font-bold font-display ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {/* Trend chart — clickable */}
        <NpsTrendChart mode={surveyType} onMonthClick={handleMonthClick} />

        {/* QoQ summary row */}
        <div className="flex items-center justify-between mt-3 px-1 text-xs font-body text-gray-400">
          <span>Last 8 months · click a point to explore</span>
          <span className={`font-semibold ${qoqChange >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            QoQ: {qoqChange >= 0 ? '+' : ''}{qoqChange}{isCsat ? '%' : 'pts'} vs Q3
          </span>
        </div>

        {/* Drill-down: month → campaigns */}
        <AnimatePresence>
          {drillMonth && !drillCampaign && !drillClient && (
            <MonthDrillDown
              key={drillMonth}
              month={drillMonth}
              isCsat={isCsat}
              onClose={closeDrill}
              onSelectCampaign={handleSelectCampaign}
            />
          )}
        </AnimatePresence>

        {/* Drill-down: campaign → clients */}
        <AnimatePresence>
          {drillCampaign && !drillClient && (
            <motion.div
              key="campaign-detail"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 border border-gray-100 rounded-2xl p-4">
                <CampaignDetailView
                  campaign={drillCampaign}
                  isCsat={isCsat}
                  onBack={handleBackToMonth}
                  onSelectClient={setDrillClient}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drill-down: client → responses */}
        <AnimatePresence>
          {drillClient && (
            <motion.div
              key="client-detail"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 border border-gray-100 rounded-2xl p-4 max-h-80 overflow-y-auto">
                <ClientDetailView
                  client={drillClient}
                  isCsat={isCsat}
                  onBack={handleBackToCampaign}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* YoY quarterly table — hidden when drill-down is active */}
        {!drillMonth && (
          <>
            <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
              <div className="grid grid-cols-5 bg-gray-50 px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-body">
                <span>Quarter</span>
                <span className="text-right">2023</span>
                <span className="text-right">2024</span>
                <span className="text-right col-span-2 pr-1">Change</span>
              </div>
              {quarterly.map((q) => {
                const v23  = q[`${key}2023`]
                const v24  = q[`${key}2024`]
                const diff = v24 - v23
                return (
                  <div key={q.quarter} className="grid grid-cols-5 px-3 py-2.5 border-t border-gray-50 text-sm font-body items-center">
                    <span className="font-semibold text-gray-700">{q.quarter}</span>
                    <span className="text-right text-gray-500">{v23}{isCsat ? '%' : ''}</span>
                    <span className="text-right font-semibold text-gray-800">{v24}{isCsat ? '%' : ''}</span>
                    <span className={`text-right col-span-2 text-xs font-bold font-display ${diff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {diff >= 0 ? '▲' : '▼'} {Math.abs(diff)}{isCsat ? '%' : 'pts'}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Account movements */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-display font-semibold text-gray-800">Account Category Movements</h4>
                <span className="text-xs text-gray-400 font-body">2023 → 2024</span>
              </div>
              <div className="max-h-44 overflow-y-auto">
                {movements.map((m, i) => <MovementRow key={i} m={m} />)}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
