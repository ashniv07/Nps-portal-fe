import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, ChevronLeft, Star, Filter, X,
  MapPin, Mail, Users, TrendingUp, TrendingDown,
  Building2, MessageSquare, BarChart2, ArrowRight,
} from 'lucide-react'
import { historyData } from '../../data/dummyData'

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('')
}

function StatusPill({ status }) {
  const styles = {
    Active:    'bg-emerald-100 text-emerald-700',
    Completed: 'bg-gray-100 text-gray-500',
    Pending:   'bg-amber-100 text-amber-600',
    Sent:      'bg-blue-100 text-blue-600',
    Responded: 'bg-emerald-100 text-emerald-700',
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-body uppercase tracking-wide ${styles[status] || 'bg-gray-100 text-gray-400'}`}>
      {status}
    </span>
  )
}

function NpsChip({ score }) {
  const color = score >= 9 ? 'bg-emerald-100 text-emerald-700' : score >= 7 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-600'
  return <span className={`text-xs font-semibold font-body px-2 py-0.5 rounded-lg ${color}`}>{score}/10</span>
}

function CsatStars({ score }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} className={i < score ? 'text-teal fill-teal' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

// ─── Compute campaign stats ──────────────────────────────────────────────────
function computeCampaignStats(campaign) {
  const all = campaign.clients.flatMap(c => c.respondents)
  const responded = all.filter(r => r.status === 'Responded')
  const npsScores = responded.filter(r => r.nps != null).map(r => r.nps)
  const csatScores = responded.filter(r => r.csat != null).map(r => r.csat)
  const promoters = npsScores.filter(s => s >= 9)
  const passives  = npsScores.filter(s => s >= 7 && s < 9)
  const detractors = npsScores.filter(s => s < 7)
  const pPct = npsScores.length ? Math.round((promoters.length / npsScores.length) * 100) : 0
  const paPct = npsScores.length ? Math.round((passives.length / npsScores.length) * 100) : 0
  const dPct = npsScores.length ? Math.round((detractors.length / npsScores.length) * 100) : 0
  const npsScore = npsScores.length ? Math.round(((promoters.length - detractors.length) / npsScores.length) * 100) : 0
  const avgCsat = csatScores.length ? (csatScores.reduce((a,b) => a+b,0) / csatScores.length).toFixed(1) : null
  const responseRate = all.length ? Math.round((responded.length / all.length) * 100) : 0
  const topFeedbacks = responded.filter(r => r.feedback).slice(0, 3)
  return { all, responded, responseRate, npsScores, csatScores, promoterPct: pPct, passivePct: paPct, detractorPct: dPct, computedNps: npsScore, avgCsat, topFeedbacks }
}

// ─── Client detail panel (level 2) ──────────────────────────────────────────
function ClientDetailPanel({ client, isCsat, onBack }) {
  const responded = client.respondents.filter(r => r.status === 'Responded')
  const npsScores = responded.filter(r => r.nps != null).map(r => r.nps)
  const csatScores = responded.filter(r => r.csat != null).map(r => r.csat)
  const avgNps = npsScores.length ? (npsScores.reduce((a,b) => a+b,0) / npsScores.length).toFixed(1) : '—'
  const avgCsat = csatScores.length ? (csatScores.reduce((a,b) => a+b,0) / csatScores.length).toFixed(1) : '—'
  const responseRate = client.respondents.length ? Math.round((responded.length / client.respondents.length) * 100) : 0

  return (
    <motion.div
      key="client-detail"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="h-full flex flex-col"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold font-body text-gray-500 hover:text-gray-800 transition-colors mb-4 shrink-0"
      >
        <ChevronLeft size={13} /> Back to campaign
      </button>

      {/* Client header */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-4 shrink-0">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
          {initials(client.company)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-gray-900">{client.company}</p>
          <p className="text-xs text-gray-400 font-body flex items-center gap-1 mt-0.5">
            <MapPin size={9} />{client.city}, {client.country}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4 shrink-0">
        {[
          { label: 'Responded', value: `${responded.length}/${client.respondents.length}`, sub: `${responseRate}% rate` },
          isCsat
            ? { label: 'Avg CSAT', value: `${avgCsat}/5`, sub: 'satisfaction' }
            : { label: 'Avg NPS', value: avgNps, sub: 'out of 10' },
          { label: 'Contacts', value: client.respondents.length, sub: 'total' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="border border-gray-100 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-400 font-body uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold font-display text-gray-900 mt-0.5">{value}</p>
            <p className="text-[10px] text-gray-400 font-body">{sub}</p>
          </div>
        ))}
      </div>

      {/* Respondent list */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        <p className="text-xs font-bold font-body uppercase tracking-widest text-gray-400 px-1 mb-2">Individual Responses</p>
        {client.respondents.map(r => (
          <div key={r.id} className="p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                r.status === 'Responded' ? 'bg-neon/20 text-gray-800' : 'bg-gray-100 text-gray-400'
              }`}>
                {initials(r.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold font-body text-gray-800">{r.name}</span>
                  <span className="text-xs text-gray-400 font-body">{r.role}</span>
                  {r.status !== 'Responded' && <StatusPill status={r.status} />}
                </div>
                <p className="text-xs text-gray-400 font-body flex items-center gap-1 mt-0.5">
                  <Mail size={9} />{r.email}
                </p>
                {r.feedback && (
                  <p className="text-xs text-gray-500 font-body mt-1.5 italic leading-relaxed">
                    "{r.feedback}"
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right space-y-1">
                {r.status === 'Responded' ? (
                  isCsat && r.csat != null ? (
                    <CsatStars score={r.csat} />
                  ) : r.nps != null ? (
                    <NpsChip score={r.nps} />
                  ) : null
                ) : null}
                {r.date && (
                  <p className="text-[10px] text-gray-400 font-body">
                    {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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

// ─── Campaign detail panel (level 1) ────────────────────────────────────────
function CampaignDetailPanel({ campaign, isCsat, onBack, onSelectClient }) {
  const stats = computeCampaignStats(campaign)

  return (
    <motion.div
      key="campaign-detail"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="h-full flex flex-col"
    >
      {/* Mobile back */}
      <button
        onClick={onBack}
        className="flex lg:hidden items-center gap-1.5 text-xs font-semibold font-body text-gray-500 hover:text-gray-800 transition-colors mb-4 shrink-0"
      >
        <ChevronLeft size={13} /> All campaigns
      </button>

      {/* Campaign header */}
      <div className="shrink-0 mb-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-display font-semibold text-gray-900 text-lg">{campaign.title}</h3>
              <StatusPill status={campaign.status} />
            </div>
            <p className="text-xs text-gray-400 font-body flex items-center gap-1">
              <Calendar size={10} />
              {new Date(campaign.sentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="shrink-0 mb-4">
        <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400 mb-2">Executive Summary</p>

        {/* Key stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {[
            { label: 'Sent', value: campaign.totalSent, icon: Mail },
            { label: 'Responded', value: `${stats.responded.length}`, icon: Users },
            { label: 'Response Rate', value: `${stats.responseRate}%`, icon: BarChart2 },
            isCsat
              ? { label: 'Avg CSAT', value: stats.avgCsat ? `${stats.avgCsat}/5` : '—', icon: Star }
              : { label: 'NPS Score', value: stats.computedNps, icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="border border-gray-100 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Icon size={12} className="text-gray-400" />
              </div>
              <p className="text-lg font-bold font-display text-gray-900">{value}</p>
              <p className="text-[10px] text-gray-400 font-body">{label}</p>
            </div>
          ))}
        </div>

        {/* NPS breakdown bars */}
        {!isCsat && stats.npsScores.length > 0 && (
          <div className="border border-gray-100 rounded-xl p-4 mb-3">
            <p className="text-xs font-semibold font-body text-gray-600 mb-3">NPS Breakdown</p>
            <div className="space-y-2.5">
              {[
                { label: 'Promoters', pct: stats.promoterPct, color: 'bg-emerald-500', text: 'text-emerald-600' },
                { label: 'Passives',  pct: stats.passivePct,  color: 'bg-amber-400',   text: 'text-amber-500' },
                { label: 'Detractors',pct: stats.detractorPct,color: 'bg-rose-500',    text: 'text-rose-500' },
              ].map(({ label, pct, color, text }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs font-body text-gray-500 w-20 shrink-0">{label}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100">
                    <motion.div
                      className={`h-2 rounded-full ${color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <span className={`text-xs font-bold font-display w-10 text-right ${text}`}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top feedback quotes */}
        {stats.topFeedbacks.length > 0 && (
          <div className="border border-gray-100 rounded-xl p-4 mb-3">
            <p className="text-xs font-semibold font-body text-gray-600 mb-2.5">Top Feedback</p>
            <div className="space-y-2.5">
              {stats.topFeedbacks.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0 mt-0.5">
                    {initials(r.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-body italic leading-relaxed">"{r.feedback}"</p>
                    <p className="text-[10px] text-gray-400 font-body mt-0.5">{r.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Client list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex items-center gap-2 px-1 mb-2 shrink-0">
          <Building2 size={12} className="text-gray-400" />
          <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400">
            Clients in this campaign
          </p>
        </div>
        <div className="space-y-2">
          {campaign.clients.map(client => {
            const cRespondents = client.respondents
            const cResponded = cRespondents.filter(r => r.status === 'Responded')
            const cNps = cResponded.filter(r => r.nps != null).map(r => r.nps)
            const cCsat = cResponded.filter(r => r.csat != null).map(r => r.csat)
            const avgNps = cNps.length ? Math.round(cNps.reduce((a,b) => a+b,0) / cNps.length) : null
            const avgCsat = cCsat.length ? (cCsat.reduce((a,b) => a+b,0) / cCsat.length).toFixed(1) : null

            return (
              <button
                key={client.clientId}
                onClick={() => onSelectClient(client)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-neon/30 hover:bg-neon/[0.02] transition-all group text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                  {initials(client.company)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold font-body text-gray-800">{client.company}</p>
                  <p className="text-xs text-gray-400 font-body flex items-center gap-1 mt-0.5">
                    <MapPin size={9} />{client.city}, {client.country}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400 font-body">{cResponded.length}/{cRespondents.length} responded</p>
                    {isCsat && avgCsat ? (
                      <p className="text-xs font-bold font-display text-teal">{avgCsat}/5</p>
                    ) : avgNps != null ? (
                      <p className={`text-xs font-bold font-display ${avgNps >= 9 ? 'text-emerald-600' : avgNps >= 7 ? 'text-amber-500' : 'text-rose-500'}`}>
                        NPS {avgNps}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 font-body">No scores</p>
                    )}
                  </div>
                  <ArrowRight size={13} className="text-gray-300 group-hover:text-neon transition-colors" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Campaign list card (left column) ───────────────────────────────────────
function CampaignCard({ campaign, isCsat, isSelected, onClick }) {
  const responseRate = Math.round((campaign.totalResponses / campaign.totalSent) * 100)
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
        isSelected
          ? 'border-neon/40 bg-neon/5 shadow-sm'
          : campaign.status === 'Active'
          ? 'border-emerald-200 bg-white hover:border-emerald-300 hover:shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          campaign.status === 'Active' ? 'bg-emerald-50' : 'bg-gray-50'
        }`}>
          <MessageSquare size={16} className={campaign.status === 'Active' ? 'text-emerald-600' : 'text-gray-400'} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-sm font-semibold font-body text-gray-800 truncate">{campaign.title}</p>
            <StatusPill status={campaign.status} />
          </div>
          <p className="text-xs text-gray-400 font-body flex items-center gap-1">
            <Calendar size={9} />
            {new Date(campaign.sentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] font-body text-gray-400 flex items-center gap-0.5">
              <Building2 size={9} /> {campaign.clients.length} clients
            </span>
            <span className="text-[10px] font-body text-gray-400">{responseRate}% responded</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          {isCsat ? (
            <p className="text-sm font-bold font-display text-teal">{campaign.avgCsat}/5</p>
          ) : (
            <p className={`text-sm font-bold font-display ${
              campaign.avgNps >= 50 ? 'text-emerald-600' : campaign.avgNps >= 30 ? 'text-amber-500' : 'text-rose-500'
            }`}>{campaign.avgNps}</p>
          )}
          <p className="text-[10px] text-gray-400 font-body mt-0.5">{isCsat ? 'CSAT' : 'NPS'}</p>
        </div>
      </div>
    </button>
  )
}

// ─── Main HistoryTab ─────────────────────────────────────────────────────────
export function HistoryTab({ surveyType = 'nps' }) {
  const isCsat = surveyType === 'csat'
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [selectedClient,   setSelectedClient]   = useState(null)
  const [dateFrom,  setDateFrom]  = useState('')
  const [dateTo,    setDateTo]    = useState('')
  const [scoreMin,  setScoreMin]  = useState('')
  const [scoreMax,  setScoreMax]  = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = historyData.filter((c) => {
    if (dateFrom && new Date(c.sentDate) < new Date(dateFrom)) return false
    if (dateTo   && new Date(c.sentDate) > new Date(dateTo))   return false
    const score = isCsat ? c.avgCsat : c.avgNps
    if (scoreMin && score < Number(scoreMin)) return false
    if (scoreMax && score > Number(scoreMax)) return false
    return true
  })

  const hasFilters = dateFrom || dateTo || scoreMin || scoreMax
  const clearFilters = () => { setDateFrom(''); setDateTo(''); setScoreMin(''); setScoreMax('') }

  const handleSelectCampaign = (campaign) => {
    setSelectedCampaign(campaign)
    setSelectedClient(null)
  }

  const handleSelectClient = (client) => {
    setSelectedClient(client)
  }

  const handleBackToCampaign = () => {
    setSelectedClient(null)
  }

  const handleBackToList = () => {
    setSelectedCampaign(null)
    setSelectedClient(null)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-semibold text-gray-900 text-xl">Survey History</h2>
          <p className="text-sm text-gray-400 font-body mt-0.5">
            {filtered.length} campaigns · {filtered.reduce((s, c) => s + c.clients.length, 0)} clients
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-rose-500 hover:text-rose-700 font-body flex items-center gap-1 transition-colors">
              <X size={13} /> Clear
            </button>
          )}
          <button
            onClick={() => setShowFilters(p => !p)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-body transition-all ${
              showFilters || hasFilters ? 'border-neon/60 text-gray-800 bg-neon/10' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter size={15} />
            Filters
            {hasFilters && (
              <span className="w-4 h-4 rounded-full bg-neon text-black text-[10px] font-bold flex items-center justify-center">
                {[dateFrom, dateTo, scoreMin, scoreMax].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-body block mb-1.5 uppercase tracking-wider">Date From</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 bg-gray-50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-body block mb-1.5 uppercase tracking-wider">Date To</label>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 bg-gray-50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-body block mb-1.5 uppercase tracking-wider">Min {isCsat ? 'CSAT' : 'NPS'}</label>
                  <input type="number" placeholder={isCsat ? '1' : '0'} value={scoreMin} onChange={e => setScoreMin(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 bg-gray-50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-body block mb-1.5 uppercase tracking-wider">Max {isCsat ? 'CSAT' : 'NPS'}</label>
                  <input type="number" placeholder={isCsat ? '5' : '100'} value={scoreMax} onChange={e => setScoreMax(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 bg-gray-50" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2-column layout */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Calendar size={44} className="text-gray-200 mx-auto mb-3" />
          <p className="font-display font-semibold text-gray-400 text-lg">No campaigns found</p>
          <p className="text-sm text-gray-400 font-body mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 items-start">

          {/* Left — campaign list (hidden on mobile when detail is open) */}
          <div className={`space-y-3 ${selectedCampaign ? 'hidden lg:block' : ''}`}>
            {filtered.map(campaign => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <CampaignCard
                  campaign={campaign}
                  isCsat={isCsat}
                  isSelected={selectedCampaign?.id === campaign.id}
                  onClick={() => handleSelectCampaign(campaign)}
                />
              </motion.div>
            ))}
          </div>

          {/* Right — detail panel */}
          <div className={`${!selectedCampaign ? 'hidden lg:flex' : 'flex'} flex-col`}>
            {!selectedCampaign ? (
              /* Empty state */
              <div className="border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center py-20 text-center">
                <MessageSquare size={36} className="text-gray-200 mb-3" />
                <p className="font-display font-semibold text-gray-400">Select a campaign</p>
                <p className="text-sm text-gray-400 font-body mt-1">Click any campaign on the left to view details</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-h-[600px]">
                <AnimatePresence mode="wait">
                  {selectedClient ? (
                    <ClientDetailPanel
                      key={`client-${selectedClient.clientId}`}
                      client={selectedClient}
                      isCsat={isCsat}
                      onBack={handleBackToCampaign}
                    />
                  ) : (
                    <CampaignDetailPanel
                      key={`campaign-${selectedCampaign.id}`}
                      campaign={selectedCampaign}
                      isCsat={isCsat}
                      onBack={handleBackToList}
                      onSelectClient={handleSelectClient}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
