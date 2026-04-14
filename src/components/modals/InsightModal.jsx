import { Modal } from '../ui/Modal'
import { TrendingUp, TrendingDown, Minus, Users, ThumbsUp, ThumbsDown } from 'lucide-react'
import { promoterBreakdown, npsTrendData } from '../../data/dummyData'
import { NpsTrendChart } from '../charts/NpsTrendChart'

function ReasonBar({ label, count, max, color }) {
  const pct = Math.round((count / max) * 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-body">
        <span className="text-gray-700">{label}</span>
        <span className="font-semibold text-gray-900">{count}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100">
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

export function InsightModal({ isOpen, onClose, type }) {
  const configs = {
    nps: {
      title: 'NPS Score Deep Dive',
      score: 72,
      change: '+8',
      color: '#CDDE33',
      bg: 'bg-neon/10',
      label: 'Net Promoter Score',
    },
    csat: {
      title: 'CSAT Score Analysis',
      score: '4.3',
      change: '+0.3',
      color: '#0F7E6D',
      bg: 'bg-teal/10',
      label: 'Customer Satisfaction',
    },
    promoters: {
      title: 'Promoters Breakdown',
      data: promoterBreakdown.promoters,
      color: '#0F7E6D',
    },
    passives: {
      title: 'Passives Breakdown',
      data: promoterBreakdown.passives,
      color: '#F5A623',
    },
    detractors: {
      title: 'Detractors Breakdown',
      data: promoterBreakdown.detractors,
      color: '#731A42',
    },
  }

  const cfg = configs[type] || configs.nps

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={cfg.title} size="lg">
      {(type === 'nps' || type === 'csat') && (
        <div className="space-y-6">
          <div className={`rounded-xl p-5 ${cfg.bg} flex items-center gap-6`}>
            <div>
              <p className="text-sm text-gray-500 font-body mb-1">{cfg.label}</p>
              <p className="text-6xl font-bold font-display" style={{ color: cfg.color }}>
                {cfg.score}
              </p>
              <p className="text-sm font-body mt-1 text-emerald-600 flex items-center gap-1">
                <TrendingUp size={14} />
                {cfg.change} vs last period
              </p>
            </div>
            <div className="flex-1 space-y-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-400 font-body">Benchmark</p>
                <p className="font-semibold font-body text-gray-800">Industry avg: 45</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-400 font-body">Your Percentile</p>
                <p className="font-semibold font-body text-gray-800">Top 15%</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-display font-semibold text-gray-800 mb-3">8-Month Trend</h3>
            <NpsTrendChart />
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-teal rounded" />
                <span className="text-xs text-gray-500 font-body">NPS Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-teal-light rounded border-dashed" />
                <span className="text-xs text-gray-500 font-body">CSAT %</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {(type === 'promoters' || type === 'passives' || type === 'detractors') && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
            {type === 'promoters' && <ThumbsUp size={20} className="text-teal" />}
            {type === 'passives' && <Minus size={20} className="text-amber-500" />}
            {type === 'detractors' && <ThumbsDown size={20} className="text-magenta" />}
            <div>
              <p className="font-display font-semibold text-gray-800 capitalize">{type}</p>
              <p className="text-xs text-gray-400 font-body">Top feedback themes</p>
            </div>
          </div>
          <div className="space-y-4">
            {cfg.data?.map((item, i) => (
              <ReasonBar
                key={i}
                label={item.reason}
                count={item.count}
                max={Math.max(...cfg.data.map((d) => d.count))}
                color={cfg.color}
              />
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 font-body">
              Based on {cfg.data?.reduce((a, b) => a + b.count, 0)} responses analyzed with sentiment tagging.
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}
