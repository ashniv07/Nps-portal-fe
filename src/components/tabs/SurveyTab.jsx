import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileSpreadsheet, Send, Bell, Search, Eye, X, CheckCircle2,
  Calendar, Clock, RefreshCw, Play, ChevronDown, Plus, Trash2,
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { StatusBadge } from '../ui/Badge'
import { EmailPreviewModal } from '../modals/EmailPreviewModal'
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
  const [globalSurveyType, setGlobalSurveyType] = useState('NPS')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const [previewClient, setPreviewClient] = useState(null)
  const [showSendNow, setShowSendNow] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)

  const filtered = clientsData.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((c) => c.id))

  function handleSendNow() {
    setShowSendNow(false)
    setSendSuccess(true)
    setTimeout(() => setSendSuccess(false), 3500)
  }

  const targetCount = selected.length > 0 ? selected.length : filtered.length

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* ── Global Actions Bar ─────────────────────────────────── */}
        <motion.div variants={item}>
          <Card hover={false}>
            <CardContent>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-display font-semibold text-gray-900">Survey Actions</h2>
                  <p className="text-xs text-gray-400 font-body mt-0.5">
                    Apply globally to all clients or use per-client controls below
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Survey type global selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-semibold font-body uppercase tracking-wider whitespace-nowrap">Survey Type</span>
                    <SurveyTypeSelector value={globalSurveyType} onChange={setGlobalSurveyType} />
                  </div>

                  {/* Send Now */}
                  <button
                    onClick={() => setShowSendNow(true)}
                    className="flex items-center gap-2 h-11 px-5 rounded-[2px] bg-neon text-black text-sm font-semibold font-body hover:bg-yellow-300 transition-colors uppercase tracking-widest"
                  >
                    <Play size={14} />
                    Send Now
                  </button>
                </div>
              </div>

              {/* Success banner */}
              <AnimatePresence>
                {sendSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200"
                  >
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <p className="text-sm text-emerald-700 font-body font-medium">
                      {globalSurveyType} survey sent to {targetCount} client{targetCount !== 1 ? 's' : ''} successfully.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Schedule Panel ─────────────────────────────────────── */}
        <motion.div variants={item}>
          <SchedulePanel globalSurveyType={globalSurveyType} />
        </motion.div>

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

        {/* ── Client List ────────────────────────────────────────── */}
        <motion.div variants={item}>
          <Card hover={false}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-display font-semibold text-gray-900">Client List</h2>
                  <p className="text-xs text-gray-400 font-body mt-0.5">
                    {clientsData.length} contacts · {clientsData.filter((c) => c.status === 'Responded').length} responded
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
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
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 pr-4 text-left">
                      <input
                        type="checkbox"
                        checked={selected.length === filtered.length && filtered.length > 0}
                        onChange={toggleAll}
                        className="rounded accent-gray-900 w-3.5 h-3.5 cursor-pointer"
                      />
                    </th>
                    {['Name', 'Email', 'Company', 'Status', 'Survey Type', 'Actions'].map((h) => (
                      <th key={h} className="pb-3 pr-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider font-body">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Search size={28} className="text-gray-200" />
                            <p className="text-sm text-gray-400 font-body">No clients match your search</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((client, idx) => (
                        <motion.tr
                          key={client.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group ${
                            selected.includes(client.id) ? 'bg-neon/4' : ''
                          }`}
                        >
                          <td className="py-3.5 pr-4">
                            <input
                              type="checkbox"
                              checked={selected.includes(client.id)}
                              onChange={() => toggleSelect(client.id)}
                              className="rounded accent-gray-900 w-3.5 h-3.5 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                {client.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <span className="text-sm font-body font-medium text-gray-800 whitespace-nowrap">{client.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className="text-sm text-gray-500 font-body">{client.email}</span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className="text-sm font-body text-gray-700 font-medium">{client.company}</span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <StatusBadge status={client.status} />
                          </td>
                          {/* Per-client survey type selector */}
                          <td className="py-3.5 pr-4">
                            <SurveyTypeSelector value={globalSurveyType} onChange={setGlobalSurveyType} size="sm" />
                          </td>
                          <td className="py-3.5">
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setPreviewClient(client)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Preview email"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => { setSelected([client.id]); setShowSendNow(true) }}
                                className="p-1.5 rounded-lg hover:bg-neon/10 text-gray-400 hover:text-yellow-700 transition-colors"
                                title="Send survey now"
                              >
                                <Play size={14} />
                              </button>
                              <button
                                className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                                title="Send reminder"
                              >
                                <Bell size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>

      {/* ── Modals ─────────────────────────────────────────────── */}
      <EmailPreviewModal
        isOpen={!!previewClient}
        onClose={() => setPreviewClient(null)}
        client={previewClient}
        surveyType={defaultType}
      />

      <AnimatePresence>
        {showSendNow && (
          <SendNowModal
            isOpen={showSendNow}
            surveyType={globalSurveyType}
            clientCount={targetCount}
            onConfirm={handleSendNow}
            onClose={() => setShowSendNow(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
