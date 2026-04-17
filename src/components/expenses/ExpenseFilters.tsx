'use client'

import { useRouter, usePathname } from 'next/navigation'
import type { Category, BusinessUnit } from '@/types/app.types'

interface ExpenseFiltersProps {
  categories: Category[]
  businessUnits: BusinessUnit[]
  currentFilters: {
    from?: string
    to?: string
    category_id?: string
    business_unit_id?: string
  }
}

export default function ExpenseFilters({
  categories,
  businessUnits,
  currentFilters,
}: ExpenseFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    const from = fd.get('from') as string
    const to = fd.get('to') as string
    const category_id = fd.get('category_id') as string
    const business_unit_id = fd.get('business_unit_id') as string
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (category_id) params.set('category_id', category_id)
    if (business_unit_id) params.set('business_unit_id', business_unit_id)
    router.push(`${pathname}?${params.toString()}`)
  }

  const hasFilters =
    currentFilters.from ||
    currentFilters.to ||
    currentFilters.category_id ||
    currentFilters.business_unit_id

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-3 items-end bg-white border border-gray-200 rounded-lg px-4 py-3"
    >
      <div className="flex flex-col gap-1 min-w-[130px]">
        <label className="text-xs font-medium text-gray-600">From</label>
        <input
          type="date"
          name="from"
          defaultValue={currentFilters.from ?? ''}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[130px]">
        <label className="text-xs font-medium text-gray-600">To</label>
        <input
          type="date"
          name="to"
          defaultValue={currentFilters.to ?? ''}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[150px]">
        <label className="text-xs font-medium text-gray-600">Category</label>
        <select
          name="category_id"
          defaultValue={currentFilters.category_id ?? ''}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[150px]">
        <label className="text-xs font-medium text-gray-600">Business Unit</label>
        <select
          name="business_unit_id"
          defaultValue={currentFilters.business_unit_id ?? ''}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All units</option>
          {businessUnits.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 items-center">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Filter
        </button>
        {hasFilters && (
          <a
            href={pathname}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear
          </a>
        )}
      </div>
    </form>
  )
}
