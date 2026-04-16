import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  ChevronRight,
  ChevronDown,
  Star,
  Filter,
  X,
  TrendingUp,
  MapPin,
  MessageSquare,
  Users,
  Clock,
  Mail,
} from 'lucide-react'
import { Card } from '../ui/Card'
import { StatusBadge } from '../ui/Badge'
import { historyData, clientsData } from '../../data/dummyData'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

function getClient(clientId) {
  return clientsData.find((c) => c.id === clientId) || null
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
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < score ? 'text-teal fill-teal' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

// ─── Respondent row ──────────────────────────────────────────────────────────
function RespondentRow({ respondent, surveyType, isSelected, onClick }) {
  const isCsat = surveyType === 'csat'
  const ini = initials(respondent.name)
  const responded = respondent.status === 'Responded'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 group ${
        isSelected
          ? isCsat
            ? 'bg-neon/8 ring-1 ring-neon/30'
            : 'bg-neon/8 ring-1 ring-neon/30'
          : 'hover:bg-gray-50'
      }`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        responded
          ? isCsat
            ? 'bg-neon/15 text-gray-800'
            : 'bg-neon/20 text-gray-800'
          : 'bg-gray-100 text-gray-400'
      }`}>
        {ini}
      </div>

      {/* Name + role */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-800 font-body">{respondent.name}</span>
          <span className="text-xs text-gray-400 font-body">{respondent.role}</span>
          {!responded && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-body ${
              respondent.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {respondent.status}
            </span>
          )}
        </div>
        {respondent.feedback && (
          <p className="text-xs text-gray-500 font-body mt-0.5 line-clamp-1 italic">
            "{respondent.feedback}"
          </p>
        )}
        {!responded && (
          <p className="text-xs text-gray-400 font-body mt-0.5">{respondent.email}</p>
        )}
      </div>

      {/* Score */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        {responded ? (
          isCsat
            ? respondent.csat && <CsatStars score={respondent.csat} />
            : respondent.nps != null && <NpsChip score={respondent.nps} />
        ) : (
          <span className="text-xs text-gray-400 font-body">—</span>
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

// ─── Right-side detail panel ─────────────────────────────────────────────────
function DetailPanel({ survey, client, selectedRespondent, onClose, surveyType }) {
  if (!survey || !client) return null
  const isCsat = surveyType === 'csat'
  const ini = initials(client.name)
  const responseRate = Math.round((survey.responses / survey.totalSent) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 shrink-0">
            {ini}
          </div>
          <div>
            <h3 className="font-display font-semibold text-gray-900 leading-tight">{client.company}</h3>
            <p className="text-sm text-gray-500 font-body">{survey.title} · {survey.id}</p>
            <p className="text-xs text-gray-400 font-body flex items-center gap-1 mt-0.5">
              <MapPin size={10} /> {client.city}, {client.country}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-260px)] scrollbar-thin">

        {/* Score hero */}
        <div className="text-center p-5 rounded-2xl relative overflow-hidden bg-gradient-to-br from-neon to-yellow-300">
          <div className="absolute inset-0 opacity-10" style={{
            background: 'radial-gradient(circle at 50% 0%, #fff, transparent 70%)',
          }} />
          {isCsat ? (
            <>
              <p className="text-xs text-black/60 font-body uppercase tracking-wider mb-2">Avg CSAT</p>
              <div className="flex items-end justify-center gap-1">
                <p className="text-5xl font-bold font-display text-black leading-none">{survey.avgCsat}</p>
                <p className="text-lg font-display text-black/40 mb-0.5">/5</p>
              </div>
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < Math.round(survey.avgCsat) ? 'fill-black/80 text-black/80' : 'fill-black/20 text-black/20'} />
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-black/60 font-body uppercase tracking-wider mb-2">Net Promoter Score</p>
              <p className="text-5xl font-bold font-display text-black leading-none">{survey.avgNps}</p>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <TrendingUp size={12} className="text-black/50" />
                <span className="text-xs text-black/50 font-body">+4 vs previous campaign</span>
              </div>
            </>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="bg-black/10 rounded-xl p-2.5">
              <p className="text-xs text-black/50 font-body">Response Rate</p>
              <span className="text-lg font-bold font-display text-black">{responseRate}%</span>
            </div>
            <div className="bg-black/10 rounded-xl p-2.5">
              <p className="text-xs text-black/50 font-body">Total Sent</p>
              <span className="text-lg font-bold font-display text-black">{survey.totalSent}</span>
            </div>
          </div>
        </div>

        {/* Campaign meta */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Users, label: 'Responses', value: `${survey.responses} / ${survey.totalSent}` },
            { icon: Clock, label: 'Status', value: survey.status },
            { icon: Calendar, label: 'Sent', value: new Date(survey.sentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { icon: MessageSquare, label: 'Campaign', value: survey.id },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
              <Icon size={13} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-body uppercase tracking-wider">{label}</p>
                <p className="text-sm font-body font-semibold text-gray-800 leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Selected respondent spotlight */}
        {selectedRespondent && selectedRespondent.status === 'Responded' && (
          <div>
            <h4 className="font-display font-semibold text-gray-800 mb-3 text-sm">Spotlight Response</h4>
            <div className={`p-4 rounded-xl border ${
              'border-neon/20 bg-neon/5'
            }`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  'bg-neon/20 text-gray-800'
                }`}>
                  {initials(selectedRespondent.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 font-body">{selectedRespondent.name}</p>
                  <p className="text-xs text-gray-500 font-body">{selectedRespondent.role} · {client.company}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Mail size={10} className="text-gray-400" />
                    <span className="text-xs text-gray-400 font-body">{selectedRespondent.email}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  {isCsat
                    ? selectedRespondent.csat && <CsatStars score={selectedRespondent.csat} />
                    : selectedRespondent.nps != null && <NpsChip score={selectedRespondent.nps} />
                  }
                </div>
              </div>
              {selectedRespondent.feedback && (
                <p className="text-sm text-gray-600 font-body leading-relaxed italic">
                  "{selectedRespondent.feedback}"
                </p>
              )}
              {selectedRespondent.date && (
                <p className="text-xs text-gray-400 font-body mt-2">
                  {new Date(selectedRespondent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* All respondents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-display font-semibold text-gray-800 text-sm">All Respondents</h4>
            <span className="text-xs text-gray-400 font-body">{survey.respondents?.length || 0} surveyed</span>
          </div>
          <div className="space-y-1">
            {(survey.respondents || []).map((r) => (
              <RespondentRow
                key={r.id}
                respondent={r}
                surveyType={surveyType}
                isSelected={selectedRespondent?.id === r.id}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  )
}

// ─── Survey card with inline respondents accordion ───────────────────────────
function SurveyCard({ survey, client, surveyType, isSelected, onSelect, expandedRespondent, onRespondentSelect }) {
  const [respondentsOpen, setRespondentsOpen] = useState(false)
  const isCsat = surveyType === 'csat'
  const ini = client ? initials(client.name) : '?'

  return (
    <motion.div variants={item} className={`bg-white rounded-xl border transition-all duration-200 ${
      isSelected
        ? isCsat
          ? 'border-teal/60 shadow-[0_0_20px_rgba(15,126,109,0.15)] ring-1 ring-teal/20'
          : 'border-neon/60 shadow-neon ring-1 ring-neon/20'
        : 'border-gray-100 hover:border-gray-200 hover:shadow-card-hover'
    }`}>
      {/* Main row — click to open right panel */}
      <div
        className="p-5 flex items-center gap-4 cursor-pointer group"
        onClick={() => onSelect()}
      >
        {/* Status band */}
        <div className={`w-1 h-14 rounded-full shrink-0 ${
          survey.status === 'Active' ? 'bg-neon' : 'bg-gray-200'
        }`} />

        {/* Company avatar */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
          {ini}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <p className="font-body font-semibold text-gray-900">{client?.company || 'Unknown'}</p>
            <StatusBadge status={survey.status} />
          </div>
          <p className="text-sm text-gray-500 font-body">{survey.title}</p>
          <p className="text-xs text-gray-400 font-body mt-0.5 flex items-center gap-1.5">
            <MapPin size={10} />
            {client?.city}, {client?.country}
            <span className="text-gray-200 mx-1">·</span>
            <Calendar size={10} />
            {new Date(survey.sentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Score */}
        <div className="shrink-0 text-right">
          <p className="text-xs text-gray-400 font-body mb-1">{isCsat ? 'CSAT' : 'NPS'}</p>
          {isCsat ? (
            <div className="flex items-center gap-1 justify-end">
              <CsatStars score={Math.round(survey.avgCsat)} />
              <span className="text-sm font-semibold text-gray-800 font-body ml-1">{survey.avgCsat}</span>
            </div>
          ) : (
            <span className={`text-xs font-semibold font-body px-2.5 py-1 rounded-lg ${
              survey.avgNps >= 50 ? 'bg-emerald-100 text-emerald-700' :
              survey.avgNps >= 30 ? 'bg-amber-100 text-amber-700' :
              'bg-rose-100 text-rose-600'
            }`}>
              NPS {survey.avgNps}
            </span>
          )}
          <p className="text-xs text-gray-400 font-body mt-1">
            {survey.responses}/{survey.totalSent} responses
          </p>
        </div>

        <ChevronRight
          size={16}
          className={`text-gray-300 group-hover:text-gray-500 transition-all shrink-0 ${
            isSelected ? (isCsat ? 'rotate-90 text-teal' : 'rotate-90 text-neon') : ''
          }`}
        />
      </div>

      {/* Respondents toggle */}
      {survey.respondents?.length > 0 && (
        <div className="border-t border-gray-50">
          <button
            onClick={(e) => { e.stopPropagation(); setRespondentsOpen((p) => !p) }}
            className={`w-full flex items-center gap-2 px-5 py-2.5 text-xs font-body font-medium transition-colors ${
              respondentsOpen
                ? 'text-gray-800 bg-neon/5'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users size={12} />
            {survey.respondents.length} respondents
            <ChevronDown
              size={12}
              className={`ml-auto transition-transform duration-200 ${respondentsOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {respondentsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3 pt-1 space-y-0.5 border-t border-gray-50 bg-gray-50/40">
                  {survey.respondents.map((r) => (
                    <RespondentRow
                      key={r.id}
                      respondent={r}
                      surveyType={surveyType}
                      isSelected={expandedRespondent?.id === r.id}
                      onClick={() => {
                        onSelect()
                        onRespondentSelect(r)
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

// ─── Main tab ────────────────────────────────────────────────────────────────
export function HistoryTab({ surveyType = 'nps' }) {
  const [selected, setSelected] = useState(null)        // selected survey
  const [selectedRespondent, setSelectedRespondent] = useState(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [scoreMin, setScoreMin] = useState('')
  const [scoreMax, setScoreMax] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const isCsat = surveyType === 'csat'

  const enriched = historyData.map((s) => ({
    ...s,
    client: getClient(s.clientId),
  }))

  const filtered = enriched.filter((s) => {
    if (dateFrom && new Date(s.sentDate) < new Date(dateFrom)) return false
    if (dateTo && new Date(s.sentDate) > new Date(dateTo)) return false
    const score = isCsat ? s.avgCsat : s.avgNps
    if (scoreMin && score < Number(scoreMin)) return false
    if (scoreMax && score > Number(scoreMax)) return false
    return true
  })

  const hasFilters = dateFrom || dateTo || scoreMin || scoreMax
  const clearFilters = () => { setDateFrom(''); setDateTo(''); setScoreMin(''); setScoreMax('') }

  function handleSelectSurvey(survey) {
    if (selected?.id === survey.id) {
      setSelected(null)
      setSelectedRespondent(null)
    } else {
      setSelected(survey)
      setSelectedRespondent(null)
    }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">

      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-gray-900 text-xl">Client Surveys</h2>
          <p className="text-sm text-gray-400 font-body mt-0.5">{filtered.length} campaigns · click a card to view details</p>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-rose-500 hover:text-rose-700 font-body flex items-center gap-1 transition-colors"
            >
              <X size={13} /> Clear filters
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
              <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                'bg-neon text-black'
              }`}>
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
            <Card hover={false} className="p-5">
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
                  <input type="number" placeholder={isCsat ? '1' : '-100'} value={scoreMin}
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
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className={`grid gap-5 ${selected ? 'grid-cols-1 lg:grid-cols-5' : 'grid-cols-1'}`}>
        {/* Survey list */}
        <div className={selected ? 'col-span-1 lg:col-span-3' : 'col-span-1'}>
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                <Calendar size={44} className="text-gray-200 mx-auto mb-3" />
                <p className="font-display font-semibold text-gray-400 text-lg">No campaigns found</p>
                <p className="text-sm text-gray-500 font-body mt-1">Try adjusting your filters</p>
              </motion.div>
            ) : (
              filtered.map((survey) => (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  client={survey.client}
                  surveyType={surveyType}
                  isSelected={selected?.id === survey.id}
                  onSelect={() => handleSelectSurvey(survey)}
                  expandedRespondent={selectedRespondent}
                  onRespondentSelect={setSelectedRespondent}
                />
              ))
            )}
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <div className="col-span-1 lg:col-span-2">
              <DetailPanel
                survey={selected}
                client={selected.client}
                selectedRespondent={selectedRespondent}
                onClose={() => { setSelected(null); setSelectedRespondent(null) }}
                surveyType={surveyType}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
