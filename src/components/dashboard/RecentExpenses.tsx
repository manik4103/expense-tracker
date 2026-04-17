import Link from 'next/link'
import { formatINR } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'

interface RecentExpense {
  id: string
  expense_date: string
  amount: number
  notes: string | null
  categories: { name: string; color: string | null } | null
  recipients: { name: string } | null
}

interface Props { expenses: RecentExpense[] }

export default function RecentExpenses({ expenses }: Props) {
  if (!expenses.length) return (
    <p className="text-sm text-muted-foreground py-4 text-center">No recent expenses</p>
  )
  return (
    <div className="space-y-2">
      {expenses.map(e => (
        <Link key={e.id} href={`/expenses/${e.id}`}
          className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{e.categories?.name ?? '—'}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(e.expense_date)}
              {e.recipients?.name ? ` · ${e.recipients.name}` : ''}
            </p>
          </div>
          <span className="text-sm font-semibold text-orange-600 ml-3 shrink-0">{formatINR(e.amount)}</span>
        </Link>
      ))}
      <div className="pt-1">
        <Link href="/expenses" className="text-sm text-blue-600 hover:underline">View all expenses &rarr;</Link>
      </div>
    </div>
  )
}
