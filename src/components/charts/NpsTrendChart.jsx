import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { npsTrendData } from '../../data/dummyData'

const CustomTooltip = ({ active, payload, label, mode }) => {
  if (active && payload && payload.length) {
    const isCsat = mode === 'csat'
    return (
      <div className="bg-gray-900 text-white rounded-xl px-4 py-3 shadow-xl border border-gray-700">
        <p className="text-xs text-gray-400 mb-2 font-body">{label} 2024</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-sm font-body">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-300">{isCsat ? 'CSAT %' : 'NPS'}:</span>
            <span className="font-semibold text-white">{p.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function NpsTrendChart({ mode = 'nps' }) {
  const isCsat = mode === 'csat'

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={npsTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="npsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0F7E6D" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0F7E6D" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="csatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#25A28F" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#25A28F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#D5E7E7" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#86A1A1', fontFamily: 'Karla' }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#86A1A1', fontFamily: 'Karla' }}
          domain={isCsat ? [60, 100] : [40, 90]}
          tickFormatter={isCsat ? (v) => `${v}%` : undefined}
        />
        <Tooltip content={<CustomTooltip mode={mode} />} />
        {isCsat ? (
          <Area
            type="monotone"
            dataKey="csat"
            stroke="#25A28F"
            strokeWidth={2.5}
            fill="url(#csatGrad)"
            dot={false}
            activeDot={{ r: 6, fill: '#25A28F', stroke: 'white', strokeWidth: 2 }}
          />
        ) : (
          <Area
            type="monotone"
            dataKey="nps"
            stroke="#0F7E6D"
            strokeWidth={2.5}
            fill="url(#npsGrad)"
            dot={false}
            activeDot={{ r: 6, fill: '#0F7E6D', stroke: 'white', strokeWidth: 2 }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}
