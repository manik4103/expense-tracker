import { requireAdmin } from '@/lib/actions/auth'
import { getFilteredExpenses } from '@/lib/queries/analytics'
import { getCategories, getBusinessUnits, getRecipients } from '@/lib/queries/reference'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReportsTable from '@/components/reports/ReportsTable'
import ReportsFilters from '@/components/reports/ReportsFilters'

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; category_id?: string; business_unit_id?: string; recipient_id?: string }>
}) {
  await requireAdmin()
  const params = await searchParams
  const [expenses, categories, businessUnits, recipients] = await Promise.all([
    getFilteredExpenses(params),
    getCategories(),
    getBusinessUnits(),
    getRecipients(),
  ])

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground text-sm">{expenses.length} records found</p>
        </div>
      </div>

      <ReportsFilters
        categories={categories}
        businessUnits={businessUnits}
        recipients={recipients}
        currentFilters={params}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Expense Records</CardTitle>
          <span className="text-sm font-semibold text-orange-600">
            Total: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(total)}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <ReportsTable expenses={expenses} currentFilters={params} />
        </CardContent>
      </Card>
    </div>
  )
}
