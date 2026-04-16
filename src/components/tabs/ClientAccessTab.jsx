import { useEffect, useMemo, useState } from 'react'
import { Building2, ChevronDown, Search, Plus, X, UserPlus } from 'lucide-react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { clientsData } from '../../data/dummyData'

const STORAGE_KEY = 'cprime_client_access_v1'

function loadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch { return {} }
}

function saveOverrides(next) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
}

// ─── Global Switch ────────────────────────────────────────────────────────────
function GlobalSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-7 w-14 items-center rounded-full transition-colors border-2 shrink-0',
        checked ? 'bg-neon border-neon' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
      )}
    >
      <span className={clsx(
        'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform',
        checked ? 'translate-x-7' : 'translate-x-0.5'
      )} />
    </button>
  )
}

// ─── Add User Modal ───────────────────────────────────────────────────────────
function AddUserModal({ company, onAdd, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function handleAdd() {
    if (!name.trim()) { setError('Name is required.'); return }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return }
    onAdd({ name: name.trim(), email: email.trim() })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-semibold text-gray-900 text-lg">Add User</h3>
            {company && <p className="text-sm text-gray-400 font-body mt-0.5">Adding to {company}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-semibold font-body uppercase tracking-wider block mb-1.5">
              Name
            </label>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              className="w-full h-[42px] px-4 rounded-[2px] border border-gray-200 text-sm font-body bg-gray-50 focus:outline-none focus:ring-2 focus:ring-neon/40 focus:border-neon/60 transition-all"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold font-body uppercase tracking-wider block mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="user@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              className="w-full h-[42px] px-4 rounded-[2px] border border-gray-200 text-sm font-body bg-gray-50 focus:outline-none focus:ring-2 focus:ring-neon/40 focus:border-neon/60 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          {error && (
            <p className="text-xs text-rose-500 font-body">{error}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-[2px] border border-gray-200 text-sm font-semibold font-body text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 h-11 rounded-[2px] bg-neon text-black text-sm font-semibold font-body hover:bg-yellow-300 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <UserPlus size={14} /> Add User
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────
export function ClientAccessTab() {
  const [query, setQuery] = useState('')
  const [expandedCompanies, setExpandedCompanies] = useState(new Set())
  const [overrides, setOverrides] = useState(() => loadOverrides())
  const [globalEnabled, setGlobalEnabled] = useState(true)
  const [addModal, setAddModal] = useState(null)     // { company } | null
  const [extraUsers, setExtraUsers] = useState({})   // { company: [{ id, name, email }] }

  useEffect(() => { saveOverrides(overrides) }, [overrides])

  const basePeople = useMemo(() =>
    clientsData
      .map((c) => ({ id: c.id, name: c.name || '', email: c.email || '', company: c.company || 'Unknown' }))
      .filter((p) => p.email || p.name),
  [])

  const companies = useMemo(() => {
    // Merge base clients with dynamically added users
    const allPeople = [
      ...basePeople,
      ...Object.entries(extraUsers).flatMap(([company, users]) =>
        users.map((u) => ({ ...u, company }))
      ),
    ]

    const byCompany = allPeople.reduce((acc, p) => {
      const key = p.company || 'Unknown'
      acc[key] ||= []
      acc[key].push(p)
      return acc
    }, {})

    const q = query.trim().toLowerCase()
    let rows = Object.entries(byCompany)
      .map(([company, users]) => ({
        company,
        users: users.slice().sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email)),
      }))
      .sort((a, b) => a.company.localeCompare(b.company))

    if (!q) return rows
    return rows.filter(({ company, users }) =>
      company.toLowerCase().includes(q) ||
      users.some((u) => `${u.name} ${u.email}`.toLowerCase().includes(q))
    )
  }, [basePeople, extraUsers, query])

  function isEnabled(email) {
    if (!globalEnabled) return false
    return overrides[email] ?? true
  }

  function setCompanyEnabled(company, users, nextEnabled) {
    setOverrides((prev) => {
      const next = { ...prev }
      for (const u of users) { if (u.email) next[u.email] = nextEnabled }
      return next
    })
  }

  function handleAddUser(company, { name, email }) {
    const newUser = { id: `extra-${Date.now()}`, name, email }
    setExtraUsers((prev) => ({
      ...prev,
      [company]: [...(prev[company] || []), newUser],
    }))
    // Default to enabled
    setOverrides((prev) => ({ ...prev, [email]: true }))
  }

  function toggleCompanyExpanded(company) {
    setExpandedCompanies((prev) => {
      const next = new Set(prev)
      next.has(company) ? next.delete(company) : next.add(company)
      return next
    })
  }

  const totalUsers = companies.reduce((n, c) => n + c.users.length, 0)
  const enabledCount = companies.reduce(
    (n, c) => n + c.users.filter((u) => isEnabled(u.email)).length, 0
  )

  return (
    <div className="space-y-5">
      <Card hover={false}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-display font-semibold text-gray-900">Client Access Management</h2>
              <p className="text-sm text-gray-600 font-body mt-1">
                Manage client companies and their user access to the portal.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search company or user..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-64 pl-9 pr-4 h-[42px] text-sm rounded-[2px] border border-gray-200 bg-gray-50 font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Global toggle */}
          <div className="mt-4 flex items-center justify-between px-4 py-3.5 rounded-[2px] border border-gray-200 bg-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-800 font-body">Enable Client Access</p>
              <p className="text-xs text-gray-400 font-body mt-0.5">
                Master switch — {globalEnabled ? `${enabledCount} of ${totalUsers} users have access` : 'All client access is currently disabled'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold font-body tracking-wider px-2.5 py-1 rounded ${
                globalEnabled ? 'bg-neon/20 text-gray-800' : 'bg-gray-100 text-gray-500'
              }`}>
                {globalEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
              <GlobalSwitch checked={globalEnabled} onChange={setGlobalEnabled} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="divide-y divide-gray-100">
            {companies.map(({ company, users }) => {
              const expanded = expandedCompanies.has(company)
              const enabledInCompany = users.filter((u) => isEnabled(u.email)).length
              const allEnabled = enabledInCompany === users.length
              const allDisabled = enabledInCompany === 0

              return (
                <div key={company}>
                  <button
                    type="button"
                    onClick={() => toggleCompanyExpanded(company)}
                    className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center shrink-0">
                      <Building2 size={18} className="text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold text-gray-900 font-body truncate">{company}</p>
                      <p className="text-xs text-gray-500 font-body mt-0.5">
                        {users.length} user{users.length !== 1 ? 's' : ''}
                        <span className="mx-1.5 text-gray-300">·</span>
                        <span className={allEnabled ? 'text-emerald-600 font-medium' : allDisabled ? 'text-gray-400' : 'text-amber-600 font-medium'}>
                          {enabledInCompany} enabled
                        </span>
                      </p>
                    </div>
                    <ChevronDown size={18} className={clsx('text-gray-400 transition-transform duration-300 shrink-0', expanded && 'rotate-180')} />
                  </button>

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-gray-50/50 px-4 py-4">
                          {/* Company actions bar */}
                          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-body">
                              {users.length} User{users.length !== 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                className="text-xs uppercase tracking-[0.12em] h-8 px-3"
                                onClick={() => setCompanyEnabled(company, users, true)}
                              >
                                ✓ Enable All
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                className="text-xs uppercase tracking-[0.12em] h-8 px-3"
                                onClick={() => setCompanyEnabled(company, users, false)}
                              >
                                ✕ Disable All
                              </Button>
                              <button
                                onClick={() => setAddModal({ company })}
                                className="flex items-center gap-1.5 h-8 px-3 rounded-[2px] bg-neon text-black text-xs font-semibold font-body hover:bg-yellow-300 transition-colors uppercase tracking-widest"
                              >
                                <Plus size={12} /> Add User
                              </button>
                            </div>
                          </div>

                          {/* User table */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white overflow-x-auto">
                            <div className="grid grid-cols-[2fr_2.5fr_1fr] gap-4 px-4 py-3 bg-gray-100 border-b border-gray-200 min-w-[380px]">
                              {['Name', 'Email', 'Access'].map((h) => (
                                <p key={h} className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider font-body">{h}</p>
                              ))}
                            </div>
                            <div className="divide-y divide-gray-100">
                              {users.map((u, idx) => {
                                const enabled = isEnabled(u.email)
                                return (
                                  <div
                                    key={u.id}
                                    className={clsx(
                                      'grid grid-cols-[2fr_2.5fr_1fr] gap-4 px-4 py-3.5 items-center transition-colors min-w-[380px]',
                                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30',
                                      'hover:bg-gray-50'
                                    )}
                                  >
                                    <p className="text-sm text-gray-800 font-body font-medium truncate">
                                      {u.name || <span className="text-gray-300 italic">No name</span>}
                                    </p>
                                    <p className="text-sm text-gray-600 font-body truncate" title={u.email}>
                                      {u.email}
                                    </p>
                                    <div className="flex items-center justify-start">
                                      <span className={clsx(
                                        'text-xs font-bold font-body tracking-wider px-2.5 py-1 rounded',
                                        enabled ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 bg-gray-100'
                                      )}>
                                        {enabled ? 'ENABLED' : 'DISABLED'}
                                      </span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {companies.length === 0 && (
              <div className="py-16 text-center">
                <Building2 size={40} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-500 font-body font-medium">No matches found</p>
                <p className="text-xs text-gray-400 font-body mt-1">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info box */}
      <Card hover={false} className="bg-blue-50 border border-blue-100">
        <CardContent className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center mt-0.5">
            <span className="text-xs font-bold text-blue-700">ℹ</span>
          </div>
          <div>
            <p className="text-sm font-body text-blue-900 font-medium">How it works</p>
            <p className="text-xs text-blue-700 font-body mt-1">
              Use the master "Enable Client Access" toggle to control all portal access at once. Expand a company to add users or use Enable/Disable All. Changes are saved automatically.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <AnimatePresence>
        {addModal && (
          <AddUserModal
            company={addModal.company}
            onAdd={(user) => handleAddUser(addModal.company, user)}
            onClose={() => setAddModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
