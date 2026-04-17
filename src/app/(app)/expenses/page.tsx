import Link from 'next/link'
import { getProfile } from '@/lib/actions/auth'
import { getExpenses } from '@/lib/queries/expenses'
import { getCategories, getBusinessUnits } from '@/lib/queries/reference'
import ExpenseTable from '@/components/expenses/ExpenseTable'
import ExpenseFilters from '@/components/expenses/ExpenseFilters'

interface PageProps {
  searchParams: {
    from?: string
    to?: string
    category_id?: string
    business_unit_id?: string
  }
}

export default async function ExpensesPage({ searchParams }: PageProps) {
  const profile = await getProfile()
  const filters = {
    from: searchParams.from,
    to: searchParams.to,
    category_id: searchParams.category_id,
    business_unit_id: searchParams.business_unit_id,
  }

  const [expenses, categories, businessUnits] = await Promise.all([
    getExpenses(filters),
    getCategories(),
    getBusinessUnits(),
  ])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <Link
          href="/expenses/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Add Expense
        </Link>
      </div>

      {/* Filter bar */}
      <ExpenseFilters
        categories={categories}
        businessUnits={businessUnits}
        currentFilters={filters}
      />

      {/* Table */}
      <ExpenseTable
        expenses={expenses}
        isAdmin={profile?.role === 'admin'}
      />
    </div>
  )
}
