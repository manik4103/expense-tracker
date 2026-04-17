import { requireAdmin } from '@/lib/actions/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import UnitComparisonChart from '@/components/analytics/UnitComparisonChart'
import RecipientBreakdownChart from '@/components/analytics/RecipientBreakdownChart'
import SpendByCategoryChart from '@/components/dashboard/SpendByCategoryChart'
import { getUnitComparison, getTopRecipients, getSpendByCategory } from '@/lib/queries/analytics'

export default async function AnalyticsPage() {
  await requireAdmin()
  const [unitData, recipientData, categoryData] = await Promise.all([
    getUnitComparison(),
    getTopRecipients(),
    getSpendByCategory(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Business spending insights</p>
      </div>

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
            <CardTitle className="text-base">Unit Comparison (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <UnitComparisonChart data={unitData.data} units={unitData.units} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Recipients (This Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <RecipientBreakdownChart data={recipientData} />
        </CardContent>
      </Card>
    </div>
  )
}
