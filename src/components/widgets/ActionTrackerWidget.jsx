import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckSquare, LayoutGrid, List, Plus, X, Trash2, Edit2, Check,
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { initialActionsData } from '../../data/dummyData'

const STATUS_COLS  = ['Open', 'In Progress', 'Resolved']
const CAT_OPTIONS  = ['Promoters', 'Passives', 'Detractors']

const statusCfg = {
  Open:          { badge: 'bg-amber-100 text-amber-700',   col: 'bg-amber-50/60 border-amber-100' },
  'In Progress': { badge: 'bg-blue-100 text-blue-700',     col: 'bg-blue-50/60 border-blue-100' },
  Resolved:      { badge: 'bg-emerald-100 text-emerald-700', col: 'bg-emerald-50/60 border-emerald-100' },
}

const catCfg = {
  Promoters:  'bg-emerald-100 text-emerald-700',
  Passives:   'bg-amber-100 text-amber-700',
  Detractors: 'bg-rose-100 text-rose-600',
}

// ─── Add/Edit form ────────────────────────────────────────────────────────────
function ActionForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { title: '', account: '', category: 'Promoters', status: 'Open', notes: '' })
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="border border-neon/30 bg-neon/[0.03] rounded-xl p-4 space-y-3 mt-3">
        <input
          placeholder="Action title *"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/40 bg-white"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            placeholder="Account (optional)"
            value={form.account}
            onChange={(e) => update('account', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 bg-white"
          />
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 bg-white"
          >
            {CAT_OPTIONS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 bg-white"
          >
            {STATUS_COLS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <textarea
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-neon/30 resize-none bg-white"
        />
        <div className="flex gap-2">
          <button
            onClick={() => form.title.trim() && onSave(form)}
            disabled={!form.title.trim()}
            className="px-4 py-1.5 rounded-lg bg-gray-900 text-neon text-sm font-body font-semibold hover:bg-gray-800 disabled:opacity-40 transition-colors"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm font-body text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Kanban card ──────────────────────────────────────────────────────────────
function KanbanCard({ item, onMove, onDelete, onEdit }) {
  const [menu, setMenu] = useState(false)

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-body font-semibold text-gray-800 leading-snug">{item.title}</p>
          {item.account && (
            <p className="text-xs text-gray-400 font-body mt-0.5">{item.account}</p>
          )}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-body ${catCfg[item.category] || 'bg-gray-100 text-gray-500'}`}>
              {item.category}
            </span>
            <span className="text-[10px] text-gray-400 font-body">{item.createdAt}</span>
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
                <button
                  onClick={() => { onEdit(item); setMenu(false) }}
                  className="w-full text-left px-3 py-1.5 text-xs font-body text-gray-600 hover:bg-gray-50"
                >
                  Edit
                </button>
                {STATUS_COLS.filter((s) => s !== item.status).map((s) => (
                  <button
                    key={s}
                    onClick={() => { onMove(item.id, s); setMenu(false) }}
                    className="w-full text-left px-3 py-1.5 text-xs font-body text-gray-600 hover:bg-gray-50"
                  >
                    Move to {s}
                  </button>
                ))}
                <div className="h-px bg-gray-100 my-1" />
                <button
                  onClick={() => { onDelete(item.id); setMenu(false) }}
                  className="w-full text-left px-3 py-1.5 text-xs font-body text-rose-500 hover:bg-rose-50"
                >
                  Delete
                </button>
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
              <span className={`text-xs font-bold font-body px-2.5 py-1 rounded-full ${cfg.badge}`}>
                {col}
              </span>
              <span className="text-xs text-gray-400 font-body">{colItems.length}</span>
            </div>
            <div className="space-y-2">
              {colItems.map((item) => (
                <KanbanCard key={item.id} item={item} onMove={onMove} onDelete={onDelete} onEdit={onEdit} />
              ))}
              {colItems.length === 0 && (
                <p className="text-xs text-gray-400 font-body text-center py-5">No actions</p>
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
      <table className="w-full min-w-[560px]">
        <thead>
          <tr className="border-b border-gray-100">
            {['Title', 'Account', 'Category', 'Status', 'Created', ''].map((h) => (
              <th key={h} className="pb-3 pr-4 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-body">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="py-12 text-center text-sm text-gray-400 font-body">
                No action items yet. Add one above.
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 group">
              <td className="py-3 pr-4 max-w-[200px]">
                <p className="text-sm font-body font-medium text-gray-800 line-clamp-1">{item.title}</p>
                {item.notes && (
                  <p className="text-xs text-gray-400 font-body mt-0.5 line-clamp-1">{item.notes}</p>
                )}
              </td>
              <td className="py-3 pr-4">
                <span className="text-sm font-body text-gray-600">{item.account || '—'}</span>
              </td>
              <td className="py-3 pr-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-body ${catCfg[item.category] || 'bg-gray-100 text-gray-500'}`}>
                  {item.category}
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
              <td className="py-3 pr-4">
                <span className="text-xs text-gray-400 font-body">{item.createdAt}</span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-600 transition-colors"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-300 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export function ActionTrackerWidget({ prefillAction }) {
  const [view,    setView]    = useState('kanban')
  const [items,   setItems]   = useState(() => {
    if (prefillAction) {
      return [
        ...initialActionsData,
        {
          id: `a${Date.now()}`,
          title: prefillAction.title,
          account: prefillAction.accounts?.[0] || '',
          category: prefillAction.category,
          status: 'Open',
          notes: prefillAction.summary,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ]
    }
    return initialActionsData
  })
  const [showForm,  setShowForm]  = useState(false)
  const [editItem,  setEditItem]  = useState(null)

  const addItem = (form) => {
    setItems((prev) => [...prev, { ...form, id: `a${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] }])
    setShowForm(false)
  }

  const saveEdit = (form) => {
    setItems((prev) => prev.map((i) => (i.id === editItem.id ? { ...i, ...form } : i)))
    setEditItem(null)
  }

  const moveItem   = (id, status) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i))
  const deleteItem = (id)         => setItems((prev) => prev.filter((i) => i.id !== id))

  const openCount       = items.filter((i) => i.status === 'Open').length
  const inProgressCount = items.filter((i) => i.status === 'In Progress').length

  return (
    <Card hover={false}>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neon/15 flex items-center justify-center shrink-0">
              <CheckSquare size={15} className="text-gray-700" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-gray-900">Action Tracker</h3>
              <p className="text-xs text-gray-400 font-body mt-0.5">
                {openCount} open · {inProgressCount} in progress · {items.filter((i) => i.status === 'Resolved').length} resolved
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
              {[
                { id: 'kanban', icon: LayoutGrid, label: 'Kanban' },
                { id: 'table',  icon: List,        label: 'Table' },
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
              onClick={() => { setShowForm((p) => !p); setEditItem(null) }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-neon text-xs font-body font-semibold hover:bg-gray-800 transition-colors"
            >
              <Plus size={13} />
              Add Action
            </button>
          </div>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showForm && !editItem && (
            <ActionForm
              onSave={addItem}
              onCancel={() => setShowForm(false)}
            />
          )}
          {editItem && (
            <ActionForm
              initial={editItem}
              onSave={saveEdit}
              onCancel={() => setEditItem(null)}
            />
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent className="pt-0">
        {view === 'kanban' ? (
          <KanbanView
            items={items}
            onMove={moveItem}
            onDelete={deleteItem}
            onEdit={(item) => { setEditItem(item); setShowForm(false) }}
          />
        ) : (
          <TableView
            items={items}
            onMove={moveItem}
            onDelete={deleteItem}
            onEdit={(item) => { setEditItem(item); setShowForm(false) }}
          />
        )}
      </CardContent>
    </Card>
  )
}
