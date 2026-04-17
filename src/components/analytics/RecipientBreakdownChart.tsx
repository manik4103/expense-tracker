'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatINR } from '@/lib/utils/currency'

interface Props {
  data: { name: string; total: number }[]
}

export default function RecipientBreakdownChart({ data }: Props) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No recipient data</div>
  )
  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 40)}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 60, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
        <Tooltip formatter={(value) => typeof value === 'number' ? formatINR(value) : String(value ?? '')} />
        <Bar dataKey="total" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => <Cell key={i} fill={i === 0 ? '#3B82F6' : i === 1 ? '#8B5CF6' : '#94A3B8'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
