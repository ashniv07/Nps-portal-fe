import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown, Building2, Plus } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { aiSuggestionsData } from '../../data/dummyData'

const priorityConfig = {
  High:   { badge: 'bg-rose-100 text-rose-600',   dot: 'bg-rose-500' },
  Medium: { badge: 'bg-amber-100 text-amber-600',  dot: 'bg-amber-400' },
  Low:    { badge: 'bg-gray-100 text-gray-500',    dot: 'bg-gray-300' },
}

const categoryConfig = {
  Promoters:  'bg-emerald-50 text-emerald-700',
  Passives:   'bg-amber-50 text-amber-700',
  Detractors: 'bg-rose-50 text-rose-600',
}

const impactConfig = {
  positive:  'bg-emerald-100 text-emerald-700',
  retention: 'bg-blue-100 text-blue-700',
}

function SuggestionCard({ suggestion, onCreateAction }) {
  const [expanded, setExpanded] = useState(false)
  const pc = priorityConfig[suggestion.priority]
  const cc = categoryConfig[suggestion.category]
  const ic = impactConfig[suggestion.impactType] || impactConfig.positive

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${
      expanded ? 'border-neon/40 bg-neon/[0.02]' : 'border-gray-100 hover:border-gray-200'
    }`}>
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${pc.dot}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-body ${pc.badge}`}>
              {suggestion.priority}
            </span>
            <span className="text-[10px] font-semibold text-gray-400 font-body uppercase tracking-wide">
              {suggestion.area}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-body ${cc}`}>
              {suggestion.category}
            </span>
          </div>
          <p className="text-sm font-semibold font-body text-gray-800 leading-snug">{suggestion.title}</p>
          <p className="text-xs text-gray-500 font-body mt-0.5 line-clamp-1">{suggestion.summary}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className={`text-xs font-bold font-body px-2 py-0.5 rounded-lg ${ic}`}>
            {suggestion.impact}
          </span>
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-100 space-y-3 pt-3">
              <p className="text-sm text-gray-600 font-body leading-relaxed">
                {suggestion.insight}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Building2 size={11} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 font-body">Accounts:</span>
                </div>
                {suggestion.accounts.map((acc) => (
                  <span key={acc} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-body">
                    {acc}
                  </span>
                ))}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onCreateAction?.(suggestion) }}
                className="flex items-center gap-1.5 text-xs font-semibold font-body text-gray-700 bg-gray-50 hover:bg-neon/10 border border-gray-200 hover:border-neon/40 px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus size={11} />
                Create action item
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function AISuggestionsWidget({ onCreateAction }) {
  const [filter, setFilter] = useState('All')
  const tabs = ['All', 'Promoters', 'Passives', 'Detractors']

  const filtered = filter === 'All'
    ? aiSuggestionsData
    : aiSuggestionsData.filter((s) => s.category === filter)

  return (
    <Card hover={false}>
      <CardHeader>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <Sparkles size={15} className="text-purple-500" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-gray-900">AI Improvement Suggestions</h3>
            <p className="text-xs text-gray-400 font-body mt-0.5">
              Generated from survey scores &amp; response themes
            </p>
          </div>
        </div>

        {/* Category drill-down tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-xs px-3 py-1 rounded-full font-body font-semibold transition-all ${
                filter === tab
                  ? 'bg-gray-900 text-neon'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab}
              {tab !== 'All' && (
                <span className="ml-1 opacity-60">
                  {aiSuggestionsData.filter((s) => s.category === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-2 space-y-2">
        {filtered.map((s) => (
          <SuggestionCard key={s.id} suggestion={s} onCreateAction={onCreateAction} />
        ))}
      </CardContent>
    </Card>
  )
}
