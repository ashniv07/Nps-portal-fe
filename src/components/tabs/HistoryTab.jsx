import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, ChevronDown, Star, Filter, X,
  MapPin, MessageSquare, Users, Clock, Mail,
  Building2, TrendingUp,
} from 'lucide-react'
import { historyData } from '../../data/dummyData'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('')
}

function NpsChip({ score }) {
  const color =
    score >= 9 ? 'bg-emerald-100 text-emerald-700' :
    score >= 7 ? 'bg-amber-100 text-amber-700' :
    'bg-rose-100 text-rose-600'
  return (
    <span className={`text-xs font-semibold font-body px-2 py-0.5 rounded-lg ${color}`}>
      {score}/10
    </span>
  )
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

// ─── Individual respondent row ───────────────────────────────────────────────
function RespondentRow({ respondent, isCsat }) {
  const responded = respondent.status === 'Responded'
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-white/70 transition-colors"
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        responded ? 'bg-neon/20 text-gray-800' : 'bg-gray-100 text-gray-400'
      }`}>
        {initials(respondent.name)}
      </div>

      {/* Name / role / feedback */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-800 font-body">{respondent.name}</span>
          <span className="text-xs text-gray-400 font-body">{respondent.role}</span>
          {!responded && <StatusPill status={respondent.status} />}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Mail size={10} className="text-gray-300 shrink-0" />
          <span className="text-xs text-gray-400 font-body">{respondent.email}</span>
        </div>
        {respondent.feedback && (
          <p className="text-xs text-gray-500 font-body mt-1 italic line-clamp-2">
            "{respondent.feedback}"
          </p>
        )}
      </div>

      {/* Score + date */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        {responded ? (
          isCsat
            ? respondent.csat != null && <CsatStars score={respondent.csat} />
            : respondent.nps != null && <NpsChip score={respondent.nps} />
        ) : (
          <span className="text-xs text-gray-300 font-body">—</span>
        )}
        {respondent.date && (
          <span className="text-[10px] text-gray-400 font-body">
            {new Date(respondent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ─── Client accordion (second level) ────────────────────────────────────────
function ClientAccordion({ client, isCsat }) {
  const [open, setOpen] = useState(false)
  const responded = client.respondents.filter((r) => r.status === 'Responded')
  const avgNps = responded.filter((r) => r.nps != null).reduce((s, r, _, a) => s + r.nps / a.length, 0)
  const avgCsat = responded.filter((r) => r.csat != null).reduce((s, r, _, a) => s + r.csat / a.length, 0)

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white/50">
      {/* Client header row */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors text-left"
      >
        {/* Company avatar */}
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
          {initials(client.company)}
        </div>

        {/* Company info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 font-body">{client.company}</p>
          <p className="text-xs text-gray-400 font-body flex items-center gap-1 mt-0.5">
            <MapPin size={9} />
            {client.city}, {client.country}
          </p>
        </div>

        {/* Response count + score */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400 font-body">{responded.length}/{client.respondents.length} responded</p>
            {responded.length > 0 && (
              isCsat && avgCsat > 0
                ? <CsatStars score={Math.round(avgCsat)} />
                : !isCsat && avgNps > 0
                  ? <NpsChip score={Math.round(avgNps)} />
                  : null
            )}
          </div>
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Respondents list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 bg-gray-50/60 px-2 py-2 space-y-0.5">
              {client.respondents.map((r) => (
                <RespondentRow key={r.id} respondent={r} isCsat={isCsat} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Campaign widget (top level) ────────────────────────────────────────────
function CampaignWidget({ campaign, isCsat }) {
  const [open, setOpen] = useState(campaign.status === 'Active')
  const responseRate = Math.round((campaign.totalResponses / campaign.totalSent) * 100)
  const totalClients = campaign.clients.length
  const totalRespondents = campaign.clients.reduce((s, c) => s + c.respondents.length, 0)

  return (
    <motion.div variants={item} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${
      campaign.status === 'Active'
        ? 'border-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.1)]'
        : 'border-gray-100 hover:border-gray-200'
    }`}>

      {/* Campaign header */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full text-left"
      >
        <div className="px-5 py-5 flex items-center gap-4">
          {/* Status stripe */}
          <div className={`w-1 h-12 rounded-full shrink-0 ${
            campaign.status === 'Active' ? 'bg-emerald-400' : 'bg-gray-200'
          }`} />

          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            campaign.status === 'Active' ? 'bg-emerald-50' : 'bg-gray-50'
          }`}>
            <MessageSquare size={18} className={campaign.status === 'Active' ? 'text-emerald-600' : 'text-gray-400'} />
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-gray-900">{campaign.title}</h3>
              <StatusPill status={campaign.status} />
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-xs text-gray-400 font-body flex items-center gap-1">
                <Calendar size={10} />
                {new Date(campaign.sentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-xs text-gray-400 font-body flex items-center gap-1">
                <Building2 size={10} />
                {totalClients} {totalClients === 1 ? 'client' : 'clients'}
              </span>
              <span className="text-xs text-gray-400 font-body flex items-center gap-1">
                <Users size={10} />
                {totalRespondents} contacts
              </span>
            </div>
          </div>

          {/* Score + rate */}
          <div className="shrink-0 text-right hidden sm:block">
            <p className="text-xs text-gray-400 font-body mb-1">{isCsat ? 'Avg CSAT' : 'Avg NPS'}</p>
            {isCsat ? (
              <div className="flex items-center gap-1 justify-end">
                <CsatStars score={Math.round(campaign.avgCsat)} />
                <span className="text-sm font-bold font-display text-gray-800 ml-1">{campaign.avgCsat}</span>
              </div>
            ) : (
              <span className={`text-sm font-bold font-display px-2.5 py-0.5 rounded-lg ${
                campaign.avgNps >= 50 ? 'bg-emerald-100 text-emerald-700' :
                campaign.avgNps >= 30 ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-600'
              }`}>
                {campaign.avgNps}
              </span>
            )}
            <p className="text-[10px] text-gray-400 font-body mt-1 flex items-center gap-1 justify-end">
              <TrendingUp size={9} />
              {responseRate}% response rate
            </p>
          </div>

          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Stats bar */}
        <div className="px-5 pb-4 flex items-center gap-4 flex-wrap border-t border-gray-50 pt-3 sm:hidden">
          <span className="text-xs text-gray-500 font-body">
            {isCsat ? `CSAT ${campaign.avgCsat}/5` : `NPS ${campaign.avgNps}`}
          </span>
          <span className="text-xs text-gray-400 font-body">{responseRate}% response rate</span>
          <span className="text-xs text-gray-400 font-body">{campaign.totalResponses}/{campaign.totalSent} sent</span>
        </div>
      </button>

      {/* Expanded: clients list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-4 py-4 space-y-3 bg-gray-50/40">
              {/* Section label */}
              <div className="flex items-center gap-2 px-1 pb-1">
                <Building2 size={12} className="text-gray-400" />
                <span className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400">
                  Clients in this survey
                </span>
              </div>
              {campaign.clients.map((client) => (
                <ClientAccordion key={client.clientId} client={client} isCsat={isCsat} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main tab ────────────────────────────────────────────────────────────────
export function HistoryTab({ surveyType = 'nps' }) {
  const isCsat = surveyType === 'csat'
  const [dateFrom, setDateFrom]   = useState('')
  const [dateTo, setDateTo]       = useState('')
  const [scoreMin, setScoreMin]   = useState('')
  const [scoreMax, setScoreMax]   = useState('')
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

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">

      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-semibold text-gray-900 text-xl">Survey History</h2>
          <p className="text-sm text-gray-400 font-body mt-0.5">
            {filtered.length} campaigns · {filtered.reduce((s, c) => s + c.clients.length, 0)} clients
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-rose-500 hover:text-rose-700 font-body flex items-center gap-1 transition-colors"
            >
              <X size={13} /> Clear
            </button>
          )}
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-body transition-all ${
              showFilters || hasFilters
                ? 'border-neon/60 text-gray-800 bg-neon/10'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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
      </motion.div>

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
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 transition-all bg-gray-50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-body block mb-1.5 uppercase tracking-wider">Date To</label>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 transition-all bg-gray-50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-body block mb-1.5 uppercase tracking-wider">
                    Min {isCsat ? 'CSAT' : 'NPS'}
                  </label>
                  <input type="number" placeholder={isCsat ? '1' : '0'} value={scoreMin}
                    onChange={(e) => setScoreMin(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 transition-all bg-gray-50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-body block mb-1.5 uppercase tracking-wider">
                    Max {isCsat ? 'CSAT' : 'NPS'}
                  </label>
                  <input type="number" placeholder={isCsat ? '5' : '100'} value={scoreMax}
                    onChange={(e) => setScoreMax(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 transition-all bg-gray-50" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaign widgets */}
      {filtered.length === 0 ? (
        <motion.div variants={item} className="py-20 text-center">
          <Calendar size={44} className="text-gray-200 mx-auto mb-3" />
          <p className="font-display font-semibold text-gray-400 text-lg">No campaigns found</p>
          <p className="text-sm text-gray-400 font-body mt-1">Try adjusting your filters</p>
        </motion.div>
      ) : (
        filtered.map((campaign) => (
          <CampaignWidget key={campaign.id} campaign={campaign} isCsat={isCsat} />
        ))
      )}

    </motion.div>
  )
}
