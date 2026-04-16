import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ListChecks, LayoutGrid, List, Plus, X, Trash2, Edit2,
  AlertCircle, ChevronDown,
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { initialActionsData } from '../../data/dummyData'

const STATUS_COLS    = ['Open', 'In Progress', 'Resolved']
const CAT_OPTIONS    = ['Promoters', 'Passives', 'Detractors']
const PRIORITY_OPTS  = ['High', 'Medium', 'Low']
const TYPE_OPTIONS   = ['Task', 'Action', 'Follow-up', 'Risk']

const statusCfg = {
  Open:          { badge: 'bg-amber-100 text-amber-700',     col: 'bg-amber-50/60 border-amber-100',     dot: 'bg-amber-400',    line: 'border-amber-200' },
  'In Progress': { badge: 'bg-blue-100 text-blue-700',       col: 'bg-blue-50/60 border-blue-100',       dot: 'bg-blue-500',     line: 'border-blue-200' },
  Resolved:      { badge: 'bg-emerald-100 text-emerald-700', col: 'bg-emerald-50/60 border-emerald-100', dot: 'bg-emerald-500',  line: 'border-emerald-200' },
}

const catCfg = {
  Promoters:  'bg-emerald-100 text-emerald-700',
  Passives:   'bg-amber-100 text-amber-700',
  Detractors: 'bg-rose-100 text-rose-600',
}

const priorityCfg = {
  High:   'bg-rose-100 text-rose-600',
  Medium: 'bg-amber-100 text-amber-600',
  Low:    'bg-gray-100 text-gray-500',
}

const typeCfg = {
  Task:      { bg: 'bg-blue-50',     text: 'text-blue-600',    icon: '☑' },
  Action:    { bg: 'bg-neon/10',     text: 'text-gray-700',    icon: '⚡' },
  'Follow-up': { bg: 'bg-purple-50', text: 'text-purple-600',  icon: '↩' },
  Risk:      { bg: 'bg-rose-50',     text: 'text-rose-600',    icon: '⚠' },
}

// ─── Jira-style Create/Edit Modal ────────────────────────────────────────────
function IssueModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { type: 'Task', title: '', account: '', category: 'Promoters', priority: 'Medium', status: 'Open', notes: '', dueDate: '' }
  )
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }))
  const isEdit = Boolean(initial?.id)

  const modal = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1,    y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
                <AlertCircle size={14} className="text-neon" />
              </div>
              <h3 className="font-display font-semibold text-gray-900">
                {isEdit ? 'Edit Issue' : 'Create Issue'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Modal body */}
          <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

            {/* Issue type selector */}
            <div>
              <label className="text-xs font-semibold font-body text-gray-500 uppercase tracking-wider block mb-2">Issue Type</label>
              <div className="flex gap-2 flex-wrap">
                {TYPE_OPTIONS.map(t => {
                  const cfg = typeCfg[t]
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update('type', t)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body border transition-all ${
                        form.type === t
                          ? `${cfg.bg} ${cfg.text} border-current shadow-sm`
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span>{cfg.icon}</span>{t}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="text-xs font-semibold font-body text-gray-500 uppercase tracking-wider block mb-1.5">
                Summary <span className="text-rose-400">*</span>
              </label>
              <input
                placeholder="Short description of the issue"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/50 bg-gray-50 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold font-body text-gray-500 uppercase tracking-wider block mb-1.5">Description</label>
              <textarea
                placeholder="Add more context or notes about this issue..."
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/50 resize-none bg-gray-50 transition-all"
              />
            </div>

            {/* Fields grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold font-body text-gray-500 uppercase tracking-wider block mb-1.5">Priority</label>
                <div className="relative">
                  <select
                    value={form.priority}
                    onChange={(e) => update('priority', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 bg-gray-50 appearance-none pr-8"
                  >
                    {PRIORITY_OPTS.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold font-body text-gray-500 uppercase tracking-wider block mb-1.5">Status</label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 bg-gray-50 appearance-none pr-8"
                  >
                    {STATUS_COLS.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold font-body text-gray-500 uppercase tracking-wider block mb-1.5">Account</label>
                <input
                  placeholder="Client account"
                  value={form.account}
                  onChange={(e) => update('account', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 bg-gray-50 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold font-body text-gray-500 uppercase tracking-wider block mb-1.5">Category</label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 bg-gray-50 appearance-none pr-8"
                  >
                    {CAT_OPTIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold font-body text-gray-500 uppercase tracking-wider block mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate || ''}
                  onChange={(e) => update('dueDate', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 bg-gray-50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-body">
              {isEdit ? 'Editing existing issue' : 'New issue will appear in Issue Tracker'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-body font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => form.title.trim() && onSave(form)}
                disabled={!form.title.trim()}
                className="px-5 py-2 rounded-xl bg-gray-900 text-neon text-sm font-body font-semibold hover:bg-gray-800 disabled:opacity-40 transition-colors"
              >
                {isEdit ? 'Save Changes' : 'Create Issue'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )

  return createPortal(modal, document.body)
}

// ─── Kanban card ──────────────────────────────────────────────────────────────
function KanbanCard({ item, onMove, onDelete, onEdit }) {
  const [menu, setMenu] = useState(false)
  const tc = typeCfg[item.type] || typeCfg.Task

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          {/* Type tag */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-body ${tc.bg} ${tc.text}`}>
              {tc.icon} {item.type || 'Task'}
            </span>
            {item.priority && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full font-body ${priorityCfg[item.priority] || 'bg-gray-100 text-gray-500'}`}>
                {item.priority}
              </span>
            )}
          </div>
          <p className="text-sm font-body font-semibold text-gray-800 leading-snug">{item.title}</p>
          {item.account && <p className="text-xs text-gray-400 font-body mt-0.5">{item.account}</p>}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-body ${catCfg[item.category] || 'bg-gray-100 text-gray-500'}`}>
              {item.category}
            </span>
            {item.dueDate && (
              <span className="text-[10px] text-gray-400 font-body">Due {item.dueDate}</span>
            )}
          </div>
          {item.notes && (
            <p className="text-xs text-gray-500 font-body mt-1.5 line-clamp-2">{item.notes}</p>
          )}
        </div>

        {/* Menu trigger */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenu((p) => !p)}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <Edit2 size={12} />
          </button>
          <AnimatePresence>
            {menu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-7 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 w-36"
              >
                <button onClick={() => { onEdit(item); setMenu(false) }} className="w-full text-left px-3 py-1.5 text-xs font-body text-gray-600 hover:bg-gray-50">Edit</button>
                {STATUS_COLS.filter((s) => s !== item.status).map((s) => (
                  <button key={s} onClick={() => { onMove(item.id, s); setMenu(false) }} className="w-full text-left px-3 py-1.5 text-xs font-body text-gray-600 hover:bg-gray-50">
                    Move to {s}
                  </button>
                ))}
                <div className="h-px bg-gray-100 my-1" />
                <button onClick={() => { onDelete(item.id); setMenu(false) }} className="w-full text-left px-3 py-1.5 text-xs font-body text-rose-500 hover:bg-rose-50">Delete</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ─── Kanban view ──────────────────────────────────────────────────────────────
function KanbanView({ items, onMove, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {STATUS_COLS.map((col) => {
        const colItems = items.filter((i) => i.status === col)
        const cfg = statusCfg[col]
        return (
          <div key={col} className={`border rounded-xl p-3 ${cfg.col}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold font-body px-2.5 py-1 rounded-full ${cfg.badge}`}>{col}</span>
              <span className="text-xs text-gray-400 font-body">{colItems.length}</span>
            </div>
            <div className="space-y-2">
              {colItems.map((item) => (
                <KanbanCard key={item.id} item={item} onMove={onMove} onDelete={onDelete} onEdit={onEdit} />
              ))}
              {colItems.length === 0 && (
                <p className="text-xs text-gray-400 font-body text-center py-5">No issues</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Table view ───────────────────────────────────────────────────────────────
function TableView({ items, onMove, onDelete, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-100">
            {['Type', 'Summary', 'Account', 'Priority', 'Status', 'Due', ''].map((h) => (
              <th key={h} className="pb-3 pr-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-body">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-400 font-body">No issues yet. Create one above.</td></tr>
          )}
          {items.map((item) => {
            const tc = typeCfg[item.type] || typeCfg.Task
            return (
              <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 group">
                <td className="py-3 pr-3">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-body whitespace-nowrap ${tc.bg} ${tc.text}`}>
                    {tc.icon} {item.type || 'Task'}
                  </span>
                </td>
                <td className="py-3 pr-4 max-w-[200px]">
                  <p className="text-sm font-body font-medium text-gray-800 line-clamp-1">{item.title}</p>
                  {item.notes && <p className="text-xs text-gray-400 font-body mt-0.5 line-clamp-1">{item.notes}</p>}
                </td>
                <td className="py-3 pr-4"><span className="text-sm font-body text-gray-600">{item.account || '—'}</span></td>
                <td className="py-3 pr-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-body ${priorityCfg[item.priority] || 'bg-gray-100 text-gray-500'}`}>
                    {item.priority || '—'}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <select
                    value={item.status}
                    onChange={(e) => onMove(item.id, e.target.value)}
                    className={`text-xs font-bold font-body px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-neon/30 ${statusCfg[item.status]?.badge || 'bg-gray-100 text-gray-500'}`}
                  >
                    {STATUS_COLS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-3 pr-4"><span className="text-xs text-gray-400 font-body">{item.dueDate || '—'}</span></td>
                <td className="py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-600 transition-colors"><Edit2 size={12} /></button>
                    <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-300 hover:text-rose-400 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Backlog view (Jira-style) ────────────────────────────────────────────────
function BacklogView({ items, onDelete, onEdit }) {
  const [collapsed, setCollapsed] = useState({})

  const groups = [
    { key: 'Open',        label: 'To Do' },
    { key: 'In Progress', label: 'In Progress' },
    { key: 'Resolved',    label: 'Done' },
  ]

  const allSorted = [...items].sort((a, b) => a.id.localeCompare(b.id))
  const issueKey = (item) => {
    const idx = allSorted.findIndex((i) => i.id === item.id)
    return `ISS-${String(idx + 1).padStart(3, '0')}`
  }

  if (items.length === 0) {
    return <p className="text-sm text-gray-400 font-body text-center py-12">No issues yet. Create one above.</p>
  }

  return (
    <div className="space-y-2">
      {groups.map(({ key, label }) => {
        const groupItems = items.filter((i) => i.status === key)
        const cfg = statusCfg[key]
        const isCollapsed = collapsed[key]

        return (
          <div key={key} className="border border-gray-100 rounded-xl overflow-hidden">
            {/* Group header */}
            <button
              onClick={() => setCollapsed((p) => ({ ...p, [key]: !p[key] }))}
              className="w-full flex items-center gap-2.5 px-4 py-3 bg-gray-50/80 hover:bg-gray-100/60 transition-colors text-left"
            >
              <ChevronDown
                size={13}
                className={`text-gray-400 transition-transform duration-200 shrink-0 ${isCollapsed ? '-rotate-90' : ''}`}
              />
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full font-body ${cfg.badge}`}>{label}</span>
              <span className="text-xs text-gray-400 font-body">{groupItems.length} issue{groupItems.length !== 1 ? 's' : ''}</span>
            </button>

            {/* Table */}
            {!isCollapsed && (
              <div>
                {groupItems.length > 0 ? (
                  <div>
                    {/* Column headers */}
                    <div className="grid gap-2 px-4 py-2 border-b border-gray-100 bg-white"
                      style={{ gridTemplateColumns: '72px 56px 1fr 74px 60px 80px 44px' }}>
                      {['Type', 'ID', 'Summary', 'Category', 'Priority', 'Due', ''].map((h) => (
                        <span key={h} className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-body">{h}</span>
                      ))}
                    </div>

                    <AnimatePresence>
                      {groupItems.map((item) => {
                        const tc = typeCfg[item.type] || typeCfg.Task
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.14 }}
                            className="grid gap-2 items-center px-4 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/70 group"
                            style={{ gridTemplateColumns: '72px 56px 1fr 74px 60px 80px 44px' }}
                          >
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-body text-center truncate ${tc.bg} ${tc.text}`}>
                              {tc.icon} {item.type}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400 truncate">{issueKey(item)}</span>
                            <div className="min-w-0">
                              <p className="text-xs font-body font-semibold text-gray-800 truncate">{item.title}</p>
                              {item.account && <p className="text-[10px] text-gray-400 font-body truncate">{item.account}</p>}
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full font-body truncate ${catCfg[item.category] || 'bg-gray-100 text-gray-500'}`}>
                              {item.category}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full font-body ${priorityCfg[item.priority] || 'bg-gray-100 text-gray-500'}`}>
                              {item.priority || '—'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-body truncate">{item.dueDate || '—'}</span>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => onEdit(item)} className="p-1 rounded hover:bg-gray-100 text-gray-300 hover:text-gray-600 transition-colors">
                                <Edit2 size={11} />
                              </button>
                              <button onClick={() => onDelete(item.id)} className="p-1 rounded hover:bg-rose-50 text-gray-300 hover:text-rose-400 transition-colors">
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 font-body px-4 py-4">No issues in this section</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export function ActionTrackerWidget({ prefillAction, onPrefillConsumed }) {
  const [view, setView]         = useState('kanban')
  const [items, setItems]       = useState(initialActionsData)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem,  setEditItem]  = useState(null)
  const [prefillData, setPrefillData] = useState(null)

  useEffect(() => {
    if (prefillAction) {
      setPrefillData({
        type: 'Action',
        title: prefillAction.title || '',
        account: prefillAction.accounts?.[0] || '',
        category: prefillAction.category || 'Promoters',
        priority: 'Medium',
        status: 'Open',
        notes: prefillAction.summary || '',
        dueDate: '',
      })
      setEditItem(null)
      setModalOpen(true)
    }
  }, [prefillAction])

  const addItem = (form) => {
    setItems((prev) => [...prev, { ...form, id: `a${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] }])
    setModalOpen(false)
    setPrefillData(null)
    onPrefillConsumed?.()
  }

  const saveEdit = (form) => {
    setItems((prev) => prev.map((i) => (i.id === editItem.id ? { ...i, ...form } : i)))
    setEditItem(null)
    setModalOpen(false)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditItem(null)
    setPrefillData(null)
    onPrefillConsumed?.()
  }

  const moveItem   = (id, status) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i))
  const deleteItem = (id)         => setItems((prev) => prev.filter((i) => i.id !== id))

  const openCount       = items.filter((i) => i.status === 'Open').length
  const inProgressCount = items.filter((i) => i.status === 'In Progress').length

  return (
    <>
      <Card hover={false}>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-neon/15 flex items-center justify-center shrink-0">
                <ListChecks size={15} className="text-gray-700" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-gray-900">Issue Tracker</h3>
                <p className="text-xs text-gray-400 font-body mt-0.5">
                  {openCount} open · {inProgressCount} in progress · {items.filter((i) => i.status === 'Resolved').length} resolved
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
                {[
                  { id: 'kanban',  icon: LayoutGrid, label: 'Board' },
                  { id: 'table',   icon: List,        label: 'Table' },
                  { id: 'backlog', icon: ListChecks,  label: 'Backlog' },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setView(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-body font-semibold transition-all ${
                      view === id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => { setModalOpen(true); setEditItem(null) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-neon text-xs font-body font-semibold hover:bg-gray-800 transition-colors"
              >
                <Plus size={13} />
                Create Issue
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {view === 'kanban' ? (
            <KanbanView
              items={items}
              onMove={moveItem}
              onDelete={deleteItem}
              onEdit={(item) => { setEditItem(item); setModalOpen(true) }}
            />
          ) : view === 'table' ? (
            <TableView
              items={items}
              onMove={moveItem}
              onDelete={deleteItem}
              onEdit={(item) => { setEditItem(item); setModalOpen(true) }}
            />
          ) : (
            <BacklogView
              items={items}
              onDelete={deleteItem}
              onEdit={(item) => { setEditItem(item); setModalOpen(true) }}
            />
          )}
        </CardContent>
      </Card>

      {/* Jira-style modal */}
      {(modalOpen || editItem) && (
        <IssueModal
          initial={editItem || prefillData}
          onSave={editItem ? saveEdit : addItem}
          onClose={handleModalClose}
        />
      )}
    </>
  )
}
