import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SummaryCards from '@/components/dashboard/SummaryCards'
import SpendByCategoryChart from '@/components/dashboard/SpendByCategoryChart'
import MonthlyTrendChart from '@/components/dashboard/MonthlyTrendChart'
import RecentExpenses from '@/components/dashboard/RecentExpenses'
import {
  getSummaryTotals,
  getSpendByCategory,
  getMonthlyTrend,
  getRecentExpenses,
} from '@/lib/queries/analytics'

export default async function DashboardPage() {
  const [totals, categoryData, trendData, recentData] = await Promise.all([
    getSummaryTotals(),
    getSpendByCategory(),
    getMonthlyTrend(),
    getRecentExpenses(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your expenses</p>
      </div>

      <SummaryCards {...totals} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spend by Category (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendByCategoryChart data={categoryData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyTrendChart data={trendData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentExpenses expenses={recentData as RecentExpense[]} />
        </CardContent>
      </Card>
    </div>
  )
}

interface RecentExpense {
  id: string
  expense_date: string
  amount: number
  notes: string | null
  categories: { name: string; color: string | null } | null
  recipients: { name: string } | null
}
