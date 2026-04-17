'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { PieLabelRenderProps } from 'recharts'
import { formatINR } from '@/lib/utils/currency'

const DEFAULT_COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#F97316', '#6366F1', '#EC4899']

interface Props {
  data: { name: string; color: string | null; total: number }[]
}

function renderLabel({ name, percent }: PieLabelRenderProps): string {
  return `${name ?? ''} ${(((percent ?? 0) as number) * 100).toFixed(0)}%`
}

export default function SpendByCategoryChart({ data }: Props) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
      No data for this month
    </div>
  )
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={renderLabel}
          labelLine={false}
        >
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={entry.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => typeof value === 'number' ? formatINR(value) : value} />
      </PieChart>
    </ResponsiveContainer>
  )
}
