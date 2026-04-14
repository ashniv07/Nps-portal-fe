import { useEffect, useMemo, useState } from 'react'
import { Building2, ChevronDown, Search } from 'lucide-react'
import { clsx } from 'clsx'
import { Card, CardContent, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { clientsData } from '../../data/dummyData'

const STORAGE_KEY = 'cprime_client_access_v1'

function loadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

function saveOverrides(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
}

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors border',
        checked ? 'bg-neon border-neon' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
      )}
    >
      <span
        className={clsx(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}

export function ClientAccessTab() {
  const [query, setQuery] = useState('')
  const [expandedCompanies, setExpandedCompanies] = useState(new Set())
  const [overrides, setOverrides] = useState(() => loadOverrides())

  useEffect(() => {
    saveOverrides(overrides)
  }, [overrides])

  const people = useMemo(() => {
    return clientsData
      .map((c) => ({
        id: c.id,
        name: c.name || '',
        email: c.email || '',
        company: c.company || 'Unknown',
      }))
      .filter((p) => p.email || p.name)
  }, [])

  const companies = useMemo(() => {
    const byCompany = people.reduce((acc, p) => {
      const key = p.company || 'Unknown'
      acc[key] ||= []
      acc[key].push(p)
      return acc
    }, {})

    const normalizedQuery = query.trim().toLowerCase()
    let rows = Object.entries(byCompany)
      .map(([company, users]) => ({
        company,
        users: users
          .slice()
          .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email)),
      }))
      .sort((a, b) => a.company.localeCompare(b.company))

    if (!normalizedQuery) return rows

    rows = rows.filter(({ company, users }) => {
      if (company.toLowerCase().includes(normalizedQuery)) return true
      return users.some((u) =>
        `${u.name} ${u.email}`.toLowerCase().includes(normalizedQuery)
      )
    })

    return rows
  }, [people, query])

  function isEnabled(email) {
    if (!email) return false
    return overrides[email] ?? true
  }

  function setEnabled(email, nextEnabled) {
    setOverrides((prev) => ({ ...prev, [email]: nextEnabled }))
  }

  function setCompanyEnabled(company, users, nextEnabled) {
    setOverrides((prev) => {
      const next = { ...prev }
      for (const u of users) {
        if (!u.email) continue
        next[u.email] = nextEnabled
      }
      return next
    })
  }

  function toggleCompanyExpanded(company) {
    setExpandedCompanies((prev) => {
      const next = new Set(prev)
      if (next.has(company)) {
        next.delete(company)
      } else {
        next.add(company)
      }
      return next
    })
  }

  return (
    <div className="space-y-5">
      <Card hover={false}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display font-semibold text-gray-900">Client Access Management</h2>
              <p className="text-sm text-gray-600 font-body mt-1">
                Manage client companies and their user access to the portal. Enable or disable login access for individual users or entire companies.
              </p>
              <p className="text-xs text-gray-400 font-body mt-1">
                <span className="text-gray-300">💾 Changes saved locally</span>
              </p>
            </div>

            <div className="relative min-w-[280px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search company or user..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 font-body focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon/60 transition-all"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="divide-y divide-gray-100">
            {companies.map(({ company, users }) => {
              const expanded = expandedCompanies.has(company)
              const enabledCount = users.reduce((n, u) => n + (isEnabled(u.email) ? 1 : 0), 0)
              const allEnabled = enabledCount === users.length
              const allDisabled = enabledCount === 0

              return (
                <div key={company} className="py-0">
                  <button
                    type="button"
                    onClick={() => toggleCompanyExpanded(company)}
                    className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center shrink-0 group-hover:from-gray-50 group-hover:to-gray-100 transition-colors">
                      <Building2 size={18} className="text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold text-gray-900 font-body truncate">{company}</p>
                      <p className="text-xs text-gray-500 font-body mt-0.5">
                        {users.length} user{users.length === 1 ? '' : 's'} 
                        <span className="mx-1.5 text-gray-300">•</span>
                        <span className={allEnabled ? 'text-emerald-600 font-medium' : allDisabled ? 'text-gray-400' : 'text-amber-600 font-medium'}>
                          {enabledCount} enabled
                        </span>
                      </p>
                    </div>
                    <ChevronDown
                      size={18}
                      className={clsx('text-gray-400 transition-transform duration-300', expanded && 'rotate-180')}
                    />
                  </button>

                  {expanded && (
                    <div className="bg-gray-50/50 px-4 py-4">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-body">
                          {users.length} User{users.length === 1 ? '' : 's'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={allEnabled ? 'ghost' : 'default'}
                            size="sm"
                            className="text-xs uppercase tracking-[0.12em] h-8 px-3"
                            onClick={() => setCompanyEnabled(company, users, true)}
                          >
                            ✓ Enable All
                          </Button>
                          <Button
                            variant={allDisabled ? 'ghost' : 'default'}
                            size="sm"
                            className="text-xs uppercase tracking-[0.12em] h-8 px-3"
                            onClick={() => setCompanyEnabled(company, users, false)}
                          >
                            ✕ Disable All
                          </Button>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <div className="grid grid-cols-[2fr_2.5fr_1fr] gap-4 px-4 py-3 bg-gray-100 border-b border-gray-200">
                          <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider font-body">
                            Name
                          </p>
                          <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider font-body">
                            Email
                          </p>
                          <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider font-body text-center">
                            Status
                          </p>
                        </div>

                        <div className="divide-y divide-gray-100">
                          {users.map((u, idx) => {
                            const enabled = isEnabled(u.email)
                            return (
                              <div
                                key={u.id}
                                className={clsx(
                                  'grid grid-cols-[2fr_2.5fr_1fr] gap-4 px-4 py-3.5 items-center',
                                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30',
                                  'hover:bg-gray-50 transition-colors'
                                )}
                              >
                                <p className="text-sm text-gray-800 font-body font-medium truncate">
                                  {u.name || <span className="text-gray-300 italic">No name</span>}
                                </p>
                                <p className="text-sm text-gray-600 font-body truncate" title={u.email}>
                                  {u.email}
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                  <span
                                    className={clsx(
                                      'text-xs font-bold font-body tracking-wider px-2 py-1 rounded-md',
                                      enabled 
                                        ? 'text-emerald-700 bg-emerald-50' 
                                        : 'text-gray-500 bg-gray-100'
                                    )}
                                  >
                                    {enabled ? 'ENABLED' : 'DISABLED'}
                                  </span>
                                  <Switch
                                    checked={enabled}
                                    label={`${enabled ? 'Disable' : 'Enable'} access for ${u.email}`}
                                    onChange={(next) => setEnabled(u.email, next)}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
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

      {/* Info Box */}
      <Card hover={false} className="bg-blue-50 border border-blue-100">
        <CardContent className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center mt-0.5">
            <span className="text-xs font-bold text-blue-700">ℹ</span>
          </div>
          <div>
            <p className="text-sm font-body text-blue-900 font-medium">How it works</p>
            <p className="text-xs text-blue-700 font-body mt-1">
              Enable or disable client login access by toggling individual users or using bulk actions per company. Your changes are saved automatically and stored locally on your browser.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

