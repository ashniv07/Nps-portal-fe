import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { csatDistributionData } from '../../data/dummyData'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white rounded-xl px-4 py-3 shadow-xl border border-gray-700">
        <p className="text-sm font-body font-semibold">{payload[0].payload.label}</p>
        <p className="text-xs text-gray-400 mt-1">
          <span className="text-neon font-bold text-base">{payload[0].value}%</span> of responses
        </p>
      </div>
    )
  }
  return null
}

export function CsatBarChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={csatDistributionData}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        barSize={28}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Karla' }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Karla' }}
          domain={[0, 50]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)', radius: 6 }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {csatDistributionData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
