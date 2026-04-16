import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileSpreadsheet, Send, Bell, Search, Eye, X, CheckCircle2,
  Calendar, Clock, RefreshCw, Play, ChevronDown, Plus, Trash2, Building2, Users, Mail, BarChart2, TrendingUp, Star, ArrowRight, ChevronLeft,
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { StatusBadge } from '../ui/Badge'
import { EmailPreviewModal } from '../modals/EmailPreviewModal'
import { ReminderEmailModal } from '../modals/ReminderEmailModal'
import { clientsData } from '../../data/dummyData'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

const RECURRENCE = ['None', 'Daily', 'Weekly', 'Monthly']

// ─── Survey Type Segmented Control ───────────────────────────────────────────
function SurveyTypeSelector({ value, onChange, size = 'default' }) {
  const types = ['NPS', 'CSAT', 'Both']
  const sm = size === 'sm'
  return (
    <div className={`flex items-center bg-gray-100 rounded-[2px] border border-gray-200 p-1 gap-1`}>
      {types.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`${sm ? 'px-2.5 py-1 text-xs' : 'px-4 py-2 text-sm'} rounded-[2px] font-semibold font-body transition-all duration-200 ${
            value === t ? 'bg-gray-900 text-neon shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

// ─── Send Now Confirmation Modal ─────────────────────────────────────────────
function SendNowModal({ isOpen, surveyType, clientCount, onConfirm, onClose }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-neon/15 flex items-center justify-center mb-5 mx-auto">
          <Play size={24} className="text-yellow-700" />
        </div>
        <h3 className="font-display font-semibold text-gray-900 text-xl text-center mb-2">
          Send Survey Now
        </h3>
        <p className="text-sm text-gray-500 font-body text-center mb-6 leading-relaxed">
          This will immediately send a{' '}
          <strong className="text-gray-800">{surveyType}</strong> survey to{' '}
          <strong className="text-gray-800">{clientCount} client{clientCount !== 1 ? 's' : ''}</strong>.
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-[2px] border border-gray-200 text-sm font-semibold font-body text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-[2px] bg-neon text-black text-sm font-semibold font-body hover:bg-yellow-300 transition-colors uppercase tracking-widest"
          >
            Send Now
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Schedule Panel ───────────────────────────────────────────────────────────
function SchedulePanel({ globalSurveyType }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [recurrence, setRecurrence] = useState('None')
  const [schedType, setSchedType] = useState(globalSurveyType)
  const [scheduled, setScheduled] = useState([
    { id: 1, type: 'NPS',  date: '2024-04-20', time: '09:00', recurrence: 'Weekly',  status: 'Scheduled' },
    { id: 2, type: 'CSAT', date: '2024-04-10', time: '10:30', recurrence: 'None',    status: 'Sent' },
    { id: 3, type: 'Both', date: '2024-04-30', time: '08:00', recurrence: 'Monthly', status: 'Pending' },
  ])

  function addSchedule() {
    if (!date || !time) return
    setScheduled((prev) => [
      ...prev,
      { id: Date.now(), type: schedType, date, time, recurrence, status: 'Scheduled' },
    ])
    setDate(''); setTime(''); setRecurrence('None')
  }

  const statusColors = {
    Scheduled: 'bg-amber-100 text-amber-700',
    Sent:      'bg-emerald-100 text-emerald-700',
    Pending:   'bg-gray-100 text-gray-500',
  }

  return (
    <Card hover={false}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full"
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neon/15 flex items-center justify-center">
                <Calendar size={14} className="text-yellow-700" />
              </div>
              <h2 className="font-display font-semibold text-gray-900">Schedule Surveys</h2>
              {scheduled.filter((s) => s.status === 'Scheduled').length > 0 && (
                <span className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-body">
                  {scheduled.filter((s) => s.status === 'Scheduled').length} upcoming
                </span>
              )}
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </div>
          <p className="text-xs text-gray-400 font-body mt-1 text-left">
            Set date, time and recurrence for automated survey delivery
          </p>
        </CardHeader>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 border-t border-gray-50">
              {/* Schedule form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5 pt-5">
                <div className="col-span-1">
                  <label className="text-[10px] text-gray-500 font-semibold font-body uppercase tracking-wider block mb-1.5">
                    Survey Type
                  </label>
                  <SurveyTypeSelector value={schedType} onChange={setSchedType} size="sm" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold font-body uppercase tracking-wider block mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-[42px] px-3 rounded-[2px] border border-gray-200 text-sm font-body bg-gray-50 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold font-body uppercase tracking-wider block mb-1.5">
                    Time
                  </label>
                  <div className="relative">
                    <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full h-[42px] pl-8 pr-3 rounded-[2px] border border-gray-200 text-sm font-body bg-gray-50 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold font-body uppercase tracking-wider block mb-1.5">
                    Recurrence
                  </label>
                  <div className="relative">
                    <RefreshCw size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select
                      value={recurrence}
                      onChange={(e) => setRecurrence(e.target.value)}
                      className="w-full h-[42px] pl-8 pr-8 rounded-[2px] border border-gray-200 text-sm font-body bg-gray-50 focus:outline-none focus:ring-2 focus:ring-neon/30 appearance-none cursor-pointer"
                    >
                      {RECURRENCE.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={addSchedule}
                    disabled={!date || !time}
                    className="w-full h-[42px] rounded-[2px] bg-gray-900 text-neon text-sm font-semibold font-body hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              {/* Scheduled list */}
              {scheduled.length > 0 ? (
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-[80px_1fr_100px_90px_36px] gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                    {['Type', 'Date & Time', 'Recurrence', 'Status', ''].map((h) => (
                      <p key={h} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-body">{h}</p>
                    ))}
                  </div>
                  {scheduled.map((s) => (
                    <div key={s.id} className="grid grid-cols-[80px_1fr_100px_90px_36px] gap-3 px-4 py-3 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50/60 transition-colors">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-neon/20 text-gray-800 font-body w-fit">{s.type}</span>
                      <span className="text-sm font-body text-gray-700">
                        {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {s.time}
                      </span>
                      <span className="text-sm font-body text-gray-500">{s.recurrence}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-body w-fit ${statusColors[s.status] || 'bg-gray-100 text-gray-500'}`}>
                        {s.status}
                      </span>
                      <button
                        onClick={() => setScheduled((prev) => prev.filter((x) => x.id !== s.id))}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-300 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-gray-200 rounded-lg">
                  <Calendar size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-body">No surveys scheduled yet</p>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// ─── Company Detail Panel ─────────────────────────────────────────────────────
function CompanyDetailPanel({ company, people, onBack, selected, onTogglePerson, onToggleCompany, onPreviewClient, onRemindClient, onSendNow }) {
  const [filterMode, setFilterMode] = useState('nps')
  const isCsat = filterMode === 'csat'

  // Calculate stats
  const responded = people.filter(p => p.status === 'Responded')
  const npsScores = responded.filter(p => p.nps != null).map(p => p.nps)
  const csatScores = responded.filter(p => p.csat != null).map(p => p.csat)
  const avgNps = npsScores.length ? Math.round(npsScores.reduce((a,b) => a+b,0) / npsScores.length) : null
  const avgCsat = csatScores.length ? (csatScores.reduce((a,b) => a+b,0) / csatScores.length).toFixed(1) : null
  const responseRate = people.length ? Math.round((responded.length / people.length) * 100) : 0
  const promoters = npsScores.filter(s => s >= 9)
  const passives = npsScores.filter(s => s >= 7 && s < 9)
  const detractors = npsScores.filter(s => s < 7)

  const companyPeople = people
  const allCompanyIds = companyPeople.map(p => p.id)
  const companySelected = allCompanyIds.every(id => selected.includes(id))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                {company.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-display font-semibold text-gray-900 text-lg">{company}</p>
                <p className="text-xs text-gray-400 font-body">{people.length} contacts</p>
              </div>
            </div>
          </div>
        </div>

        {/* NPS/CSAT Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setFilterMode('nps')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold font-body transition-all ${
              filterMode === 'nps'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            NPS
          </button>
          <button
            onClick={() => setFilterMode('csat')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold font-body transition-all ${
              filterMode === 'csat'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            CSAT
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Executive Summary */}
        <div>
          <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400 mb-3">Executive Summary</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(!isCsat ? [
              { label: 'Sent', value: people.length, icon: Mail },
              { label: 'Responded', value: `${responded.length}`, icon: Users },
              { label: 'Response Rate', value: `${responseRate}%`, icon: BarChart2 },
              { label: 'NPS Score', value: npsScores.length ? Math.round(((promoters.length - detractors.length) / npsScores.length) * 100) : '—', icon: TrendingUp },
            ] : [
              { label: 'No. of Projects', value: people.length, icon: Building2 },
              { label: 'Surveys Sent', value: people.length, icon: Mail },
              { label: 'Responses', value: `${responded.length}`, icon: Users },
              { label: 'Avg CSAT', value: avgCsat ? `${avgCsat}/5` : '—', icon: Star },
            ]).map(({ label, value, icon: Icon }) => (
              <div key={label} className="border border-gray-100 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Icon size={12} className="text-gray-400" />
                </div>
                <p className="text-lg font-bold font-display text-gray-900">{value}</p>
                <p className="text-[10px] text-gray-400 font-body">{label}</p>
              </div>
            ))}
          </div>

          {/* NPS Breakdown */}
          {!isCsat && npsScores.length > 0 && (
            <div className="border border-gray-100 rounded-xl p-4 mt-3">
              <p className="text-xs font-semibold font-body text-gray-600 mb-3">NPS Breakdown</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Promoters', count: promoters.length, pct: Math.round((promoters.length / npsScores.length) * 100), color: 'bg-emerald-500', text: 'text-emerald-600' },
                  { label: 'Passives', count: passives.length, pct: Math.round((passives.length / npsScores.length) * 100), color: 'bg-amber-400', text: 'text-amber-500' },
                  { label: 'Detractors', count: detractors.length, pct: Math.round((detractors.length / npsScores.length) * 100), color: 'bg-rose-500', text: 'text-rose-500' },
                ].map(({ label, count, pct, color, text }) => (
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
                    <span className={`text-xs font-bold font-display w-12 text-right ${text}`}>{count} ({pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contacts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400">Contacts</p>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={companySelected}
                onChange={() => onToggleCompany(company)}
                className="rounded accent-gray-900 w-3.5 h-3.5 cursor-pointer"
                title="Select all contacts"
              />
              {companySelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs text-gray-500 font-body">{allCompanyIds.filter(id => selected.includes(id)).length} selected</span>
                  <Button variant="primary" size="sm" icon={<Play size={13} />} onClick={() => onSendNow(people.filter(p => selected.includes(p.id)))}>
                    Send Now
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Bell size={13} />} onClick={() => onRemindClient(people[0])}>
                    Remind
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {people.map(person => (
              <div key={person.id} className="p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(person.id)}
                    onChange={() => onTogglePerson(person.id)}
                    className="rounded accent-gray-900 w-3.5 h-3.5 cursor-pointer mt-1"
                  />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                    {person.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold font-body text-gray-800">{person.name}</span>
                      {person.status !== 'Pending' && <StatusBadge status={person.status} />}
                    </div>
                    <p className="text-xs text-gray-400 font-body flex items-center gap-1 mt-0.5">
                      <Mail size={9} />{person.email}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    <button
                      onClick={() => onPreviewClient(person)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Preview email"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => onSendNow([person])}
                      className="p-1.5 rounded-lg hover:bg-neon/10 text-gray-400 hover:text-yellow-700 transition-colors"
                      title="Send survey now"
                    >
                      <Play size={14} />
                    </button>
                    <button
                      onClick={() => onRemindClient(person)}
                      className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors"
                      title="Send reminder"
                    >
                      <Bell size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── File Dropzone ────────────────────────────────────────────────────────────
function FileDropzone() {
  const [dragging, setDragging] = useState(false)
  const [uploaded, setUploaded] = useState(null)
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploaded(file.name)
  }
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) setUploaded(file.name)
  }

  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
        dragging ? 'border-neon bg-neon/8 shadow-neon'
        : uploaded ? 'border-emerald-400 bg-emerald-50'
        : 'border-gray-200 bg-gray-50/50 hover:border-neon/60 hover:bg-neon/4'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploaded && inputRef.current?.click()}
      animate={dragging ? { scale: 1.01 } : { scale: 1 }}
    >
      <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
      <AnimatePresence mode="wait">
        {uploaded ? (
          <motion.div key="up" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-body font-semibold text-emerald-700">{uploaded}</p>
              <p className="text-xs text-gray-400 mt-0.5">File ready to import</p>
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600 underline font-body" onClick={(e) => { e.stopPropagation(); setUploaded(null) }}>
              Remove
            </button>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-neon shadow-neon' : 'bg-gray-100'}`}>
              {dragging ? <Upload size={26} className="text-black" /> : <FileSpreadsheet size={26} className="text-gray-400" />}
            </div>
            <div>
              <p className="font-body font-semibold text-gray-700">{dragging ? 'Release to upload' : 'Drag & drop your Excel file'}</p>
              <p className="text-xs text-gray-400 mt-1">Supports .xlsx, .xls, .csv · Up to 10MB</p>
            </div>
            <span className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-500 font-body bg-white hover:bg-gray-50 transition-colors">
              Browse Files
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main SurveyTab ───────────────────────────────────────────────────────────
export function SurveyTab({ surveyType: defaultType = 'nps' }) {
  const [filterMode, setFilterMode] = useState(defaultType)
  const isCsat = filterMode === 'csat'
  const [globalSurveyType, setGlobalSurveyType] = useState('NPS')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const [previewClient, setPreviewClient] = useState(null)
  const [reminderClient, setReminderClient] = useState(null)
  const [showSendNow, setShowSendNow] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)

  const filtered = clientsData.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  )

  // Group by company
  const groupedByCompany = filtered.reduce((acc, client) => {
    if (!acc[client.company]) {
      acc[client.company] = []
    }
    acc[client.company].push(client)
    return acc
  }, {})

  const companies = Object.entries(groupedByCompany).map(([name, people]) => ({
    name,
    people,
  }))

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  
  const toggleSelectCompany = (companyName) => {
    const companyPeople = groupedByCompany[companyName] || []
    const allCompanyIds = companyPeople.map(p => p.id)
    const allSelected = allCompanyIds.every(id => selected.includes(id))
    if (allSelected) {
      setSelected(prev => prev.filter(id => !allCompanyIds.includes(id)))
    } else {
      setSelected(prev => [...new Set([...prev, ...allCompanyIds])])
    }
  }

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((c) => c.id))

  function handleSendNow() {
    setShowSendNow(false)
  }

  const targetCount = selected.length > 0 ? selected.length : filtered.length

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* ── Import Contacts ────────────────────────────────────── */}
        <motion.div variants={item}>
          <Card hover={false}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-neon/15 flex items-center justify-center">
                  <Upload size={14} className="text-yellow-700" />
                </div>
                <h2 className="font-display font-semibold text-gray-900">Import Contacts</h2>
              </div>
              <p className="text-xs text-gray-400 font-body mt-1">
                Upload a spreadsheet with client details to bulk-import contacts
              </p>
            </CardHeader>
            <CardContent>
              <FileDropzone />
              <div className="mt-4 flex gap-3">
                <a href="#" className="text-xs text-teal underline font-body hover:text-teal-light transition-colors">
                  Download template (.xlsx)
                </a>
                <span className="text-gray-200">|</span>
                <a href="#" className="text-xs text-teal underline font-body hover:text-teal-light transition-colors">
                  View import guide
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Schedule Panel ─────────────────────────────────────── */}
        <motion.div variants={item}>
          <SchedulePanel globalSurveyType={globalSurveyType} />
        </motion.div>

        {/* ── Client List (Grouped by Company) ────────────────────────────────────────── */}
        <motion.div variants={item}>
          <Card hover={false}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-display font-semibold text-gray-900">Client List</h2>
                  <p className="text-xs text-gray-400 font-body mt-0.5">
                    {companies.length} companies · {filtered.length} contacts
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* NPS/CSAT Toggle */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setFilterMode('nps')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold font-body transition-all ${
                        filterMode === 'nps'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      NPS
                    </button>
                    <button
                      onClick={() => setFilterMode('csat')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold font-body transition-all ${
                        filterMode === 'csat'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      CSAT
                    </button>
                  </div>

                  {selected.length > 0 && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-body">{selected.length} selected</span>
                      <Button variant="primary" size="sm" icon={<Play size={13} />} onClick={() => setShowSendNow(true)}>
                        Send Now
                      </Button>
                      <Button variant="secondary" size="sm" icon={<Bell size={13} />}>
                        Remind
                      </Button>
                    </motion.div>
                  )}
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 pr-4 py-2 text-sm rounded-[2px] border border-gray-200 bg-gray-50 font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 w-48 transition-all h-[42px]"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 overflow-x-auto">
              {companies.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={28} className="text-gray-200" />
                    <p className="text-sm text-gray-400 font-body">No companies match your search</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {companies.map((company) => {
                    const companyPeople = company.people
                    const allCompanyIds = companyPeople.map(p => p.id)
                    const companySelected = allCompanyIds.every(id => selected.includes(id))
                    const responded = companyPeople.filter(p => p.status === 'Responded').length

                    return (
                      <motion.div
                        key={company.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border border-gray-100 rounded-lg hover:border-neon/30 hover:bg-gray-50/50 transition-all group cursor-pointer"
                      >
                        <button
                          onClick={() => setSelectedCompany(company.name)}
                          className="w-full text-left p-4 flex items-center gap-3 justify-between"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <input
                              type="checkbox"
                              checked={companySelected}
                              onChange={() => toggleSelectCompany(company.name)}
                              onClick={(e) => e.stopPropagation()}
                              className="rounded accent-gray-900 w-3.5 h-3.5 cursor-pointer"
                            />
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                              {company.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold font-body text-gray-800">{company.name}</p>
                              <p className="text-xs text-gray-400 font-body mt-0.5">
                                {companyPeople.length} contacts · {responded} responded
                              </p>
                            </div>
                          </div>
                          <ArrowRight size={14} className="text-gray-300 group-hover:text-neon transition-colors" />
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>

      {/* ── Company Detail View ────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedCompany(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCompany && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedCompany(null)
            }}
          >
            <CompanyDetailPanel
              company={selectedCompany}
              people={groupedByCompany[selectedCompany] || []}
              onBack={() => setSelectedCompany(null)}
              selected={selected}
              onTogglePerson={toggleSelect}
              onToggleCompany={toggleSelectCompany}
              onPreviewClient={setPreviewClient}
              onRemindClient={setReminderClient}
              onSendNow={(people) => {
                if (people.length > 0) {
                  setSelected(people.map(p => p.id))
                  setShowSendNow(true)
                }
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── Modals ─────────────────────────────────────────────── */}
      <EmailPreviewModal
        isOpen={!!previewClient}
        onClose={() => setPreviewClient(null)}
        client={previewClient}
        surveyType={filterMode}
      />

      <ReminderEmailModal
        isOpen={!!reminderClient}
        onClose={() => setReminderClient(null)}
        client={reminderClient}
        surveyType={filterMode}
      />

      <AnimatePresence>
        {showSendNow && (
          <SendNowModal
            isOpen={showSendNow}
            surveyType={filterMode === 'nps' ? 'NPS' : 'CSAT'}
            clientCount={targetCount}
            onConfirm={handleSendNow}
            onClose={() => setShowSendNow(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
