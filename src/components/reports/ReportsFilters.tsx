'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Category, BusinessUnit, Recipient } from '@/types/app.types'

interface Props {
  categories: Category[]
  businessUnits: BusinessUnit[]
  recipients: Recipient[]
  currentFilters: { from?: string; to?: string; category_id?: string; business_unit_id?: string; recipient_id?: string }
}

export default function ReportsFilters({ categories, businessUnits, recipients, currentFilters }: Props) {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    const from = fd.get('from') as string
    const to = fd.get('to') as string
    const cat = fd.get('category_id') as string
    const bu = fd.get('business_unit_id') as string
    const rec = fd.get('recipient_id') as string
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (cat) params.set('category_id', cat)
    if (bu) params.set('business_unit_id', bu)
    if (rec) params.set('recipient_id', rec)
    router.push(`/reports?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="space-y-1">
          <Label className="text-xs">From</Label>
          <Input type="date" name="from" defaultValue={currentFilters.from ?? ''} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">To</Label>
          <Input type="date" name="to" defaultValue={currentFilters.to ?? ''} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Category</Label>
          <select name="category_id" defaultValue={currentFilters.category_id ?? ''}
            className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
            <option value="">All</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Business Unit</Label>
          <select name="business_unit_id" defaultValue={currentFilters.business_unit_id ?? ''}
            className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
            <option value="">All</option>
            {businessUnits.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Recipient</Label>
          <select name="recipient_id" defaultValue={currentFilters.recipient_id ?? ''}
            className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
            <option value="">All</option>
            {recipients.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">Apply Filters</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => router.push('/reports')}>Clear</Button>
      </div>
    </form>
  )
}
