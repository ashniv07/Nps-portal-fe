import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { NpsTrendChart } from '../charts/NpsTrendChart'
import { yoyComparisonData } from '../../data/dummyData'

const catConfig = {
  Promoter:  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Passive:   { bg: 'bg-amber-100',   text: 'text-amber-700' },
  Detractor: { bg: 'bg-rose-100',    text: 'text-rose-600' },
}

function MovementRow({ m }) {
  const fromC = catConfig[m.from] || catConfig.Passive
  const toC   = catConfig[m.to]   || catConfig.Passive
  const isUp  = m.npsChange > 0
  const same  = m.from === m.to

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-body font-semibold text-gray-800 truncate">{m.account}</p>
        <p className="text-[10px] text-gray-400 font-body">{m.region}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-body ${fromC.bg} ${fromC.text}`}>
          {m.from}
        </span>
        <ArrowRight size={10} className={same ? 'text-gray-300' : isUp ? 'text-emerald-500' : 'text-rose-400'} />
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-body ${toC.bg} ${toC.text}`}>
          {m.to}
        </span>
      </div>
      <div className={`text-xs font-bold font-display shrink-0 w-9 text-right ${
        m.npsChange > 0 ? 'text-emerald-600' : m.npsChange < 0 ? 'text-rose-500' : 'text-gray-400'
      }`}>
        {m.npsChange > 0 ? '+' : ''}{m.npsChange}
      </div>
    </div>
  )
}

export function YoYWidget({ surveyType }) {
  const isCsat = surveyType === 'csat'
  const { quarterly, movements } = yoyComparisonData

  const key    = isCsat ? 'csat' : 'nps'
  const latest = quarterly[quarterly.length - 1]
  const prev   = quarterly[quarterly.length - 2]

  const yoyChange = latest[`${key}2024`] - latest[`${key}2023`]
  const qoqChange = latest[`${key}2024`] - prev[`${key}2024`]
  const movedUp   = movements.filter((m) => m.from !== 'Promoter' && m.to === 'Promoter').length
  const movedDown = movements.filter((m) => m.from === 'Promoter' && m.to !== 'Promoter').length

  return (
    <Card hover={false}>
      <CardHeader>
        <h3 className="font-display font-semibold text-gray-900">
          {isCsat ? 'CSAT' : 'NPS'} Trend &amp; Year-over-Year
        </h3>
        <p className="text-xs text-gray-400 font-body mt-0.5">
          Performance over time and account category shifts
        </p>

        {/* Quick stat pills */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            {
              label: 'YoY Change',
              value: `${yoyChange > 0 ? '+' : ''}${yoyChange}${isCsat ? '%' : 'pts'}`,
              color: yoyChange >= 0 ? 'text-emerald-600' : 'text-rose-500',
              icon: yoyChange >= 0 ? TrendingUp : TrendingDown,
            },
            { label: 'Moved Up', value: movedUp, color: 'text-emerald-600', icon: TrendingUp },
            { label: 'Moved Down', value: movedDown, color: 'text-rose-500', icon: TrendingDown },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-gray-400 font-body uppercase tracking-wide mb-0.5">{label}</p>
              <div className="flex items-center justify-center gap-1">
                <Icon size={11} className={color} />
                <p className={`text-base font-bold font-display ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {/* Trend chart */}
        <NpsTrendChart mode={surveyType} />

        {/* QoQ summary row */}
        <div className="flex items-center justify-between mt-3 px-1 text-xs font-body text-gray-400">
          <span>Last 8 months</span>
          <span className={`font-semibold ${qoqChange >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            QoQ: {qoqChange >= 0 ? '+' : ''}{qoqChange}{isCsat ? '%' : 'pts'} vs Q3
          </span>
        </div>

        {/* YoY quarterly table */}
        <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 bg-gray-50 px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-body">
            <span>Quarter</span>
            <span className="text-right">2023</span>
            <span className="text-right">2024</span>
            <span className="text-right col-span-2 pr-1">Change</span>
          </div>
          {quarterly.map((q) => {
            const v23  = q[`${key}2023`]
            const v24  = q[`${key}2024`]
            const diff = v24 - v23
            return (
              <div key={q.quarter} className="grid grid-cols-5 px-3 py-2.5 border-t border-gray-50 text-sm font-body items-center">
                <span className="font-semibold text-gray-700">{q.quarter}</span>
                <span className="text-right text-gray-500">{v23}{isCsat ? '%' : ''}</span>
                <span className="text-right font-semibold text-gray-800">{v24}{isCsat ? '%' : ''}</span>
                <span className={`text-right col-span-2 text-xs font-bold font-display ${diff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {diff >= 0 ? '▲' : '▼'} {Math.abs(diff)}{isCsat ? '%' : 'pts'}
                </span>
              </div>
            )
          })}
        </div>

        {/* Account movements */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-display font-semibold text-gray-800">Account Category Movements</h4>
            <span className="text-xs text-gray-400 font-body">2023 → 2024</span>
          </div>
          <div className="max-h-44 overflow-y-auto">
            {movements.map((m, i) => <MovementRow key={i} m={m} />)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
