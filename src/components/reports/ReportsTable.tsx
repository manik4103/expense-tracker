'use client'
import { formatINR } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'
import { Button } from '@/components/ui/button'

type ReportExpense = {
  id?: string
  expense_date: string
  amount: number | string
  notes?: string | null
  categories?: { name: string } | null
  sub_categories?: { name: string } | null
  business_units?: { name: string } | null
  recipients?: { name: string } | null
  profiles?: { full_name: string } | null
}

interface Props {
  expenses: ReportExpense[]
  currentFilters: { from?: string; to?: string; category_id?: string; business_unit_id?: string; recipient_id?: string }
}

export default function ReportsTable({ expenses, currentFilters }: Props) {
  function handleExport() {
    const params = new URLSearchParams()
    if (currentFilters.from) params.set('from', currentFilters.from)
    if (currentFilters.to) params.set('to', currentFilters.to)
    if (currentFilters.category_id) params.set('category_id', currentFilters.category_id)
    if (currentFilters.business_unit_id) params.set('business_unit_id', currentFilters.business_unit_id)
    if (currentFilters.recipient_id) params.set('recipient_id', currentFilters.recipient_id)
    window.open(`/api/export?${params.toString()}`, '_blank')
  }

  return (
    <div>
      <div className="flex justify-end p-3 border-b">
        <Button variant="outline" size="sm" onClick={handleExport}>Export CSV</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              {['Date', 'Category', 'Sub-cat', 'Unit', 'Paid To', 'Amount', 'Notes', 'By'].map(h => (
                <th key={h} className="text-left px-4 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No records found</td></tr>
            ) : expenses.map((e, i) => (
              <tr key={e.id ?? i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{formatDate(e.expense_date)}</td>
                <td className="px-4 py-2">{e.categories?.name ?? '—'}</td>
                <td className="px-4 py-2">{e.sub_categories?.name ?? '—'}</td>
                <td className="px-4 py-2">{e.business_units?.name ?? '—'}</td>
                <td className="px-4 py-2">{e.recipients?.name ?? '—'}</td>
                <td className="px-4 py-2 text-right font-medium">{formatINR(Number(e.amount))}</td>
                <td className="px-4 py-2 max-w-[200px] truncate text-muted-foreground">{e.notes ?? ''}</td>
                <td className="px-4 py-2 text-muted-foreground">{e.profiles?.full_name ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
