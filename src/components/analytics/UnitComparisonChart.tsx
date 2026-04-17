'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatINR } from '@/lib/utils/currency'

const COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981']

interface Props {
  data: Record<string, string | number>[]
  units: string[]
}

export default function UnitComparisonChart({ data, units }: Props) {
  if (!data.length || !units.length) return (
    <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No unit data</div>
  )
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(value) => typeof value === 'number' ? formatINR(value) : String(value ?? '')} />
        <Legend />
        {units.map((unit, i) => (
          <Bar key={unit} dataKey={unit} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
