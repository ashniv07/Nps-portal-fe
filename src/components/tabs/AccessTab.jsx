import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import {
  Shield, UserPlus, X, Search, Trash2, MoreVertical,
  CheckCircle2, ChevronDown, Mail, Edit2,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'

// ── Seed data ─────────────────────────────────────────────────────────────────

const seedUsers = [
  { id: 1, name: 'Ashley J.',      email: 'ashley@pulsescore.io',  role: 'admin',      status: 'Active',  joined: '2024-01-10', avatar: 'AJ' },
  { id: 2, name: 'Marcus Chen',    email: 'm.chen@pulsescore.io',  role: 'admin',      status: 'Active',  joined: '2024-02-14', avatar: 'MC' },
  { id: 3, name: 'Priya Mehta',    email: 'p.mehta@pulsescore.io', role: 'leadership', status: 'Active',  joined: '2024-03-01', avatar: 'PM' },
  { id: 4, name: 'James O\'Brien', email: 'james@pulsescore.io',   role: 'leadership', status: 'Active',  joined: '2024-03-12', avatar: 'JO' },
  { id: 5, name: 'Elena Rodriguez',email: 'elena@pulsescore.io',   role: 'leadership', status: 'Invited', joined: '2024-04-01', avatar: 'ER' },
]

const ROLES = ['admin', 'leadership']

const roleConfig = {
  admin: {
    label: 'Admin',
    description: 'Full access — manage surveys, view all analytics, manage team access.',
    bg: 'bg-neon/15',
    text: 'text-gray-800',
    badge: 'bg-neon/20 text-gray-800',
    dot: 'bg-neon',
  },
  leadership: {
    label: 'Leadership',
    description: 'Read-only access — view analytics, reports, and survey results.',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    badge: 'bg-purple-100 text-purple-700',
    dot: 'bg-purple-400',
  },
}

// ── Add / Edit User Modal ─────────────────────────────────────────────────────

function UserModal({ editUser, onSave, onClose }) {
  const isEdit = !!editUser
  const [name,  setName]  = useState(editUser?.name  ?? '')
  const [email, setEmail] = useState(editUser?.email ?? '')
  const [role,  setRole]  = useState(editUser?.role  ?? 'admin')
  const [error, setError] = useState('')

  function handleSave() {
    if (!name.trim())  { setError('Name is required.'); return }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError('Valid email is required.'); return }
    onSave({ name: name.trim(), email: email.trim(), role })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-semibold text-gray-900 text-lg">
              {isEdit ? 'Edit User' : 'Invite User'}
            </h3>
            <p className="text-sm text-gray-400 font-body mt-0.5">
              {isEdit ? 'Update this team member\'s details.' : 'Add a new admin or leadership member.'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold font-body block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah Chen"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              autoFocus
              className="w-full h-11 px-4 rounded-[2px] border border-gray-200 text-sm font-body bg-gray-50 focus:outline-none focus:ring-2 focus:ring-neon/40 focus:border-neon/60 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold font-body block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="user@company.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className="w-full h-11 px-4 rounded-[2px] border border-gray-200 text-sm font-body bg-gray-50 focus:outline-none focus:ring-2 focus:ring-neon/40 focus:border-neon/60 transition-all"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold font-body block mb-2">
              Role
            </label>
            <div className="space-y-2">
              {ROLES.map(r => {
                const cfg = roleConfig[r]
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={clsx(
                      'w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-150',
                      role === r ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-200'
                    )}
                  >
                    <div className={clsx('w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 transition-all', role === r ? 'border-gray-900 bg-gray-900' : 'border-gray-300')} />
                    <div>
                      <p className="text-sm font-semibold font-body text-gray-900">{cfg.label}</p>
                      <p className="text-xs text-gray-500 font-body mt-0.5">{cfg.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {error && <p className="text-xs text-rose-500 font-body font-semibold">{error}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-[2px] border border-gray-200 text-sm font-semibold font-body text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 h-11 rounded-[2px] bg-neon text-black text-sm font-semibold font-body hover:bg-yellow-300 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <UserPlus size={14} />
            {isEdit ? 'Save Changes' : 'Send Invite'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Row actions menu ──────────────────────────────────────────────────────────

function RowMenu({ user, onEdit, onRemove }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <MoreVertical size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-card-hover border border-gray-100 overflow-hidden z-20"
            >
              <button
                onClick={() => { onEdit(); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <Edit2 size={13} className="text-gray-400" /> Edit details
              </button>
              <button
                onClick={() => { onRemove(); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <Trash2 size={13} className="text-rose-400" /> Remove user
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main AccessTab ────────────────────────────────────────────────────────────

export function AccessTab() {
  const [users, setUsers]         = useState(seedUsers)
  const [query, setQuery]         = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [modal, setModal]         = useState(null)   // null | 'add' | { ...user }
  const [toast, setToast]         = useState('')
  const [confirmRemove, setConfirmRemove] = useState(null) // user id

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleSave({ name, email, role }) {
    if (modal === 'add') {
      const ini = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      setUsers(prev => [
        ...prev,
        { id: Date.now(), name, email, role, status: 'Invited', joined: new Date().toISOString().slice(0, 10), avatar: ini },
      ])
      showToast(`Invite sent to ${name}`)
    } else {
      setUsers(prev => prev.map(u => u.id === modal.id ? { ...u, name, email, role } : u))
      showToast('User updated successfully')
    }
    setModal(null)
  }

  function handleRemove(id) {
    setUsers(prev => prev.filter(u => u.id !== id))
    setConfirmRemove(null)
    showToast('User removed')
  }

  const filtered = users.filter(u => {
    const q = query.toLowerCase()
    const matchQ = !q || `${u.name} ${u.email}`.toLowerCase().includes(q)
    const matchR = roleFilter === 'all' || u.role === roleFilter
    return matchQ && matchR
  })

  const adminCount      = users.filter(u => u.role === 'admin').length
  const leadershipCount = users.filter(u => u.role === 'leadership').length
  const invitedCount    = users.filter(u => u.status === 'Invited').length

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Users',  value: users.length,    color: 'text-gray-900' },
          { label: 'Admins',       value: adminCount,       color: 'text-gray-800' },
          { label: 'Leadership',   value: leadershipCount,  color: 'text-purple-700' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="p-4" hover>
            <p className={`text-3xl font-bold font-display ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 font-body mt-0.5 uppercase tracking-wider">{label}</p>
          </Card>
        ))}
      </div>

      {/* Main card */}
      <Card hover={false}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-display font-semibold text-gray-900">Team Access</h2>
              <p className="text-sm text-gray-400 font-body mt-0.5">
                Manage who can access the CPRIME dashboard and what they can do.
              </p>
            </div>
            <button
              onClick={() => setModal('add')}
              className="flex items-center gap-2 h-10 px-4 rounded-[2px] bg-neon text-black text-sm font-semibold font-body hover:bg-yellow-300 transition-colors uppercase tracking-widest shrink-0"
            >
              <UserPlus size={14} /> Invite User
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full h-[38px] pl-9 pr-4 text-sm rounded-[2px] border border-gray-200 bg-gray-50 font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 transition-all"
              />
            </div>
            {/* Role filter */}
            <div className="flex items-center bg-gray-100 rounded-[2px] p-1 gap-0.5 border border-gray-200">
              {['all', 'admin', 'leadership'].map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-[2px] text-xs font-semibold font-body capitalize transition-all duration-150 ${
                    roleFilter === r ? 'bg-gray-900 text-neon shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {r === 'all' ? 'All Roles' : roleConfig[r].label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Role permission legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {ROLES.map(r => {
              const cfg = roleConfig[r]
              return (
                <div key={r} className={`flex items-start gap-3 p-3.5 rounded-xl ${cfg.bg}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
                  <div>
                    <p className={`text-sm font-semibold font-body ${cfg.text}`}>{cfg.label}</p>
                    <p className="text-xs text-gray-500 font-body mt-0.5">{cfg.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* User table */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[2fr_2.5fr_1fr_1fr_36px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
              {['Name', 'Email', 'Role', 'Status', ''].map(h => (
                <p key={h} className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider font-body">{h}</p>
              ))}
            </div>

            <div className="divide-y divide-gray-50">
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <div className="py-14 text-center">
                    <Shield size={36} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 font-body">No users match your search</p>
                  </div>
                ) : (
                  filtered.map(user => {
                    const cfg = roleConfig[user.role]
                    return (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="flex sm:grid sm:grid-cols-[2fr_2.5fr_1fr_1fr_36px] gap-3 sm:gap-4 px-4 sm:px-5 py-4 items-center hover:bg-gray-50/60 transition-colors"
                      >
                        {/* Name + avatar */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-neon flex items-center justify-center text-xs font-bold text-black shrink-0">
                            {user.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 font-body truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 font-body sm:hidden truncate">{user.email}</p>
                          </div>
                        </div>

                        {/* Email — hidden on mobile (shown under name) */}
                        <div className="hidden sm:flex items-center gap-1.5 min-w-0">
                          <Mail size={12} className="text-gray-400 shrink-0" />
                          <p className="text-sm text-gray-600 font-body truncate">{user.email}</p>
                        </div>

                        {/* Role badge */}
                        <div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg font-body ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                        </div>

                        {/* Status */}
                        <div>
                          <span className={clsx(
                            'text-[11px] font-bold px-2 py-0.5 rounded font-body',
                            user.status === 'Active'  ? 'bg-emerald-100 text-emerald-700' :
                            user.status === 'Invited' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-500'
                          )}>
                            {user.status}
                          </span>
                        </div>

                        {/* Actions */}
                        <div>
                          <RowMenu
                            user={user}
                            onEdit={() => setModal(user)}
                            onRemove={() => setConfirmRemove(user.id)}
                          />
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {invitedCount > 0 && (
            <p className="text-xs text-gray-400 font-body mt-3 flex items-center gap-1.5">
              <Mail size={12} />
              {invitedCount} pending invite{invitedCount !== 1 ? 's' : ''} — users will receive an email to set up their account.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Confirm remove dialog */}
      <AnimatePresence>
        {confirmRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} className="text-rose-500" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 text-center">Remove user?</h3>
              <p className="text-sm text-gray-500 font-body text-center mt-2 mb-5 leading-relaxed">
                This person will lose access to the CPRIME dashboard immediately.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmRemove(null)}
                  className="flex-1 h-10 rounded-[2px] border border-gray-200 text-sm font-semibold font-body text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemove(confirmRemove)}
                  className="flex-1 h-10 rounded-[2px] bg-rose-500 text-white text-sm font-semibold font-body hover:bg-rose-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User modal */}
      <AnimatePresence>
        {modal && (
          <UserModal
            editUser={modal === 'add' ? null : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-gray-900 text-white text-sm font-body font-medium px-5 py-3 rounded-full shadow-xl"
          >
            <CheckCircle2 size={15} className="text-neon" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
